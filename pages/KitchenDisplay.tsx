import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, Badge } from '../components/ui';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';
import { OrderStatus } from '../types';

export const KitchenDisplay = () => {
  const { orders, updateOrderStatus } = useStore();
  
  const kitchenOrders = orders
    .filter(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.SERVED)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'border-l-red-500 shadow-red-100';
      case OrderStatus.PREPARING: return 'border-l-amber-400 shadow-orange-100';
      case OrderStatus.READY: return 'border-l-emerald-500 shadow-green-100';
      default: return 'border-l-slate-200';
    }
  };

  const advanceOrder = (orderId: string, currentStatus: OrderStatus) => {
    let next = currentStatus;
    if (currentStatus === OrderStatus.PENDING) next = OrderStatus.PREPARING;
    else if (currentStatus === OrderStatus.PREPARING) next = OrderStatus.READY;
    else if (currentStatus === OrderStatus.READY) next = OrderStatus.SERVED;
    
    updateOrderStatus(orderId, next);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Kitchen Display System</h2>
            <p className="text-slate-500">Live feed of incoming orders</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-2 text-sm font-medium">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             <span>Live Connection Active</span>
          </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kitchenOrders.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">
                <ChefHat size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">All caught up! No active orders.</p>
            </div>
        )}
        
        {kitchenOrders.map(order => (
          <div key={order.id} className={`bg-white rounded-xl shadow-md border-l-[6px] flex flex-col justify-between min-h-[320px] transition-transform hover:-translate-y-1 ${getStatusColor(order.status)}`}>
            <div className="p-5">
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-dashed border-slate-200">
                <div>
                    <h3 className="font-bold text-2xl text-slate-900">
                        {order.tableId ? `T-${order.tableId.replace('t-', '')}` : 'Takeaway'}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">ID: {order.id.slice(-4)}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Time</span>
                    <span className="text-lg font-mono font-medium text-slate-900">
                        {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
              </div>
              
              <ul className="space-y-4">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between items-start">
                    <div className="flex items-start">
                        <span className="font-bold text-slate-900 text-lg mr-3 min-w-[1.5rem]">{item.quantity}</span>
                        <div>
                            <span className="text-slate-700 font-medium block leading-tight">{item.name}</span>
                            {item.notes && <span className="text-xs text-red-500 italic mt-1 block">{item.notes}</span>}
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
              <div className="flex justify-between items-center mb-4 px-1">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Status</span>
                 <Badge color={order.status === 'pending' ? 'red' : order.status === 'preparing' ? 'yellow' : 'green'}>
                    {order.status.toUpperCase()}
                 </Badge>
              </div>
              
              <Button 
                onClick={() => advanceOrder(order.id, order.status)} 
                className={`w-full py-3 shadow-none ${order.status === OrderStatus.READY ? 'bg-green-600 hover:bg-green-700' : ''}`}
                variant={order.status === OrderStatus.READY ? 'primary' : 'secondary'}
              >
                {order.status === OrderStatus.PENDING && 'Start Prep'}
                {order.status === OrderStatus.PREPARING && 'Mark Ready'}
                {order.status === OrderStatus.READY && 'Serve Order'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};