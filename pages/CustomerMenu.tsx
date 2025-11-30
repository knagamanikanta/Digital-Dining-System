import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MenuItem, OrderItem, OrderType, OrderStatus } from '../types';
import { Card, Button, Modal } from '../components/ui';
import { Plus, ShoppingBag, Minus, Trash2, CreditCard, Sparkles } from 'lucide-react';
import { GeminiChat } from '../components/GeminiChat';

export const CustomerMenu = () => {
  const { menu, createOrder } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ['All', ...Array.from(new Set(menu.map(item => item.category)))];
  const filteredMenu = selectedCategory === 'All' ? menu : menu.filter(m => m.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: `item-${Date.now()}`, menuItemId: item.id, name: item.name, price: item.price, quantity: 1, status: OrderStatus.PENDING }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate Stripe API call
    setTimeout(async () => {
      await createOrder({
        items: cart,
        total: cartTotal,
        type: OrderType.DELIVERY, // Default for simple web order
        customerId: 'u4' // Hardcoded current user for demo
      });
      setCart([]);
      setIsProcessing(false);
      setIsCartOpen(false);
      alert('Order placed successfully! You gained ' + Math.floor(cartTotal / 10) + ' loyalty points.');
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-24 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Menu</h2>
          <p className="text-slate-500 mt-1">Freshly prepared dishes, served daily.</p>
        </div>
        
        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-1 gap-2 max-w-full no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 transform scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMenu.map(item => (
          <Card key={item.id} className="flex flex-col h-full group">
            <div className="h-56 overflow-hidden relative bg-slate-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                <span className="font-bold text-xl drop-shadow-md">${item.price}</span>
                {item.calories && <span className="text-xs bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">{item.calories} cal</span>}
              </div>

              {!item.available && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="text-white font-bold px-4 py-2 border-2 border-white rounded-lg tracking-widest uppercase">Sold Out</span>
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{item.category}</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed flex-1">{item.description}</p>
              
              <Button 
                disabled={!item.available} 
                onClick={() => addToCart(item)} 
                variant={!item.available ? 'secondary' : 'primary'}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl shadow-none hover:shadow-lg transition-all"
              >
                <Plus size={18} />
                <span>Add to Order</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white pl-4 pr-6 py-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group border border-slate-700"
          >
            <div className="relative bg-slate-800 p-2 rounded-full group-hover:bg-slate-700 transition-colors">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                {cart.reduce((a,b) => a + b.quantity, 0)}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</span>
              <span className="font-bold text-lg leading-none">${cartTotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Your Order">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
              <ShoppingBag size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500">Your cart is currently empty.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">${item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Minus size={14} /></button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="ml-3 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-500 font-medium">Total Amount</span>
                <span className="text-3xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start space-x-3">
                <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600 mt-0.5">
                    <Sparkles size={14} />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-blue-900">Loyalty Points</h5>
                    <p className="text-xs text-blue-700 mt-0.5">You'll earn {Math.floor(cartTotal / 10)} points with this order.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 justify-center">
                <CreditCard size={12} />
                <span>Secure SSL Payment (Test Mode)</span>
              </div>

              <Button onClick={handleCheckout} disabled={isProcessing} className="w-full py-4 text-lg shadow-lg shadow-primary-500/20">
                {isProcessing ? 'Processing Payment...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <GeminiChat />
    </div>
  );
};