import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MenuItem, Order, Table, Reservation, UserRole, OrderStatus, OrderType } from '../types';

// --- MOCK DATA SEED ---

const MOCK_MENU: MenuItem[] = [
  { id: '1', category: 'Starters', name: 'Truffle Arancini', description: 'Crispy risotto balls with truffle oil and parmesan.', price: 12, ingredients: ['Rice', 'Truffle Oil', 'Parmesan', 'Breadcrumbs'], image: 'https://picsum.photos/400/300?random=1', available: true },
  { id: '2', category: 'Starters', name: 'Burrata Salad', description: 'Fresh burrata with heirloom tomatoes and basil pesto.', price: 16, ingredients: ['Burrata', 'Tomatoes', 'Basil', 'Pine Nuts'], image: 'https://picsum.photos/400/300?random=2', available: true },
  { id: '3', category: 'Mains', name: 'Wagyu Burger', description: 'Premium wagyu beef, brioche bun, aged cheddar.', price: 24, ingredients: ['Wagyu Beef', 'Brioche', 'Cheddar', 'Pickles'], image: 'https://picsum.photos/400/300?random=3', available: true },
  { id: '4', category: 'Mains', name: 'Pan-Seared Salmon', description: 'Atlantic salmon with asparagus and lemon butter sauce.', price: 28, ingredients: ['Salmon', 'Asparagus', 'Butter', 'Lemon'], image: 'https://picsum.photos/400/300?random=4', available: true },
  { id: '5', category: 'Mains', name: 'Wild Mushroom Risotto', description: 'Arborio rice with porcini mushrooms and thyme.', price: 22, ingredients: ['Rice', 'Mushrooms', 'Thyme', 'White Wine'], image: 'https://picsum.photos/400/300?random=5', available: true },
  { id: '6', category: 'Desserts', name: 'Tiramisu', description: 'Classic Italian dessert with coffee and mascarpone.', price: 10, ingredients: ['Ladyfingers', 'Coffee', 'Mascarpone', 'Cocoa'], image: 'https://picsum.photos/400/300?random=6', available: true },
  { id: '7', category: 'Drinks', name: 'Craft IPA', description: 'Local brewed IPA with citrus notes.', price: 8, ingredients: ['Hops', 'Malt', 'Water', 'Yeast'], image: 'https://picsum.photos/400/300?random=7', available: true },
  { id: '8', category: 'Drinks', name: 'Artisan Lemonade', description: 'Freshly squeezed lemons with mint.', price: 6, ingredients: ['Lemon', 'Sugar', 'Water', 'Mint'], image: 'https://picsum.photos/400/300?random=8', available: true },
];

const MOCK_TABLES: Table[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `t-${i + 1}`,
  number: i + 1,
  capacity: i % 2 === 0 ? 4 : 2,
  status: 'available'
}));

// Mock users with passwords included (in a real app, these would be hashed in DB)
const INITIAL_DB_USERS = [
  { id: 'u1', name: 'Alice Admin', email: 'admin@dining.test', password: 'password', role: UserRole.ADMIN },
  { id: 'u2', name: 'Bob Waiter', email: 'waiter@dining.test', password: 'password', role: UserRole.WAITER },
  { id: 'u3', name: 'Charlie Chef', email: 'kitchen@dining.test', password: 'password', role: UserRole.KITCHEN },
  { id: 'u4', name: 'Diana Diner', email: 'customer@dining.test', password: 'password', role: UserRole.CUSTOMER, points: 150 },
];

// --- CONTEXT DEFINITION ---

interface StoreContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  menu: MenuItem[];
  tables: Table[];
  orders: Order[];
  reservations: Reservation[];
  
  // Actions
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paid'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  payOrder: (orderId: string) => Promise<void>;
  updateTableStatus: (tableId: string, status: Table['status']) => void;
  createReservation: (res: Omit<Reservation, 'id' | 'status'>) => Promise<void>;
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [dbUsers, setDbUsers] = useState(INITIAL_DB_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>(MOCK_MENU);
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const login = (email: string, password: string) => {
    const user = dbUsers.find(u => u.email === email && u.password === password);
    if (user) {
      // Return user without password
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    // Check if exists
    if (dbUsers.some(u => u.email === email)) return false;

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      password,
      role: UserRole.CUSTOMER, // Default to Customer
      points: 0
    };

    setDbUsers(prev => [...prev, newUser]);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const createOrder = async (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'paid'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: OrderStatus.PENDING,
      paid: false,
      items: newOrderData.items.map(item => ({ ...item, status: OrderStatus.PENDING }))
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // If it's a dine-in order, occupy the table
    if (newOrder.type === OrderType.DINE_IN && newOrder.tableId) {
      updateTableStatus(newOrder.tableId, 'occupied');
      setTables(prev => prev.map(t => t.id === newOrder.tableId ? { ...t, currentOrderId: newOrder.id } : t));
    }
    
    return newOrder.id;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          items: o.items.map(i => ({ ...i, status })) // Simplify: sync item status with order for demo
        };
      }
      return o;
    }));
  };

  const payOrder = async (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paid: true, status: OrderStatus.COMPLETED } : o));
    // Simulate freeing the table if paid
    const order = orders.find(o => o.id === orderId);
    if (order && order.tableId) {
      updateTableStatus(order.tableId, 'available');
      setTables(prev => prev.map(t => t.id === order.tableId ? { ...t, currentOrderId: undefined } : t));
    }
  };

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  const createReservation = async (res: Omit<Reservation, 'id' | 'status'>) => {
    const newRes: Reservation = {
      ...res,
      id: `res-${Date.now()}`,
      status: 'confirmed'
    };
    setReservations(prev => [...prev, newRes]);
  };

  const addMenuItem = (item: MenuItem) => setMenu(prev => [...prev, item]);
  const removeMenuItem = (id: string) => setMenu(prev => prev.filter(i => i.id !== id));

  return (
    <StoreContext.Provider value={{
      currentUser, login, register, logout,
      menu, tables, orders, reservations,
      createOrder, updateOrderStatus, payOrder, updateTableStatus, createReservation,
      addMenuItem, removeMenuItem
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};