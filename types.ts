export enum UserRole {
  CUSTOMER = 'customer',
  WAITER = 'waiter',
  KITCHEN = 'kitchen',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points?: number; // Loyalty points
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  image: string;
  available: boolean;
  calories?: number;
}

export enum OrderStatus {
  PENDING = 'pending', // Sent to kitchen
  PREPARING = 'preparing', // Kitchen working
  READY = 'ready', // Ready to serve
  SERVED = 'served', // Customer has it
  COMPLETED = 'completed' // Paid and closed
}

export enum OrderType {
  DINE_IN = 'dine-in',
  TAKEAWAY = 'takeaway',
  DELIVERY = 'delivery'
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  status: OrderStatus;
}

export interface Order {
  id: string;
  tableId?: string; // Null if takeaway/delivery
  customerId?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  createdAt: string; // ISO Date
  paid: boolean;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'cancelled';
}