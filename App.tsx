
import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useParams } from 'react-router-dom';
import { Home, Package, ShoppingCart, Users, DollarSign, Cookie, Bike } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Stock } from './components/Stock';
import { Orders } from './components/Orders';
import { Clients } from './components/Clients';
import { Financials } from './components/Financials';
import { AppDataProvider } from './hooks/useAppData';
import { UserRole } from './types';
import { Products } from './components/Products';
import { Entregadores } from './components/Entregadores';

const HeaderActions: React.FC<{ userRole: UserRole; setUserRole: (role: UserRole) => void }> = ({ userRole, setUserRole }) => (
    <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-indigo-800 p-1 rounded-lg">
            <button 
                onClick={() => setUserRole(UserRole.ADMIN)}
                className={`px-2 py-1 text-xs rounded-md ${userRole === UserRole.ADMIN ? 'bg-white text-indigo-700 font-bold' : 'text-white'}`}
                aria-pressed={userRole === UserRole.ADMIN}
            >
                Admin
            </button>
            <button 
                onClick={() => setUserRole(UserRole.ENTREGADOR)}
                className={`px-2 py-1 text-xs rounded-md ${userRole === UserRole.ENTREGADOR ? 'bg-white text-indigo-700 font-bold' : 'text-white'}`}
                aria-pressed={userRole === UserRole.ENTREGADOR}
            >
                Entregador
            </button>
        </div>
         <NavLink 
            to="/entregadores"
            className={({ isActive }) => 
              `p-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
              }`
            }
            title="Controle de Entregadores"
        >
            <Bike size={20} />
        </NavLink>
    </div>
);


const Header: React.FC<{ userRole: UserRole; setUserRole: (role: UserRole) => void; showToggle: boolean }> = ({ userRole, setUserRole, showToggle }) => {
    return (
        <header className="bg-brand-dark text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-20">
            <div className="flex items-center">
                 <Cookie className="mr-2 text-brand-accent"/>
                 <h1 className="text-xl font-bold">Shirley</h1>
            </div>
            {showToggle && <HeaderActions userRole={userRole} setUserRole={setUserRole} />}
        </header>
    );
};


const BottomNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to === '/' || to === '.'} // Use '.' for relative home link
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
        isActive ? 'text-white' : 'text-indigo-300 hover:text-white'
      }`
    }
  >
    {icon}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </NavLink>
);

const BottomNavBar: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const adminNavItems = [
        { to: "/", icon: <Home size={22} />, label: "Início" },
        { to: "/estoque", icon: <Package size={22} />, label: "Estoque" },
        { to: "/pedidos", icon: <ShoppingCart size={22} />, label: "Pedidos" },
        { to: "/clientes", icon: <Users size={22} />, label: "Clientes" },
        { to: "/financeiro", icon: <DollarSign size={22} />, label: "Financeiro" },
    ];

    // Use relative paths for Entregador portal
    const entregadorNavItems = [
        { to: ".", icon: <Home size={22} />, label: "Início" },
        { to: "pedidos", icon: <ShoppingCart size={22} />, label: "Pedidos" },
    ];

    const accessibleItems = userRole === UserRole.ADMIN ? adminNavItems : entregadorNavItems;

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-brand-primary shadow-lg flex justify-around items-center z-20">
            {accessibleItems.map(item => <BottomNavItem key={item.label} to={item.to} icon={item.icon} label={item.label} />)}
        </nav>
    );
};

const EntregadorPortal: React.FC = () => {
    const userRole = UserRole.ENTREGADOR;

    return (
        <div className="flex flex-col h-screen bg-brand-light">
            <Header userRole={userRole} setUserRole={() => {}} showToggle={false} />
            <main className="flex-1 overflow-y-auto p-4 pb-20">
                <Routes>
                    <Route path="/" element={<Dashboard userRole={userRole} />} />
                    <Route path="/pedidos" element={<Orders userRole={userRole} />} />
                    <Route path="*" element={<Navigate to="." replace />} />
                </Routes>
            </main>
            <BottomNavBar userRole={userRole} />
        </div>
    );
};

const AdminPortal: React.FC = () => {
    const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);

    return (
        <div className="flex flex-col h-screen bg-brand-light">
            <Header userRole={userRole} setUserRole={setUserRole} showToggle={true} />
            <main className="flex-1 overflow-y-auto p-4 pb-20">
                <Routes>
                    <Route path="/" element={<Dashboard userRole={userRole} />} />
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
            <BottomNavBar userRole={userRole} />
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
      </HashRouter>
    </AppDataProvider>
  );
};

export default App;
