import React, { ReactNode } from 'react';
import { X, LucideIcon } from 'lucide-react';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }: { children: ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost', className?: string, disabled?: boolean, type?: "button" | "submit" | "reset" }) => {
  const baseStyles = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm flex items-center justify-center";
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-glow focus:ring-primary-500 border border-transparent",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500 border border-transparent",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 border border-red-100",
    outline: "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400 hover:text-slate-900 shadow-none"
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ icon: Icon, className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: LucideIcon }) => (
  <div className="relative w-full">
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Icon size={20} />
      </div>
    )}
    <input
      {...props}
      className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 disabled:opacity-50 ${className}`}
    />
  </div>
);

export const Card = ({ children, className = '', onClick }: { children: ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl shadow-soft border border-slate-100/60 overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, color = 'blue' }: { children: ReactNode, color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${colors[color]}`}>{children}</span>;
};

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};