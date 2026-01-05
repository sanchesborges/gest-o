import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { useDarkMode } from '../hooks/useDarkMode';
import { Wallet, DollarSign, CheckCircle, Calendar, Filter, ArrowLeft, TrendingUp, Download, FileText } from 'lucide-react';
import { StatusPagamento } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ProfitReport: React.FC = () => {
  useDarkMode();
  const navigate = useNavigate();
  const { pedidos, clientes, produtos } = useAppData();
  const [filtroData, setFiltroData] = useState<'todos' | 'mes' | 'semana'>('mes');
  const pageRef = useRef<HTMLDivElement>(null);

  // Filtrar pedidos pagos por data
  const pedidosPagos = useMemo(() => {
    // Pedidos com status pago OU com valor pago parcial
    const todosPagos = pedidos.filter(p =>
      p.statusPagamento === StatusPagamento.PAGO ||
      (p.valorPago && p.valorPago > 0)
    );

    if (filtroData === 'todos') return todosPagos;

    const hoje = new Date();

    if (filtroData === 'semana') {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - 7);
      return todosPagos.filter(p => {
        const dataPgto = p.dataPagamento ? new Date(p.dataPagamento) : new Date(p.data);
        return dataPgto >= dataLimite;
      });
    }

    // Último mês
    const dataLimite = new Date();
    dataLimite.setMonth(dataLimite.getMonth() - 1);
    return todosPagos.filter(p => {
      const dataPgto = p.dataPagamento ? new Date(p.dataPagamento) : new Date(p.data);
      return dataPgto >= dataLimite;
    });
  }, [pedidos, filtroData]);

  // Calcular estatísticas
  const estatisticas = useMemo(() => {
    let totalRecebido = 0;
    let totalCusto = 0;

    pedidosPagos.forEach(pedido => {
      // Valor recebido: se pago integralmente usa valorTotal, senão usa valorPago
      const valorRecebido = pedido.statusPagamento === StatusPagamento.PAGO
        ? pedido.valorTotal
        : (pedido.valorPago || 0);

      totalRecebido += valorRecebido;

      // Calcular custo proporcional
      pedido.itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
          const custoItem = (produto.custoUnitario || 0) * item.quantidade;
          // Se pagamento parcial, calcula proporcionalmente
          if (pedido.statusPagamento !== StatusPagamento.PAGO && pedido.valorPago) {
            const proporcao = pedido.valorPago / pedido.valorTotal;
            totalCusto += custoItem * proporcao;
          } else {
            totalCusto += custoItem;
          }
        }
      });
    });

    const lucroLiquido = totalRecebido - totalCusto;
    const margemLucro = totalRecebido > 0 ? (lucroLiquido / totalRecebido) * 100 : 0;

    return {
      totalRecebido,
      totalCusto,
      lucroLiquido,
      margemLucro,
      quantidadeNotas: pedidosPagos.length
    };
  }, [pedidosPagos, produtos]);

  // Ordenar pedidos por data de pagamento (mais recentes primeiro)
  const pedidosOrdenados = useMemo(() => {
    return [...pedidosPagos].sort((a, b) => {
      const dataA = a.dataPagamento ? new Date(a.dataPagamento) : new Date(a.data);
      const dataB = b.dataPagamento ? new Date(b.dataPagamento) : new Date(b.data);
      return dataB.getTime() - dataA.getTime();
    });
  }, [pedidosPagos]);

  const formatDate = (date: Date | undefined, fallback: Date) => {
    const d = date ? new Date(date) : new Date(fallback);
    return d.toLocaleDateString('pt-BR');
  };

  // Exportar como imagem
  const exportAsImage = async () => {
    if (!pageRef.current) return;

    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `lucro-receitas-${new Date().getTime()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    }
  };

  // Exportar como PDF
  const exportAsPDF = async () => {
    if (!pageRef.current) return;

    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`lucro-receitas-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/vendas')}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              <Wallet className="mr-2 sm:mr-3 text-green-600" size={28} sm:size={32} />
              <span className="hidden sm:inline">Lucro - Receitas Pagas</span>
              <span className="inline sm:hidden">Receitas</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportAsImage}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              title="Salvar como Imagem"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Imagem</span>
            </button>
            <button
              onClick={exportAsPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              title="Salvar como PDF"
            >
              <FileText size={18} />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-1 ml-12">Pagamentos confirmados de pedidos e notas</p>
      </div>

      {/* Filtro de Data */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={20} className="text-gray-600" />
          <span className="font-semibold text-gray-700">Período</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFiltroData('semana')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${filtroData === 'semana'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setFiltroData('mes')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${filtroData === 'mes'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            30 dias
          </button>
          <button
            onClick={() => setFiltroData('todos')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${filtroData === 'todos'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} />
            <CheckCircle size={20} className="opacity-70" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Recebido</p>
          <p className="text-2xl font-bold">R$ {estatisticas.totalRecebido.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-1">{estatisticas.quantidadeNotas} notas pagas</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} />
            <span className="text-lg font-bold">{estatisticas.margemLucro.toFixed(1)}%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Lucro Líquido</p>
          <p className="text-2xl font-bold">R$ {estatisticas.lucroLiquido.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-1">Margem de lucro</p>
        </div>
      </div>

      {/* Lista de Notas Pagas */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <CheckCircle className="mr-2" size={24} />
            Notas Pagas
          </h2>
          <p className="text-white text-opacity-90 text-sm mt-1">
            Histórico de pagamentos recebidos
          </p>
        </div>

        <div className="p-4 space-y-3">
          {pedidosOrdenados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wallet size={48} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum pagamento registrado no período selecionado</p>
            </div>
          ) : (
            pedidosOrdenados.map((pedido) => {
              const cliente = clientes.find(c => c.id === pedido.clienteId);
              const valorRecebido = pedido.statusPagamento === StatusPagamento.PAGO
                ? pedido.valorTotal
                : (pedido.valorPago || 0);
              const isParcial = pedido.statusPagamento !== StatusPagamento.PAGO && pedido.valorPago;

              return (
                <div
                  key={pedido.id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {cliente?.nome || 'Cliente não encontrado'}
                      </h3>
                      <p className="text-sm text-gray-500">Pedido #{pedido.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isParcial
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-green-200 text-green-800'
                        }`}>
                        {isParcial ? 'Parcial' : 'Pago'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        Data do Pagamento
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {formatDate(pedido.dataPagamento, pedido.data)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1 flex items-center">
                        <DollarSign size={12} className="mr-1" />
                        Valor Recebido
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {valorRecebido.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {isParcial && (
                    <div className="mt-2 text-xs text-gray-500">
                      Valor total do pedido: R$ {pedido.valorTotal.toFixed(2)}
                      <span className="text-yellow-600 ml-2">
                        (Restante: R$ {(pedido.valorTotal - valorRecebido).toFixed(2)})
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
