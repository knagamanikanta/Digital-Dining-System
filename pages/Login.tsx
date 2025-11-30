import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { Mail, Lock, ArrowRight, ChefHat, User, ShieldCheck, CheckCircle2, AlertCircle, UserPlus, UtensilsCrossed, Star } from 'lucide-react';
import { UserRole } from '../types';

export const Login = () => {
  const { login, register } = useStore();
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for realism
    setTimeout(async () => {
      let success = false;

      if (isRegistering) {
        if (!name.trim()) {
           setError('Name is required.');
           setLoading(false);
           return;
        }
        success = await register(name, email, password);
        if (!success) {
          setError('Email is already registered.');
          setLoading(false);
          return;
        }
        // Auto login after register
        success = login(email, password);
      } else {
        success = login(email, password);
      }

      setLoading(false);
      
      if (success) {
        // Redirect based on role
        if (email.includes('admin')) navigate('/admin');
        else if (email.includes('waiter')) navigate('/staff/pos');
        else if (email.includes('kitchen')) navigate('/staff/kitchen');
        else navigate('/customer/menu');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }, 800);
  };

  const fillCredentials = (roleEmail: string, rolePassword: string) => {
    setIsRegistering(false);
    setEmail(roleEmail);
    setPassword(rolePassword);
    setError('');
  };

  const roles = [
    {
      role: UserRole.CUSTOMER,
      label: "Customer",
      desc: "Order & Reservations",
      email: "customer@dining.test",
      icon: User,
      style: "hover:border-blue-300 hover:bg-blue-50/50"
    },
    {
      role: UserRole.WAITER,
      label: "Waiter",
      desc: "POS & Tables",
      email: "waiter@dining.test",
      icon: UtensilsCrossed,
      style: "hover:border-purple-300 hover:bg-purple-50/50"
    },
    {
      role: UserRole.KITCHEN,
      label: "Kitchen",
      desc: "KDS & Prep",
      email: "kitchen@dining.test",
      icon: ChefHat,
      style: "hover:border-orange-300 hover:bg-orange-50/50"
    },
    {
      role: UserRole.ADMIN,
      label: "Admin",
      desc: "Management",
      email: "admin@dining.test",
      icon: ShieldCheck,
      style: "hover:border-slate-300 hover:bg-slate-50/50"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-white">
      {/* Left Side - Brand & Visual */}
      <div className="lg:w-[45%] bg-slate-900 relative overflow-hidden hidden lg:flex flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
            alt="Fine Dining" 
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 pt-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-medium tracking-wide">System Operational</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
            The future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">
              dining management.
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-sm leading-relaxed font-light">
            Seamlessly connect your front-of-house, kitchen, and customers in one unified platform.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
           <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
             <div className="flex text-yellow-400 mb-2">
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
               <Star size={16} fill="currentColor" />
             </div>
             <p className="text-sm text-slate-200 italic">"Digital Dining transformed how we handle our Friday night rush. The kitchen display system is a game changer."</p>
             <div className="mt-4 flex items-center space-x-3">
               <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">JD</div>
               <div>
                 <p className="text-xs font-bold">John Doe</p>
                 <p className="text-[10px] text-slate-400 uppercase tracking-wider">Head Chef, The Local</p>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-[55%] flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-primary-50 p-3 rounded-2xl">
                <ChefHat className="text-primary-600" size={32} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isRegistering ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {isRegistering 
                ? 'Enter your details below to create your account' 
                : 'Enter your credentials to access your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center border border-red-100 animate-in shake">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {isRegistering && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in">
                  <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider ml-1">Full Name</label>
                  <Input 
                    type="text" 
                    icon={User} 
                    placeholder="e.g. Alex Johnson" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegistering}
                    className="bg-white"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider ml-1">Email</label>
                <Input 
                  type="email" 
                  icon={Mail} 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Password</label>
                  {!isRegistering && (
                    <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">Forgot password?</a>
                  )}
                </div>
                <Input 
                  type="password" 
                  icon={Lock} 
                  placeholder={isRegistering ? "Create a secure password" : "Enter your password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-4 text-sm font-bold uppercase tracking-wide shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                  {isRegistering ? <UserPlus size={18} /> : <ArrowRight size={18} />}
                </div>
              )}
            </Button>
            
            <div className="text-center pt-2">
              <span className="text-slate-500 text-sm">
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline transition-all"
              >
                {isRegistering ? "Sign in" : "Sign up for free"}
              </button>
            </div>
          </form>

          {!isRegistering && (
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Select Demo Persona</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = email === role.email;
                  return (
                    <button
                      key={role.label}
                      onClick={() => fillCredentials(role.email, 'password')}
                      className={`relative flex flex-col p-4 rounded-xl border transition-all duration-200 text-left group ${role.style} ${
                        isSelected 
                          ? 'ring-2 ring-primary-500 border-transparent shadow-md bg-slate-50' 
                          : 'bg-white border-slate-200 hover:shadow-md'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-primary-600 animate-in zoom-in">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                      <div className={`p-2 w-fit rounded-lg mb-3 ${isSelected ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-primary-600'} transition-colors`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{role.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{role.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <p className="text-center text-xs text-slate-400 mt-6">
                Test environment • Password for all accounts is "password"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};