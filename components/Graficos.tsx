import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Graficos: React.FC = () => {
    const { pedidos, produtos, clientes } = useAppData();

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


        </div>
    );
};
