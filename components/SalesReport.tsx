import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { TrendingUp, DollarSign, Package, Calendar, Filter, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { StatusPedido } from '../types';

export const SalesReport: React.FC = () => {
  const { pedidos, produtos } = useAppData();
  const [filtroData, setFiltroData] = useState<'todos' | 'mes' | 'semana'>('mes');

  // Filtrar pedidos por data
  const pedidosFiltrados = useMemo(() => {
    const hoje = new Date();
    const pedidosEntregues = pedidos.filter(p => p.status === StatusPedido.ENTREGUE);

    if (filtroData === 'todos') return pedidosEntregues;

    const dataLimite = new Date();
    if (filtroData === 'mes') {
      dataLimite.setMonth(dataLimite.getMonth() - 1);
    } else if (filtroData === 'semana') {
      dataLimite.setDate(dataLimite.getDate() - 7);
    }

    return pedidosEntregues.filter(p => new Date(p.data) >= dataLimite);
  }, [pedidos, filtroData]);

  // Calcular estatísticas de vendas
  const estatisticas = useMemo(() => {
    let totalVendas = 0;
    let totalCusto = 0;
    let totalKilos = 0;
    const produtosVendidos: { [key: string]: { quantidade: number; receita: number; custo: number; kilos: number } } = {};

    pedidosFiltrados.forEach(pedido => {
      totalVendas += pedido.valorTotal;

      pedido.itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (!produto) return;

        const custoItem = (produto.custoUnitario || 0) * item.quantidade;
        totalCusto += custoItem;

        // Calcular kilos (assumindo que tamanhoPacote contém o peso)
        const pesoMatch = produto.tamanhoPacote.match(/(\d+(?:\.\d+)?)\s*kg/i);
        const pesoKg = pesoMatch ? parseFloat(pesoMatch[1]) : 1;
        const kilosItem = pesoKg * item.quantidade;
        totalKilos += kilosItem;

        if (!produtosVendidos[item.produtoId]) {
          produtosVendidos[item.produtoId] = {
            quantidade: 0,
            receita: 0,
            custo: 0,
            kilos: 0
          };
        }

        produtosVendidos[item.produtoId].quantidade += item.quantidade;
        produtosVendidos[item.produtoId].receita += item.precoUnitario * item.quantidade;
        produtosVendidos[item.produtoId].custo += custoItem;
        produtosVendidos[item.produtoId].kilos += kilosItem;
      });
    });

    const lucroLiquido = totalVendas - totalCusto;
    const margemLucro = totalVendas > 0 ? (lucroLiquido / totalVendas) * 100 : 0;

    return {
      totalVendas,
      totalCusto,
      lucroLiquido,
      margemLucro,
      totalKilos,
      produtosVendidos
    };
  }, [pedidosFiltrados, produtos]);

  // Ordenar produtos por receita
  const produtosOrdenados = useMemo(() => {
    return Object.entries(estatisticas.produtosVendidos)
      .map(([produtoId, dados]) => {
        const produto = produtos.find(p => p.id === produtoId);
        return {
          produto,
          ...dados,
          lucro: dados.receita - dados.custo,
          margemLucro: dados.receita > 0 ? ((dados.receita - dados.custo) / dados.receita) * 100 : 0
        };
      })
      .filter(item => item.produto)
      .sort((a, b) => b.receita - a.receita);
  }, [estatisticas.produtosVendidos, produtos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="mr-3 text-purple-600" size={32} />
          Relatório de Vendas
        </h1>
        <p className="text-gray-600 text-sm mt-1">Análise de vendas e lucratividade</p>
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
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              filtroData === 'semana'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            7 dias
          </button>
          <button
            onClick={() => setFiltroData('mes')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              filtroData === 'mes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            30 dias
          </button>
          <button
            onClick={() => setFiltroData('todos')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              filtroData === 'todos'
                ? 'bg-purple-600 text-white shadow-md'
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
            <ArrowUpCircle size={20} className="opacity-70" />
          </div>
          <p className="text-sm opacity-90 mb-1">Receita Total</p>
          <p className="text-2xl font-bold">R$ {estatisticas.totalVendas.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-1">{pedidosFiltrados.length} pedidos</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <Package size={24} />
            <TrendingUp size={20} className="opacity-70" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total em Kilos</p>
          <p className="text-2xl font-bold">{estatisticas.totalKilos.toFixed(1)} kg</p>
          <p className="text-xs opacity-80 mt-1">Produtos vendidos</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <ArrowDownCircle size={24} />
            <DollarSign size={20} className="opacity-70" />
          </div>
          <p className="text-sm opacity-90 mb-1">Custo Total</p>
          <p className="text-2xl font-bold">R$ {estatisticas.totalCusto.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-1">Investimento</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} />
            <span className="text-lg font-bold">{estatisticas.margemLucro.toFixed(1)}%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Lucro Líquido</p>
          <p className="text-2xl font-bold">R$ {estatisticas.lucroLiquido.toFixed(2)}</p>
          <p className="text-xs opacity-80 mt-1">Margem de lucro</p>
        </div>
      </div>

      {/* Lista de Produtos Vendidos */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Package className="mr-2" size={24} />
            Produtos Vendidos
          </h2>
          <p className="text-white text-opacity-90 text-sm mt-1">
            Detalhamento por produto
          </p>
        </div>

        <div className="p-4 space-y-3">
          {produtosOrdenados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p>Nenhuma venda registrada no período selecionado</p>
            </div>
          ) : (
            produtosOrdenados.map((item, index) => (
              <div
                key={item.produto?.id || index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.produto?.nome}</h3>
                    <p className="text-sm text-gray-600">{item.produto?.tamanhoPacote}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.margemLucro >= 30
                        ? 'bg-green-200 text-green-800'
                        : item.margemLucro >= 15
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {item.margemLucro.toFixed(1)}% lucro
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Quantidade</p>
                    <p className="text-lg font-bold text-gray-800">{item.quantidade}x</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Total em Kilos</p>
                    <p className="text-lg font-bold text-gray-800">{item.kilos.toFixed(1)} kg</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Receita</p>
                    <p className="font-bold text-green-600">R$ {item.receita.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Custo</p>
                    <p className="font-bold text-red-600">R$ {item.custo.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lucro</p>
                    <p className="font-bold text-purple-600">R$ {item.lucro.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Nota sobre Custo */}
      {estatisticas.totalCusto === 0 && produtosOrdenados.length > 0 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Precisa de um Aplicativo?:</strong> Fale com o top dos top. 
            Sistemas e Aplicativos de Verdade.
          </p>
        </div>
      )}
    </div>
  );
};
