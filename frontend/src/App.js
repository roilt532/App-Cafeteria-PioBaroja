import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/layout/BottomNav';
import Sidebar from './components/layout/Sidebar';
import WelcomeScreen from './components/screens/WelcomeScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import HomeScreen from './components/screens/HomeScreen';
import CartScreen from './components/screens/CartScreen';
import TimeSlotScreen from './components/screens/TimeSlotScreen';
import OrderConfirmation from './components/screens/OrderConfirmation';
import OrderHistory from './components/screens/OrderHistory';
import FavoritesScreen from './components/screens/FavoritesScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import AdminDashboard from './components/screens/AdminDashboard';
import PaymentScreen from './components/screens/PaymentScreen';
import InventoryScreen from './components/screens/InventoryScreen';
import StatsScreen from './components/screens/StatsScreen';

const authRoutes = ['/', '/login', '/register'];

function AppLayout() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-piobite-bg">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 ${!isAuthPage ? 'md:ml-64 lg:ml-72' : ''}`} data-testid="main-content">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/timeslot" element={<TimeSlotScreen />} />
          <Route path="/order-confirmed" element={<OrderConfirmation />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/favorites" element={<FavoritesScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/inventory" element={<InventoryScreen />} />
          <Route path="/stats" element={<StatsScreen />} />
        </Routes>
      </main>
      {!isAuthPage && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
