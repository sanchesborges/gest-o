
import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, Users, DollarSign, FileText } from 'lucide-react';
import { Home as HomePage } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Graficos } from './components/Graficos';
import { Stock } from './components/Stock';
import { Orders } from './components/Orders';
import { Clients } from './components/Clients';
import { Financials } from './components/Financials';
import { Reports } from './components/Reports';
import { AppDataProvider } from './hooks/useAppData';
import { UserRole } from './types';
import { Products } from './components/Products';
import { Entregadores } from './components/Entregadores';
import { InstallPrompt } from './components/InstallPrompt';
import { EntregadorDeliveryView } from './components/EntregadorDeliveryView';
import { SalesReport } from './components/SalesReport';




const BottomNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
    return (
        <NavLink
            to={to}
            end={to === '/'}
            onClick={onClick}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-indigo-200 hover:text-white hover:scale-105'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <div className={`transition-all duration-300 ${isActive ? 'transform -translate-y-1' : ''}`}>
                        {icon}
                    </div>
                    <span className="text-xs mt-1.5 font-semibold">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNavBar: React.FC<{ userRole: UserRole; onHomeClick?: () => void }> = ({ userRole, onHomeClick }) => {
    const adminNavItems = [
        { to: "/", icon: <Home size={24} />, label: "Início" },
        { to: "/estoque", icon: <Package size={24} />, label: "Estoque" },
        { to: "/pedidos", icon: <ShoppingCart size={24} />, label: "Pedidos" },
        { to: "/clientes", icon: <Users size={24} />, label: "Clientes" },
        { to: "/financeiro", icon: <DollarSign size={24} />, label: "Financeiro" },
    ];

    // Use relative paths for Entregador portal
    const entregadorNavItems = [
        { to: "", icon: <ShoppingCart size={24} />, label: "Pedidos" },
    ];

    const accessibleItems = userRole === UserRole.ADMIN ? adminNavItems : entregadorNavItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-2xl flex justify-around items-center z-50 rounded-t-3xl">
            {accessibleItems.map(item => (
                <BottomNavItem
                    key={item.label}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    onClick={item.label === "Início" ? onHomeClick : undefined}
                />
            ))}
        </nav>
    );
};

const EntregadorPortal: React.FC = () => {
    const userRole = UserRole.ENTREGADOR;

    return (
        <div className="flex flex-col h-screen bg-brand-light">
            <main className="flex-1 overflow-y-auto">
                <Routes>
                    <Route index element={<Orders userRole={userRole} />} />
                    <Route path="pedidos" element={<Orders userRole={userRole} />} />
                    <Route path="entrega/:pedidoId" element={<EntregadorDeliveryView />} />
                    <Route path="*" element={<Navigate to="." replace />} />
                </Routes>
            </main>
            <BottomNavBar userRole={userRole} />
        </div>
    );
};

const AdminPortal: React.FC = () => {
    const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);
    const navigate = useNavigate();

    const handleHomeClick = () => {
        setUserRole(UserRole.ADMIN);
        navigate('/');
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <main className="flex-1 overflow-y-auto pb-28">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/graficos" element={<Graficos />} />
                    <Route path="/relatorios" element={<Reports />} />
                    <Route path="/vendas" element={<SalesReport />} />
                    <Route path="/entregador-view" element={<Dashboard userRole={UserRole.ENTREGADOR} />} />
                    <Route path="/estoque" element={<Stock userRole={userRole} />} />
                    <Route path="/produtos" element={<Products userRole={userRole} />} />
                    <Route path="/pedidos" element={<Orders userRole={userRole} />} />
                    <Route path="/clientes" element={<Clients userRole={userRole} />} />
                    <Route path="/entregadores" element={<Entregadores />} />
                    <Route
                        path="/financeiro"
                        element={userRole === UserRole.ADMIN ? <Financials userRole={userRole} /> : <Navigate to="/" />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <BottomNavBar userRole={userRole} onHomeClick={handleHomeClick} />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppDataProvider>
            <HashRouter>
                <Routes>
                    <Route path="/entregador/:entregadorId/*" element={<EntregadorPortal />} />
                    <Route path="/*" element={<AdminPortal />} />
                </Routes>
                <InstallPrompt />
            </HashRouter>
        </AppDataProvider>
    );
};

export default App;
