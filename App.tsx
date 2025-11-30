import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { CustomerMenu } from './pages/CustomerMenu';
import { CustomerReservations } from './pages/CustomerReservations';
import { WaiterPOS } from './pages/WaiterPOS';
import { KitchenDisplay } from './pages/KitchenDisplay';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserRole } from './types';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Customer Routes */}
            <Route path="/customer/menu" element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <CustomerMenu />
              </ProtectedRoute>
            } />
            <Route path="/customer/reservations" element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <CustomerReservations />
              </ProtectedRoute>
            } />
            <Route path="/customer/profile" element={<ProtectedRoute><div className="p-4">My Orders Placeholder</div></ProtectedRoute>} />

            {/* Staff Routes */}
            <Route path="/staff/pos" element={
              <ProtectedRoute allowedRoles={[UserRole.WAITER, UserRole.ADMIN]}>
                <WaiterPOS />
              </ProtectedRoute>
            } />
            <Route path="/staff/kitchen" element={
              <ProtectedRoute allowedRoles={[UserRole.KITCHEN, UserRole.WAITER, UserRole.ADMIN]}>
                <KitchenDisplay />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
}