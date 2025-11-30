import React, { useState } from 'react';
import { Card, Input, Button } from '../components/ui';
import { useStore } from '../context/StoreContext';

export const CustomerReservations = () => {
  const { createReservation, reservations, currentUser } = useStore();
  const [formData, setFormData] = useState({ date: '', time: '', partySize: 2 });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    await createReservation({
      customerId: currentUser.id,
      customerName: currentUser.name,
      date: formData.date,
      time: formData.time,
      partySize: formData.partySize
    });
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setFormData({ date: '', time: '', partySize: 2 });
  };

  // Filter reservations for this user (in a real app, backend would filter)
  const myReservations = reservations.filter(r => r.customerId === currentUser?.id);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Make a Reservation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <Input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Party Size</label>
            <Input type="number" min="1" max="12" required value={formData.partySize} onChange={e => setFormData({...formData, partySize: parseInt(e.target.value)})} />
          </div>
          <Button type="submit" className="w-full">
            Confirm Table
          </Button>
          {success && <p className="text-green-600 text-center text-sm">Reservation confirmed! Check your email.</p>}
        </form>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Upcoming Reservations</h3>
        {myReservations.length === 0 ? (
          <p className="text-slate-500">No active reservations.</p>
        ) : (
          myReservations.map(res => (
            <Card key={res.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{res.date} at {res.time}</p>
                <p className="text-slate-500">Table for {res.partySize}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Confirmed</span>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};