import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Home, Package, ShoppingCart, Users, DollarSign, BarChart2 } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Stock } from './components/Stock';
import { Orders } from './components/Orders';
import { Clients } from './components/Clients';
import { Financials } from './components/Financials';
import { AppDataProvider } from './hooks/useAppData';
import { UserRole } from './types';

// Helper to get page title based on route
const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/estoque': return 'Estoque';
      case '/pedidos': return 'Pedidos';
      case '/clientes': return 'Clientes';
      case '/financeiro': return 'Financeiro';
      default: return 'BakeryGest';
    }
};

// Component for the user role toggle, now simpler for the header
const UserRoleToggle: React.FC<{ userRole: UserRole; setUserRole: (role: UserRole) => void }> = ({ userRole, setUserRole }) => (
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
);


// Header for mobile view
const Header: React.FC<{ userRole: UserRole; setUserRole: (role: UserRole) => void }> = ({ userRole, setUserRole }) => {
    const location = useLocation();
    const title = getPageTitle(location.pathname);

    return (
        <header className="bg-brand-dark text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-20">
            <div className="flex items-center">
                 <BarChart2 className="mr-2 text-brand-accent"/>
                 <h1 className="text-xl font-bold">{title}</h1>
            </div>
            <UserRoleToggle userRole={userRole} setUserRole={setUserRole} />
        </header>
    );
};


// Navigation item for the bottom bar
const BottomNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to === '/'}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
        isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'
      }`
    }
  >
    {icon}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </NavLink>
);

// The bottom navigation bar
const BottomNavBar: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const navItems = [
        { to: "/", icon: <Home size={22} />, label: "Dashboard", roles: [UserRole.ADMIN, UserRole.ENTREGADOR] },
        { to: "/estoque", icon: <Package size={22} />, label: "Estoque", roles: [UserRole.ADMIN, UserRole.ENTREGADOR] },
        { to: "/pedidos", icon: <ShoppingCart size={22} />, label: "Pedidos", roles: [UserRole.ADMIN, UserRole.ENTREGADOR] },
        { to: "/clientes", icon: <Users size={22} />, label: "Clientes", roles: [UserRole.ADMIN, UserRole.ENTREGADOR] },
        { to: "/financeiro", icon: <DollarSign size={22} />, label: "Financeiro", roles: [UserRole.ADMIN] },
    ];

    const accessibleItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.1)] flex justify-around items-center z-20">
            {accessibleItems.map(item => <BottomNavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />)}
        </nav>
    );
};

// Main App component with mobile-first layout
const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);

  return (
    <AppDataProvider>
      <HashRouter>
        <div className="flex flex-col h-screen bg-brand-light">
          <Header userRole={userRole} setUserRole={setUserRole} />
          
          <main className="flex-1 overflow-y-auto p-4 pb-20"> {/* pb-20 to add space for bottom nav */}
             <Routes>
                <Route path="/" element={<Dashboard userRole={userRole} />} />
                <Route path="/estoque" element={<Stock userRole={userRole} />} />
                <Route path="/pedidos" element={<Orders userRole={userRole} />} />
                <Route path="/clientes" element={<Clients userRole={userRole} />} />
                <Route 
                    path="/financeiro" 
                    element={userRole === UserRole.ADMIN ? <Financials userRole={userRole} /> : <Navigate to="/" />} 
                />
             </Routes>
          </main>
          
          <BottomNavBar userRole={userRole} />
        </div>
      </HashRouter>
    </AppDataProvider>
  );
};

export default App;