import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Home, Heart, ClipboardList, User, ShoppingCart, Shield, Globe } from 'lucide-react';

export default function Sidebar() {
  const { t, lang, toggleLang } = useLang();
  const { cartCount, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const clientItems = [
    { path: '/home', icon: Home, label: t('nav.home'), testId: 'sidebar-home' },
    { path: '/favorites', icon: Heart, label: t('nav.favorites'), testId: 'sidebar-favorites' },
    { path: '/cart', icon: ShoppingCart, label: t('nav.cart'), badge: cartCount, testId: 'sidebar-cart' },
    { path: '/orders', icon: ClipboardList, label: t('nav.orders'), testId: 'sidebar-orders' },
    { path: '/profile', icon: User, label: t('nav.profile'), testId: 'sidebar-profile' },
  ];

  const adminItems = [
    { path: '/home', icon: Home, label: t('nav.home'), testId: 'sidebar-home' },
    { path: '/admin', icon: Shield, label: t('nav.admin'), testId: 'sidebar-admin' },
    { path: '/orders', icon: ClipboardList, label: t('nav.orders'), testId: 'sidebar-orders' },
    { path: '/profile', icon: User, label: t('nav.profile'), testId: 'sidebar-profile' },
  ];

  const items = user?.role === 'admin' ? adminItems : clientItems;

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-piobite-border/50 min-h-screen fixed left-0 top-0 z-40" data-testid="sidebar-nav">
      <div className="p-6 border-b border-piobite-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-piobite-primary rounded-xl flex items-center justify-center">
            <span className="font-heading font-black text-white text-lg">P</span>
          </div>
          <div>
            <h1 className="font-heading font-black text-xl text-piobite-text tracking-tighter">PíoBite</h1>
            <p className="font-body text-piobite-muted text-[10px] font-semibold uppercase tracking-wider">Cafetería Pío Baroja</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-4 px-3">
        <div className="space-y-1">
          {items.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                data-testid={item.testId}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-piobite-primary text-white shadow-lg shadow-piobite-primary/20'
                    : 'text-piobite-muted hover:bg-piobite-bg hover:text-piobite-text'
                }`}
              >
                <div className="relative">
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge > 0 && (
                    <span className={`absolute -top-2 -right-2 w-4 h-4 text-[9px] font-heading font-black rounded-full flex items-center justify-center ${isActive ? 'bg-piobite-accent text-piobite-text' : 'bg-piobite-primary text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="font-heading font-bold text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-piobite-border/50">
        <button onClick={toggleLang} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-piobite-muted hover:bg-piobite-bg hover:text-piobite-text transition-all" data-testid="sidebar-lang-toggle">
          <Globe size={18} />
          <span className="font-heading font-bold text-sm">{lang === 'es' ? 'English' : 'Español'}</span>
        </button>
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 mt-1">
            <div className="w-9 h-9 bg-piobite-primary/15 rounded-full flex items-center justify-center">
              <span className="font-heading font-bold text-sm text-piobite-primary">{user.avatar}</span>
            </div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-xs text-piobite-text truncate">{user.name}</p>
              <p className="font-body text-[10px] text-piobite-muted truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
