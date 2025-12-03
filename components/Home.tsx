import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, Bike, FileText, DollarSign, TrendingUp, Clock, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { StatusPagamento } from '../types';

const MenuCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;
}> = ({ icon, label, color, onClick }) => (
    <button
        onClick={onClick}
        className={`${color} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl aspect-square w-full max-w-[180px] mx-auto`}
    >
        <div className="mb-3">
            {icon}
        </div>
        <span className="text-sm font-bold text-white text-center">{label}</span>
    </button>
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
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-xs text-gray-500">{status}</p>
    </div>
);

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { pedidos, produtos } = useAppData();
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        console.log('🌓 Dark Mode mudou para:', darkMode);
        console.log('📍 Classes no HTML antes:', document.documentElement.className);
        
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0f172a';
            document.body.style.color = '#e2e8f0';
            
            console.log('📍 Classes no HTML depois:', document.documentElement.className);
            console.log('🎨 Aplicando cores aos títulos...');
            
            // Forçar cor dos títulos com !important
            setTimeout(() => {
                const titulos = document.querySelectorAll('h1, h2, h3');
                console.log('📝 Total de títulos encontrados:', titulos.length);
                
                titulos.forEach((el, index) => {
                    (el as HTMLElement).style.setProperty('color', '#f1f5f9', 'important');
                    const cor = window.getComputedStyle(el as HTMLElement).color;
                    console.log(`✅ Título ${index + 1}:`, (el as HTMLElement).textContent?.substring(0, 30), '| Cor:', cor);
                });
            }, 100);
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            
            console.log('📍 Classes no HTML depois:', document.documentElement.className);
            
            // Restaurar cor dos títulos
            setTimeout(() => {
                document.querySelectorAll('h1, h2, h3').forEach(el => {
                    (el as HTMLElement).style.removeProperty('color');
                });
                console.log('☀️ Títulos restaurados para light mode');
            }, 100);
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const contasReceber = pedidos
        .filter(p => p.statusPagamento === StatusPagamento.PENDENTE || p.statusPagamento === StatusPagamento.ATRASADO)
        .reduce((acc, p) => acc + p.valorTotal, 0);

    const contasAtrasadas = pedidos
        .filter(p => p.statusPagamento === StatusPagamento.ATRASADO)
        .reduce((acc, p) => acc + p.valorTotal, 0);

    const contasPagas = pedidos
        .filter(p => p.statusPagamento === StatusPagamento.PAGO)
        .reduce((acc, p) => acc + p.valorTotal, 0);

    const faturamentoTotal = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);

    const produtosBaixoEstoque = produtos.filter(p => p.estoqueAtual < p.estoqueMinimo).length;

    // Primeira linha de cards (3 cards)
    const mainMenuItems = [
        {
            icon: <Package size={36} className="text-white" />,
            label: 'Estoque',
            color: 'bg-gradient-to-br from-green-400 to-green-500',
            path: '/estoque'
        },
        {
            icon: <ShoppingCart size={36} className="text-white" />,
            label: 'Pedidos',
            color: 'bg-gradient-to-br from-blue-400 to-blue-500',
            path: '/pedidos'
        },
        {
            icon: <TrendingUp size={36} className="text-white" />,
            label: 'Vendas',
            color: 'bg-gradient-to-br from-purple-400 to-purple-500',
            path: '/vendas'
        }
    ];

    // Segunda linha de cards (3 cards)
    const secondaryMenuItems = [
        {
            icon: <Users size={36} className="text-white" />,
            label: 'Clientes',
            color: 'bg-gradient-to-br from-red-400 to-red-500',
            path: '/clientes'
        },
        {
            icon: <Bike size={36} className="text-white" />,
            label: 'Entregadores',
            color: 'bg-gradient-to-br from-teal-400 to-teal-500',
            path: '/entregadores'
        },
        {
            icon: <FileText size={36} className="text-white" />,
            label: 'Relatórios',
            color: 'bg-gradient-to-br from-indigo-400 to-indigo-500',
            path: '/relatorios'
        }
    ];

    const financeCards = [
        {
            title: 'Contas a Receber',
            value: `R$ ${contasReceber.toFixed(2)}`,
            status: `${pedidos.filter(p => p.statusPagamento === StatusPagamento.PENDENTE).length} pendentes`,
            icon: <DollarSign size={20} className="text-yellow-600" />,
            color: 'bg-yellow-100',
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
            title: 'Contas Pagas',
            value: `R$ ${contasPagas.toFixed(2)}`,
            status: `${pedidos.filter(p => p.statusPagamento === StatusPagamento.PAGO).length} pagas`,
            icon: <DollarSign size={20} className="text-green-600" />,
            color: 'bg-green-100',
            path: '/financeiro'
        },
        {
            title: 'Faturamento Total',
            value: `R$ ${faturamentoTotal.toFixed(2)}`,
            status: `${pedidos.length} pedidos`,
            icon: <TrendingUp size={20} className="text-blue-600" />,
            color: 'bg-blue-100',
            path: '/graficos'
        },
        {
            title: 'Gráficos',
            value: 'Visualizar',
            status: 'Análises detalhadas',
            icon: <BarChart3 size={20} className="text-yellow-600" />,
            color: 'bg-yellow-100',
            path: '/graficos'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-28">
            {/* Header */}
            <div className="bg-white rounded-b-3xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                            <Package className="mr-2 text-indigo-600" size={32} />
                            Maná
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Gerencie seu negócio facilmente</p>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? (
                            <Sun size={24} className="text-yellow-500" />
                        ) : (
                            <Moon size={24} className="text-indigo-600" />
                        )}
                    </button>
                </div>
            </div>

            <div className="px-6 space-y-6 max-w-4xl mx-auto">
                {/* Menu Grid - Primeira Linha */}
                <div className="grid grid-cols-3 gap-4">
                    {mainMenuItems.map((item, index) => (
                        <MenuCard
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            color={item.color}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </div>

                {/* Menu Grid - Segunda Linha */}
                <div className="grid grid-cols-3 gap-4">
                    {secondaryMenuItems.map((item, index) => (
                        <MenuCard
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
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Suas Finanças</h2>
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
