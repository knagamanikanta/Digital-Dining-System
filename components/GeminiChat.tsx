import React, { useState } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { Button, Input, Card } from './ui';
import { getGeminiResponse } from '../services/geminiService';
import { useStore } from '../context/StoreContext';

export const GeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: 'Hi! I am Chef G, your AI concierge. Ask me about the menu, ingredients, or for a recommendation!'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { menu } = useStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await getGeminiResponse(userMsg, menu, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {isOpen && (
        <Card className="w-80 h-96 flex flex-col shadow-2xl border-primary-100">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Sparkles size={18} />
              <span className="font-semibold">Chef G (AI)</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-100 rounded-2xl rounded-bl-none px-3 py-2">
                   <div className="flex space-x-1">
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                     <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                   </div>
                 </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t bg-slate-50 flex space-x-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for a recommendation..."
              className="text-sm"
            />
            <Button onClick={handleSend} variant="primary" className="px-3">
              <Send size={16} />
            </Button>
          </div>
        </Card>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};