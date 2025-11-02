import React, { useState, useMemo, useRef } from 'react';
import { useAppData } from '../hooks/useAppData';
import { X, Download, Share2, Factory } from 'lucide-react';
import { StatusPedido } from '../types';
import html2canvas from 'html2canvas';

interface ConsolidatedProduct {
  produtoId: string;
  nome: string;
  quantidadeTotal: number;
}

export const FactoryOrders: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { pedidos, produtos } = useAppData();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [includeDelivered, setIncludeDelivered] = useState(true); // Mudado para true por padrão
  const [orderDate, setOrderDate] = useState<Date>(new Date()); // Data do pedido para fábrica
  const contentRef = useRef<HTMLDivElement>(null);

  // Debug inicial
  React.useEffect(() => {
    console.log('🏭 FactoryOrders montado!');
    console.log('📦 Total de pedidos disponíveis:', pedidos.length);
    console.log('📦 Pedidos detalhados:', pedidos.map(p => ({
      id: p.id,
      data: new Date(p.data).toLocaleDateString('pt-BR'),
      dataOriginal: p.data,
      status: p.status,
      itens: p.itens.length,
      produtos: p.itens.map(i => {
        const prod = produtos.find(pr => pr.id === i.produtoId);
        return `${prod?.nome}: ${i.quantidade}`;
      })
    })));
  }, [pedidos, produtos]);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setIncludeDelivered(true); // Volta para true ao limpar
    setOrderDate(new Date()); // Reseta para data atual
  };

  // Consolidar produtos dos pedidos
  const consolidatedProducts = useMemo(() => {
    console.log('🔍 Debug - Total de pedidos:', pedidos.length);
    console.log('🔍 Debug - Filtros:', { startDate, endDate, includeDelivered });

    let filteredPedidos = pedidos;

    // Filtrar por status
    // Por padrão mostra todos (pendentes + entregues) para consolidar o que foi vendido
    // Se desmarcar "incluir entregues", mostra apenas pendentes
    if (!includeDelivered) {
      filteredPedidos = filteredPedidos.filter(p => p.status === StatusPedido.PENDENTE);
      console.log('🔍 Debug - Após filtro de status (apenas pendentes):', filteredPedidos.length);
    } else {
      console.log('🔍 Debug - Mostrando todos os pedidos (pendentes + entregues):', filteredPedidos.length);
    }

    // Filtrar por data
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filteredPedidos = filteredPedidos.filter(p => {
        const pedidoDate = new Date(p.data);
        pedidoDate.setHours(0, 0, 0, 0);
        const match = pedidoDate >= start;
        console.log('🔍 Pedido data:', pedidoDate.toLocaleDateString('pt-BR'), 'vs início:', start.toLocaleDateString('pt-BR'), '- Match:', match);
        return match;
      });
      console.log('🔍 Debug - Após filtro data início:', filteredPedidos.length);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredPedidos = filteredPedidos.filter(p => {
        const pedidoDate = new Date(p.data);
        pedidoDate.setHours(23, 59, 59, 999);
        const match = pedidoDate <= end;
        console.log('🔍 Pedido data:', pedidoDate.toLocaleDateString('pt-BR'), 'vs fim:', end.toLocaleDateString('pt-BR'), '- Match:', match);
        return match;
      });
      console.log('🔍 Debug - Após filtro data fim:', filteredPedidos.length);
    }

    console.log('🔍 Debug - Total filtrado:', filteredPedidos.length);

    // Consolidar produtos
    const productMap = new Map<string, number>();

    filteredPedidos.forEach(pedido => {
      pedido.itens.forEach(item => {
        const currentQty = productMap.get(item.produtoId) || 0;
        productMap.set(item.produtoId, currentQty + item.quantidade);
      });
    });

    // Converter para array e adicionar informações do produto
    const consolidated: ConsolidatedProduct[] = [];
    productMap.forEach((quantidade, produtoId) => {
      const produto = produtos.find(p => p.id === produtoId);
      if (produto) {
        consolidated.push({
          produtoId,
          nome: produto.nome,
          quantidadeTotal: quantidade,
        });
      }
    });

    // Ordenar por nome
    const sorted = consolidated.sort((a, b) => a.nome.localeCompare(b.nome));
    console.log('🔍 Debug - Produtos consolidados:', sorted.length, sorted);
    return sorted;
  }, [pedidos, produtos, startDate, endDate, includeDelivered]);

  const totalItems = consolidatedProducts.reduce((sum, p) => sum + p.quantidadeTotal, 0);

  // Calcular total de quilos baseado no tamanhoPacote
  const totalKilos = useMemo(() => {
    return consolidatedProducts.reduce((sum, p) => {
      const produto = produtos.find(prod => prod.id === p.produtoId);
      if (!produto) return sum;

      // Extrair o valor numérico do tamanhoPacote (ex: "1kg" -> 1, "5kg" -> 5)
      const match = produto.tamanhoPacote.match(/(\d+(?:\.\d+)?)/);
      const kilos = match ? parseFloat(match[1]) : 0;

      return sum + (kilos * p.quantidadeTotal);
    }, 0);
  }, [consolidatedProducts, produtos]);

  const handleDownloadImage = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `pedido-fabrica-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    }
  };

  const handleShareWhatsApp = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      // Converter canvas para blob
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Erro ao gerar imagem.');
          return;
        }

        // Criar mensagem de texto
        let message = `*PEDIDO PARA FÁBRICA - MANÁ*%0A%0A`;
        message += `📅 *Data:* ${orderDate.toLocaleDateString('pt-BR')}%0A`;

        if (startDate || endDate) {
          message += `📊 *Período:* `;
          if (startDate) message += `${new Date(startDate).toLocaleDateString('pt-BR')}`;
          if (startDate && endDate) message += ` até `;
          if (endDate) message += `${new Date(endDate).toLocaleDateString('pt-BR')}`;
          message += `%0A`;
        }

        message += `%0A*PRODUTOS NECESSÁRIOS:*%0A`;
        message += `━━━━━━━━━━━━━━━━━━━━%0A%0A`;

        consolidatedProducts.forEach(product => {
          message += `• *${product.nome}*: ${product.quantidadeTotal} un%0A`;
        });

        message += `%0A━━━━━━━━━━━━━━━━━━━━%0A`;
        message += `📦 *TOTAL:* ${totalItems} itens | ${totalKilos.toFixed(1)} kg%0A%0A`;
        message += `_Pedido gerado automaticamente pelo sistema SB_`;

        // Abrir WhatsApp com a mensagem
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');

        // Nota: O compartilhamento de imagem via WhatsApp Web não é direto
        // O usuário precisará fazer upload manual da imagem baixada
        alert('Mensagem enviada! Para incluir a imagem, baixe-a e anexe manualmente no WhatsApp.');
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao compartilhar. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start z-50 p-4 pb-28 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 mb-8 max-h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Factory className="mr-3" size={28} />
              Pedidos Para Fábrica
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filtros e Configurações</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Limpar Filtros
            </button>
          </div>

          {/* Data do Pedido para Fábrica */}
          <div className="mb-4 bg-white p-4 rounded-lg border border-indigo-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Data do Pedido para Fábrica
            </label>
            <input
              type="date"
              value={orderDate.toISOString().split('T')[0]}
              onChange={(e) => setOrderDate(new Date(e.target.value + 'T12:00:00'))}
              className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta é a data que aparecerá no pedido gerado (documento e WhatsApp)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDelivered}
                  onChange={(e) => setIncludeDelivered(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Incluir pedidos entregues
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Content to be exported */}
        <div ref={contentRef} className="p-8 bg-white overflow-y-auto flex-1">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">PEDIDO PARA FÁBRICA</h1>
            <p className="text-gray-600">MANÁ - Produtos de Qualidade</p>
            <p className="text-sm text-gray-500 mt-2">
              Data: {orderDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            {(startDate || endDate) && (
              <p className="text-sm text-gray-500">
                Período: {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : '...'} até{' '}
                {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : '...'}
              </p>
            )}
          </div>

          {consolidatedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-semibold mb-4">Nenhum produto encontrado</p>
              <div className="text-sm space-y-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto text-left">
                <p className="font-medium text-yellow-800 text-center">Informações de Debug:</p>
                <div className="grid grid-cols-2 gap-2">
                  <p>• Total de pedidos: {pedidos.length}</p>
                  <p>• Pedidos pendentes: {pedidos.filter(p => p.status === StatusPedido.PENDENTE).length}</p>
                  <p>• Pedidos entregues: {pedidos.filter(p => p.status === StatusPedido.ENTREGUE).length}</p>
                  <p>• Incluir entregues: {includeDelivered ? 'Sim' : 'Não'}</p>
                </div>
                <div className="border-t border-yellow-300 pt-2">
                  <p className="font-medium text-yellow-800">Filtros Aplicados:</p>
                  <p>• Data início: {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'Nenhum'}</p>
                  <p>• Data fim: {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'Nenhum'}</p>
                </div>
                <div className="border-t border-yellow-300 pt-2">
                  <p className="font-medium text-yellow-800">Pedidos Pendentes:</p>
                  {pedidos.filter(p => p.status === StatusPedido.PENDENTE).length === 0 ? (
                    <p className="text-red-600">⚠️ Não há pedidos pendentes!</p>
                  ) : (
                    pedidos.filter(p => p.status === StatusPedido.PENDENTE).map(p => (
                      <p key={p.id} className="text-xs">
                        • Pedido {p.id.substring(0, 8)} - Data: {new Date(p.data).toLocaleDateString('pt-BR')} - {p.itens.length} itens
                      </p>
                    ))
                  )}
                </div>
                {includeDelivered && (
                  <div className="border-t border-yellow-300 pt-2">
                    <p className="font-medium text-yellow-800">Pedidos Entregues (primeiros 5):</p>
                    {pedidos.filter(p => p.status === StatusPedido.ENTREGUE).slice(0, 5).map(p => (
                      <p key={p.id} className="text-xs">
                        • Pedido {p.id.substring(0, 8)} - Data: {new Date(p.data).toLocaleDateString('pt-BR')} - {p.itens.length} itens
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm mt-4 font-medium">💡 Dica: {
                !includeDelivered && pedidos.filter(p => p.status === StatusPedido.PENDENTE).length === 0
                  ? 'Não há pedidos pendentes. Marque "Incluir pedidos entregues" para ver o histórico.'
                  : !includeDelivered && pedidos.filter(p => p.status === StatusPedido.PENDENTE).length === 1
                    ? 'Há apenas 1 pedido pendente. Verifique se a data dele corresponde ao filtro, ou marque "Incluir pedidos entregues".'
                    : includeDelivered && pedidos.filter(p => p.status === StatusPedido.ENTREGUE).length === 0
                      ? 'Não há pedidos entregues no período selecionado. Ajuste as datas.'
                      : 'Ajuste os filtros de data ou clique em "Limpar Filtros"'
              }</p>
            </div>
          ) : (
            <>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold text-gray-700 border-b-2 border-gray-300">
                        Produto
                      </th>
                      <th className="py-3 px-4 text-center font-bold text-gray-700 border-b-2 border-gray-300">
                        Quantidade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {consolidatedProducts.map((product, index) => (
                      <tr
                        key={product.produtoId}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                          {product.nome}
                        </td>
                        <td className="py-3 px-4 border-b border-gray-200 text-center font-semibold text-gray-800">
                          {product.quantidadeTotal} un
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-indigo-50">
                    <tr>
                      <td className="py-4 px-4 font-bold text-gray-800 text-lg">
                        TOTAL
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-indigo-600 text-lg">
                        {totalItems} itens | {totalKilos.toFixed(1)} kg
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Pedido gerado automaticamente pelo Sistema SB</p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 rounded-b-2xl border-t flex flex-row gap-3 justify-end flex-shrink-0">
          <button
            onClick={handleDownloadImage}
            disabled={consolidatedProducts.length === 0}
            className="bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="mr-2" size={20} />
            <span className="hidden sm:inline">Baixar Imagem</span>
            <span className="sm:hidden">Baixar</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            disabled={consolidatedProducts.length === 0}
            className="bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="mr-2" size={20} />
            <span className="hidden sm:inline">Compartilhar WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
