import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { generateSalesSummary } from '../services/geminiService';

export const Graficos: React.FC = () => {
    const { pedidos, produtos, clientes } = useAppData();
    const [summary, setSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const salesData = pedidos.reduce((acc, pedido) => {
        const date = pedido.data.toLocaleDateString('pt-BR');
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += pedido.valorTotal;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(salesData).map(date => ({
        name: date,
        Vendas: salesData[date],
    })).slice(-7);

    const productSales = pedidos.flatMap(p => p.itens).reduce((acc, item) => {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
            if (!acc[produto.nome]) {
                acc[produto.nome] = 0;
            }
            acc[produto.nome] += item.quantidade;
        }
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(productSales).map(name => ({
        name,
        value: productSales[name]
    }));

    const COLORS = ['#5B6B9E', '#A8D96E', '#f59e0b', '#ef4444', '#3b82f6'];

    const handleGenerateSummary = async () => {
        setIsLoadingSummary(true);
        const result = await generateSalesSummary(pedidos, produtos, clientes);
        setSummary(result);
        setIsLoadingSummary(false);
    };

    return (
        <div className="space-y-8 p-4 pb-28">
            <h2 className="text-3xl font-bold text-gray-800">Gráficos e Análises</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Vendas nos Últimos 7 Dias</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="Vendas" fill="#5B6B9E" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Produtos Mais Vendidos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie 
                                data={pieData} 
                                cx="50%" 
                                cy="50%" 
                                labelLine={false} 
                                outerRadius={100} 
                                fill="#8884d8" 
                                dataKey="value" 
                                nameKey="name" 
                                label={(entry: any) => `${entry.name.split(' ')[0]} (${(entry.percent * 100).toFixed(0)}%)`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value} unidades`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                        <Sparkles className="mr-2 text-brand-accent" />
                        Resumo de Vendas com IA
                    </h3>
                    <button
                        onClick={handleGenerateSummary}
                        disabled={isLoadingSummary}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center transition-colors w-full sm:w-auto"
                    >
                        {isLoadingSummary ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Gerando...
                            </>
                        ) : 'Gerar Resumo'}
                    </button>
                </div>
                {summary ? (
                    <div className="prose prose-indigo max-w-none bg-gray-50 p-4 rounded-lg text-gray-900" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
                ) : (
                    <p className="text-gray-500">Clique em "Gerar Resumo" para obter uma análise inteligente de suas vendas recentes.</p>
                )}
            </div>
        </div>
    );
};
