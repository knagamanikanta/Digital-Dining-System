import React from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { UtensilsCrossed, LogOut, LayoutDashboard, CalendarDays, MonitorPlay, ChefHat, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link to={to} className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium ${active ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
    <Icon size={18} className={active ? "stroke-[2.5px]" : "stroke-2"} />
    <span>{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, logout, orders } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine active pending orders for kitchen badge
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Digital Dining
              </span>
              <span className="text-xs font-medium text-slate-500 tracking-wide">RESTAURANT OS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2 bg-slate-50/50 p-1.5 rounded-full border border-slate-100">
            {currentUser?.role === UserRole.CUSTOMER && (
              <>
                <NavItem to="/customer/menu" icon={UtensilsCrossed} label="Menu" active={location.pathname.includes('/menu')} />
                <NavItem to="/customer/reservations" icon={CalendarDays} label="Reservations" active={location.pathname.includes('/reservations')} />
                <NavItem to="/customer/profile" icon={User} label="Profile" active={location.pathname.includes('/profile')} />
              </>
            )}
            {currentUser?.role === UserRole.WAITER && (
              <>
                <NavItem to="/staff/pos" icon={MonitorPlay} label="POS Terminal" active={location.pathname.includes('/pos')} />
                <NavItem to="/staff/kitchen" icon={ChefHat} label="Kitchen View" active={location.pathname.includes('/kitchen')} />
              </>
            )}
            {currentUser?.role === UserRole.KITCHEN && (
              <NavItem to="/staff/kitchen" icon={ChefHat} label={`Kitchen Board ${pendingOrders > 0 ? `(${pendingOrders})` : ''}`} active={location.pathname.includes('/kitchen')} />
            )}
            {currentUser?.role === UserRole.ADMIN && (
              <>
                <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/admin'} />
                <NavItem to="/staff/pos" icon={MonitorPlay} label="POS" active={location.pathname.includes('/pos')} />
                <NavItem to="/staff/kitchen" icon={ChefHat} label="Kitchen" active={location.pathname.includes('/kitchen')} />
              </>
            )}
          </nav>

          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block mr-4">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{currentUser.role}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Login</Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
    </div>
  );
};