import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Home, Heart, ClipboardList, User, ShoppingCart, Shield } from 'lucide-react';

export default function BottomNav() {
  const { t } = useLang();
  const { cartCount, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const clientItems = [
    { path: '/home', icon: Home, label: t('nav.home'), testId: 'nav-home' },
    { path: '/favorites', icon: Heart, label: t('nav.favorites'), testId: 'nav-favorites' },
    { path: '/cart', icon: ShoppingCart, label: t('nav.cart'), badge: cartCount, testId: 'nav-cart' },
    { path: '/orders', icon: ClipboardList, label: t('nav.orders'), testId: 'nav-orders' },
    { path: '/profile', icon: User, label: t('nav.profile'), testId: 'nav-profile' },
  ];

  const adminItems = [
    { path: '/home', icon: Home, label: t('nav.home'), testId: 'nav-home' },
    { path: '/admin', icon: Shield, label: t('nav.admin'), testId: 'nav-admin' },
    { path: '/profile', icon: User, label: t('nav.profile'), testId: 'nav-profile' },
  ];

  const items = user?.role === 'admin' ? adminItems : clientItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-piobite-border/50 z-50 md:hidden animate-slide-up" data-testid="bottom-nav">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              data-testid={item.testId}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-piobite-primary/10' : 'hover:bg-piobite-bg'
              }`}
            >
              <div className="relative">
                <item.icon size={22} className={`transition-colors duration-300 ${isActive ? 'text-piobite-primary' : 'text-piobite-muted'}`} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-piobite-accent text-piobite-text text-[9px] font-heading font-black rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`font-heading text-[10px] font-bold transition-colors duration-300 ${isActive ? 'text-piobite-primary' : 'text-piobite-muted'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
