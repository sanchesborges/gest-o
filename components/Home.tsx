import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, Bike, UserCheck, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { StatusPagamento } from '../types';

const CircularButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;
}> = ({ icon, label, color, onClick }) => (
    <div className="flex flex-col items-center">
        <button
            onClick={onClick}
            className={`w-16 h-16 rounded-full ${color} shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:shadow-xl`}
        >
            {icon}
        </button>
        <span className="text-xs font-medium text-gray-700 mt-2 text-center">{label}</span>
    </div>
);

const FinanceCard: React.FC<{
    title: string;
    value: string;
    status: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}> = ({ title, value, status, icon, color, onClick }) => (
    <div
        onClick={onClick}
        className="min-w-[200px] bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
    >
        <div className="flex items-start justify-between mb-3">
            <div className={`p-3 rounded-xl ${color}`}>
                {icon}
            </div>
        </div>
        <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-500">{status}</p>
    </div>
);

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { pedidos, produtos } = useAppData();

    const contasReceber = pedidos
        .filter(p => p.statusPagamento === StatusPagamento.PENDENTE || p.statusPagamento === StatusPagamento.ATRASADO)
        .reduce((acc, p) => acc + p.valorTotal, 0);

    const contasAtrasadas = pedidos
        .filter(p => p.statusPagamento === StatusPagamento.ATRASADO)
        .reduce((acc, p) => acc + p.valorTotal, 0);

    const faturamentoTotal = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);

    const produtosBaixoEstoque = produtos.filter(p => p.estoqueAtual < p.estoqueMinimo).length;

    const menuItems = [
        {
            icon: <BarChart3 size={28} className="text-white" />,
            label: 'Gráficos',
            color: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
            path: '/graficos'
        },
        {
            icon: <Package size={28} className="text-white" />,
            label: 'Estoque',
            color: 'bg-gradient-to-br from-green-400 to-green-500',
            path: '/estoque'
        },
        {
            icon: <ShoppingCart size={28} className="text-white" />,
            label: 'Pedidos',
            color: 'bg-gradient-to-br from-blue-400 to-blue-500',
            path: '/pedidos'
        },
        {
            icon: <Users size={28} className="text-white" />,
            label: 'Clientes',
            color: 'bg-gradient-to-br from-red-400 to-red-500',
            path: '/clientes'
        },
        {
            icon: <UserCheck size={28} className="text-white" />,
            label: 'Entregas',
            color: 'bg-gradient-to-br from-purple-400 to-purple-500',
            path: '/entregador-view'
        },
        {
            icon: <Bike size={28} className="text-white" />,
            label: 'Entregadores',
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            path: '/entregadores'
        }
    ];

    const financeCards = [
        {
            title: 'Contas a Receber',
            value: `R$ ${contasReceber.toFixed(2)}`,
            status: `${pedidos.filter(p => p.statusPagamento === StatusPagamento.PENDENTE).length} pendentes`,
            icon: <DollarSign size={20} className="text-green-600" />,
            color: 'bg-green-100',
            path: '/financeiro'
        },
        {
            title: 'Contas Atrasadas',
            value: `R$ ${contasAtrasadas.toFixed(2)}`,
            status: `${pedidos.filter(p => p.statusPagamento === StatusPagamento.ATRASADO).length} atrasadas`,
            icon: <AlertCircle size={20} className="text-red-600" />,
            color: 'bg-red-100',
            path: '/financeiro'
        },
        {
            title: 'Faturamento Total',
            value: `R$ ${faturamentoTotal.toFixed(2)}`,
            status: `${pedidos.length} pedidos`,
            icon: <TrendingUp size={20} className="text-blue-600" />,
            color: 'bg-blue-100',
            path: '/graficos'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-28">
            {/* Header */}
            <div className="bg-white rounded-b-3xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <Package className="mr-2 text-indigo-600" size={32} />
                            Shirley
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Gerencie seu negócio facilmente</p>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-6">
                {/* Menu Grid */}
                <div className="grid grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                        <CircularButton
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            color={item.color}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </div>

                {/* Suas Finanças Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Suas Finanças</h2>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock size={12} className="mr-1" />
                                Acompanhe seu fluxo de caixa
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/financeiro')}
                            className="text-indigo-600 text-sm font-semibold hover:text-indigo-700"
                        >
                            Ver tudo →
                        </button>
                    </div>

                    {/* Horizontal Scroll Cards */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {financeCards.map((card, index) => (
                            <FinanceCard
                                key={index}
                                title={card.title}
                                value={card.value}
                                status={card.status}
                                icon={card.icon}
                                color={card.color}
                                onClick={() => navigate(card.path)}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                {produtosBaixoEstoque > 0 && (
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="text-orange-600 mr-3" size={24} />
                            <div>
                                <p className="font-semibold text-orange-800">Atenção ao Estoque</p>
                                <p className="text-sm text-orange-700">
                                    {produtosBaixoEstoque} {produtosBaixoEstoque === 1 ? 'produto está' : 'produtos estão'} com estoque baixo
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
