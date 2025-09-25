
import React, { useState, useEffect } from 'react';
import { useAppData } from '../hooks/useAppData';
import { DollarSign, Package, ShoppingCart, AlertTriangle, Sparkles, UserPlus, UserCheck, Bike, Phone, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatusPagamento, UserRole, StatusPedido, Pedido } from '../types';
import { generateSalesSummary } from '../services/geminiService';
import { DeliveryNote } from './DeliveryNote';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center transform hover:scale-105 transition-transform duration-300">
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AddEntregadorModal: React.FC<{ onClose: () => void, onAdd: (data: { nome: string, telefone: string }) => void }> = ({ onClose, onAdd }) => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nome.trim()) {
            onAdd({ nome: nome.trim(), telefone: telefone.trim() });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                    <div className="flex items-center">
                        <UserPlus className="text-indigo-600 mr-3" size={28}/>
                        <h2 className="text-2xl font-bold text-gray-800">Novo Entregador</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            placeholder="Ex: João da Silva"
                        />
                    </div>
                    <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input
                            type="tel"
                            id="telefone"
                            value={telefone}
                            onChange={e => setTelefone(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="(11) 98765-4321"
                        />
                    </div>
                    {/* Footer with buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EntregadoresView: React.FC = () => {
    const { entregadores, pedidos, clientes, addEntregador } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddEntregador = (data: { nome: string; telefone: string }) => {
        addEntregador(data);
    };

    return (
        <div className="space-y-6">
            {isModalOpen && <AddEntregadorModal onClose={() => setIsModalOpen(false)} onAdd={handleAddEntregador} />}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
                    <Bike className="mr-3" size={32} />
                    Controle de Entregadores
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                    <UserPlus className="mr-2" size={20} />
                    Novo Entregador
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entregadores.map(entregador => {
                    const entregas = pedidos.filter(p => p.entregadorId === entregador.id && p.status === StatusPedido.ENTREGUE);
                    const totalEntregas = entregas.length;
                    const valorTotalEntregue = entregas.reduce((sum, p) => sum + p.valorTotal, 0);
                    const clientesAtendidosNomes = [...new Set(entregas.map(p => p.clienteId))]
                        .map(cId => clientes.find(c => c.id === cId)?.nome)
                        .filter(Boolean)
                        .join(', ');

                    return (
                        <div key={entregador.id} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-3">
                                <div className="p-3 bg-indigo-100 rounded-full mr-3">
                                    <UserCheck className="text-indigo-600" size={20}/>
                                </div>
                                <h3 className="text-lg font-bold text-indigo-800">{entregador.nome}</h3>
                            </div>
                            <div className="space-y-2 text-gray-700">
                                {entregador.telefone && (
                                    <p className="text-sm flex items-center">
                                        <Phone size={14} className="mr-2 text-gray-500" />
                                        <strong>Telefone:</strong>
                                        <span className="font-semibold text-base ml-2">{entregador.telefone}</span>
                                    </p>
                                )}
                                <p className="text-sm"><strong>Entregas Realizadas:</strong> <span className="font-semibold text-base">{totalEntregas}</span></p>
                                <p className="text-sm"><strong>Valor Total Entregue:</strong> <span className="font-semibold text-base text-green-600">R$ {valorTotalEntregue.toFixed(2)}</span></p>
                                <div>
                                    <strong className="text-sm">Estabelecimentos Atendidos:</strong>
                                    <p className="text-xs text-gray-500 italic mt-1 break-words">{clientesAtendidosNomes || 'Nenhuma entrega registrada'}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const EntregadorDashboard: React.FC = () => {
    const { pedidos, clientes, entregadores, produtos } = useAppData();
    const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);

    // Em uma aplicação real, isso viria da autenticação.
    // Assumimos que o usuário logado é o primeiro entregador.
    const currentEntregador = entregadores.length > 0 ? entregadores[0] : null; 

    if (!currentEntregador) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Bike className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Nenhum Entregador</h2>
                <p className="text-gray-600 mt-2">Nenhum entregador foi cadastrado no sistema ainda.</p>
            </div>
        );
    }

    const myPendingDeliveries = pedidos.filter(p => 
        p.entregadorId === currentEntregador.id && p.status === StatusPedido.PENDENTE
    ).sort((a, b) => a.data.getTime() - b.data.getTime());

    const handleOpenNote = (pedido: Pedido) => {
        setSelectedOrder(pedido);
    }
    
    const handleCloseNote = () => {
        setSelectedOrder(null);
    }

    return (
        <div className="space-y-6">
            {selectedOrder && <DeliveryNote pedido={selectedOrder} onClose={handleCloseNote} />}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Minhas Entregas</h2>
                    <p className="text-gray-600">Olá, {currentEntregador.nome.split(' ')[0]}! Aqui estão seus pedidos pendentes.</p>
                </div>
                <div className="text-center bg-white p-3 rounded-xl shadow shrink-0">
                    <p className="text-sm font-medium text-gray-500">Entregas Hoje</p>
                    <p className="text-3xl font-bold text-indigo-600">{myPendingDeliveries.length}</p>
                </div>
            </div>

            {myPendingDeliveries.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md">
                    <UserCheck size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">Nenhuma entrega pendente!</h3>
                    <p>Você está em dia com suas entregas.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myPendingDeliveries.map(pedido => {
                        const cliente = clientes.find(c => c.id === pedido.clienteId);
                        const itemsDescription = pedido.itens.map(item => {
                            const produto = produtos.find(p => p.id === item.produtoId);
                            // Shorten name like "Pão de Queijo Tradicional 1kg" to "Pão de Queijo..."
                            const shortName = produto?.nome.split(' ').slice(0, 3).join(' ') || 'Produto';
                            return `${item.quantidade}x ${shortName}`;
                        }).join(', ');

                        return (
                            <div key={pedido.id} className="bg-white rounded-2xl shadow-lg p-5 transform hover:scale-105 transition-transform duration-300">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-800">{cliente?.nome}</h3>
                                        <p className="text-sm text-gray-500">{cliente?.endereco}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-800">R$ {pedido.valorTotal.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">{cliente?.condicaoPagamento}</p>
                                    </div>
                                </div>
                                <div className="mt-3 border-t pt-3">
                                    <p className="text-sm text-gray-600 italic truncate" title={itemsDescription}>{itemsDescription}</p>
                                </div>
                                <button
                                    onClick={() => handleOpenNote(pedido)}
                                    className="mt-4 w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
                                >
                                    <Bike size={18} className="mr-2"/>
                                    Iniciar Entrega / Obter Assinatura
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export const Dashboard: React.FC<{userRole: UserRole}> = ({userRole}) => {
    
    if (userRole === UserRole.ENTREGADOR) {
        return <EntregadorDashboard />;
    }
    
    // Admin Dashboard Logic
    const { pedidos, produtos, clientes } = useAppData();
    const [summary, setSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const faturamentoTotal = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);
    const contasReceber = pedidos.filter(p => p.statusPagamento === StatusPagamento.PENDENTE || p.statusPagamento === StatusPagamento.ATRASADO).reduce((acc, p) => acc + p.valorTotal, 0);
    const produtosBaixoEstoque = produtos.filter(p => p.estoqueAtual < p.estoqueMinimo).length;

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

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

    const handleGenerateSummary = async () => {
        setIsLoadingSummary(true);
        const result = await generateSalesSummary(pedidos, produtos, clientes);
        setSummary(result);
        setIsLoadingSummary(false);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard title="Faturamento Total" value={`R$ ${faturamentoTotal.toFixed(2)}`} icon={<DollarSign className="text-white"/>} color="bg-green-500" />
                <StatCard title="Contas a Receber" value={`R$ ${contasReceber.toFixed(2)}`} icon={<DollarSign className="text-white"/>} color="bg-yellow-500" />
                <StatCard title="Total de Pedidos" value={pedidos.length.toString()} icon={<ShoppingCart className="text-white"/>} color="bg-blue-500" />
                <StatCard title="Itens com Estoque Baixo" value={produtosBaixoEstoque.toString()} icon={<AlertTriangle className="text-white"/>} color="bg-red-500" />
            </div>
            
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
                            <Bar dataKey="Vendas" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Produtos Mais Vendidos (Unidades)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value} unidades`}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                        <Sparkles className="mr-2 text-brand-accent"/>
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
