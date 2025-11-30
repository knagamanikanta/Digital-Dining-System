import React from 'react';
import { useStore } from '../context/StoreContext';
import { Card, Button, Input } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';

export const AdminDashboard = () => {
  const { orders, menu } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  
  const popularItems = menu.map(m => {
    const count = orders.flatMap(o => o.items).filter(i => i.menuItemId === m.id).reduce((a, b) => a + b.quantity, 0);
    return { name: m.name, count };
  }).sort((a,b) => b.count - a.count).slice(0, 5);

  const hourlyData = [
    { time: '12pm', orders: 4 }, { time: '1pm', orders: 8 }, { time: '2pm', orders: 3 },
    { time: '3pm', orders: 1 }, { time: '4pm', orders: 2 }, { time: '5pm', orders: 6 },
    { time: '6pm', orders: 12 }, { time: '7pm', orders: 15 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Real-time metrics and analytics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} color="bg-blue-500 shadow-lg shadow-blue-500/30" />
        <StatCard title="Total Orders" value={totalOrders.toString()} icon={ShoppingBag} color="bg-purple-500 shadow-lg shadow-purple-500/30" />
        <StatCard title="Avg Order Value" value={`$${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}`} icon={TrendingUp} color="bg-green-500 shadow-lg shadow-green-500/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h3 className="font-bold text-lg mb-6 text-slate-900">Popular Items</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularItems} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="count" fill="#f97316" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="font-bold text-lg mb-6 text-slate-900">Orders Traffic</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-lg text-slate-900">Menu Inventory</h3>
            <Button className="py-2 text-sm shadow-md shadow-primary-500/20">Add New Item</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    <tr>
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Category</th>
                        <th className="px-6 py-4 text-left">Price</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {menu.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                    {item.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-700">${item.price}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${item.available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {item.available ? 'In Stock' : 'Sold Out'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm space-x-3">
                                <button className="font-medium text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                                <button className="font-medium text-red-600 hover:text-red-800 transition-colors">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};