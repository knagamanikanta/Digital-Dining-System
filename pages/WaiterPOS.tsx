import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, Modal, Badge } from '../components/ui';
import { Table, OrderType, OrderStatus } from '../types';
import { Users, PlusCircle, DollarSign, Printer, Coffee, Clock } from 'lucide-react';

export const WaiterPOS = () => {
  const { tables, orders, menu, createOrder, payOrder, updateTableStatus, updateOrderStatus } = useStore();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const [newOrderItems, setNewOrderItems] = useState<{menuId: string, qty: number}[]>([]);

  const activeOrder = selectedTable?.currentOrderId ? orders.find(o => o.id === selectedTable.currentOrderId) : null;

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setNewOrderItems([]);
    setIsOrderModalOpen(true);
  };

  const addItemToNewOrder = (menuId: string) => {
    setNewOrderItems(prev => {
      const existing = prev.find(i => i.menuId === menuId);
      if (existing) return prev.map(i => i.menuId === menuId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { menuId, qty: 1 }];
    });
  };

  const submitOrder = async () => {
    if (!selectedTable) return;

    const items = newOrderItems.map(ni => {
      const menuItem = menu.find(m => m.id === ni.menuId)!;
      return {
        id: `oi-${Date.now()}-${ni.menuId}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: ni.qty,
        status: OrderStatus.PENDING
      };
    });

    if (items.length > 0) {
      if (!selectedTable.currentOrderId) {
        const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        await createOrder({
          tableId: selectedTable.id,
          items,
          total,
          type: OrderType.DINE_IN,
        });
      }
    }
    setIsOrderModalOpen(false);
  };

  const handlePay = async () => {
    if (activeOrder) {
      await payOrder(activeOrder.id);
      setIsOrderModalOpen(false);
    }
  };

  const getTableStyles = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-white border-slate-200 text-slate-700 hover:border-green-400 hover:ring-4 hover:ring-green-50';
      case 'occupied': return 'bg-red-50 border-red-200 text-red-800 ring-2 ring-red-100';
      case 'reserved': return 'bg-yellow-50 border-yellow-200 text-yellow-800 ring-2 ring-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Floor Plan</h2>
          <p className="text-slate-500 text-sm">Main Dining Room</p>
        </div>
        <div className="flex space-x-6 text-sm font-medium bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-white border-2 border-slate-300 rounded-full"></div><span>Available</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-100 border-2 border-red-400 rounded-full"></div><span>Occupied</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-100 border-2 border-yellow-400 rounded-full"></div><span>Reserved</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-slate-100 rounded-3xl border border-slate-200 shadow-inner">
        {tables.map(table => (
          <button 
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={`aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center space-y-3 transition-all duration-300 relative ${getTableStyles(table.status)}`}
          >
            {/* Chairs representation */}
            <div className="absolute -top-3 w-12 h-2 bg-current opacity-20 rounded-full"></div>
            <div className="absolute -bottom-3 w-12 h-2 bg-current opacity-20 rounded-full"></div>
            {table.capacity > 2 && (
                <>
                <div className="absolute -left-3 w-2 h-12 bg-current opacity-20 rounded-full"></div>
                <div className="absolute -right-3 w-2 h-12 bg-current opacity-20 rounded-full"></div>
                </>
            )}

            <span className="text-3xl font-black opacity-90">{table.number}</span>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider opacity-60 bg-black/5 px-2 py-1 rounded-md">
              <Users size={12} />
              <span>Seat {table.capacity}</span>
            </div>
            {table.currentOrderId && (
                <div className="absolute top-4 right-4 animate-pulse">
                    <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
                </div>
            )}
          </button>
        ))}
      </div>

      <Modal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        title={`Table ${selectedTable?.number} Overview`}
      >
        <div className="space-y-6">
          {activeOrder ? (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="font-bold text-lg text-slate-900">Active Order</h3>
                      <p className="text-xs text-slate-500">#{activeOrder.id.slice(-6)}</p>
                  </div>
                  <Badge color={activeOrder.status === 'completed' ? 'green' : 'yellow'}>{activeOrder.status.toUpperCase()}</Badge>
                </div>
                <ul className="space-y-3">
                  {activeOrder.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                      <span className="font-medium text-slate-700 flex items-center">
                        <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded flex items-center justify-center text-xs mr-3 font-bold">{item.quantity}</span>
                        {item.name}
                      </span>
                      <span className="text-slate-900 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-200 mt-6 pt-4 flex justify-between items-end">
                  <span className="text-sm font-medium text-slate-500">Total Due</span>
                  <span className="text-2xl font-bold text-slate-900">${activeOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 flex justify-center items-center gap-2" onClick={() => alert("Printing Bill...")}>
                  <Printer size={18} /> <span>Print Bill</span>
                </Button>
                <Button variant="primary" className="h-12 flex justify-center items-center gap-2" onClick={handlePay}>
                  <DollarSign size={18} /> <span>Settle & Pay</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-500 font-medium">Table is currently empty</p>
              </div>
              
              <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Quick Add Items</h4>
                  <div className="border border-slate-200 rounded-xl h-64 overflow-y-auto">
                    {menu.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                            <span className="text-xs text-slate-500">${item.price}</span>
                        </div>
                        <button onClick={() => addItemToNewOrder(item.id)} className="bg-primary-50 text-primary-600 hover:bg-primary-100 p-2 rounded-lg transition-colors">
                        <PlusCircle size={20} />
                        </button>
                    </div>
                    ))}
                  </div>
              </div>

              {newOrderItems.length > 0 && (
                 <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
                   <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-bold uppercase text-primary-700 tracking-wider">New Draft Order</span>
                       <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-primary-600 shadow-sm">{newOrderItems.reduce((a,b)=>a+b.qty,0)} items</span>
                   </div>
                   <div className="space-y-1 mb-4">
                    {newOrderItems.map(i => {
                        const m = menu.find(x => x.id === i.menuId);
                        return (
                            <div key={i.menuId} className="flex justify-between text-sm text-primary-900">
                                <span>{m?.name}</span>
                                <span className="font-bold">x{i.qty}</span>
                            </div>
                        )
                    })}
                   </div>
                   <Button onClick={submitOrder} className="w-full">Send to Kitchen</Button>
                 </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};