import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { User, Mail, Globe, Bell, HelpCircle, FileText, LogOut, ChevronRight, Shield } from 'lucide-react';

export default function ProfileScreen() {
  const { t, lang, toggleLang } = useLang();
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Globe, label: t('profile.language'), value: lang === 'es' ? '🇪🇸 Español → English' : '🇬🇧 English → Español', action: toggleLang, testId: 'profile-language-toggle' },
    { icon: Bell, label: t('profile.notifications'), action: () => {}, testId: 'profile-notifications' },
    { icon: HelpCircle, label: t('profile.help'), action: () => {}, testId: 'profile-help' },
    { icon: FileText, label: t('profile.terms'), action: () => {}, testId: 'profile-terms' },
  ];

  return (
    <div className="min-h-screen bg-piobite-bg pb-24" data-testid="profile-screen">
      <div className="bg-gradient-to-br from-piobite-primary to-emerald-700 px-6 pt-12 pb-20 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-piobite-accent/15 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-heading font-black text-3xl text-white tracking-tighter mb-6">{t('profile.title')}</h1>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <span className="font-heading font-black text-2xl text-white">{user?.avatar || 'E'}</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-white">{user?.name || 'Estudiante'}</h2>
              <p className="font-body text-white/70 text-sm">{user?.email || 'estudiante@piobaroja.es'}</p>
              {user?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-piobite-accent/20 rounded-full">
                  <Shield size={10} className="text-piobite-accent" />
                  <span className="font-heading font-bold text-[10px] text-piobite-accent uppercase">Admin</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-piobite-border/50 overflow-hidden animate-fade-in-up">
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} className="w-full flex items-center justify-between px-6 py-4 hover:bg-piobite-bg transition-colors border-b border-piobite-border/30 last:border-b-0" data-testid={item.testId}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-piobite-primary/10 rounded-xl flex items-center justify-center">
                  <item.icon size={18} className="text-piobite-primary" />
                </div>
                <span className="font-heading font-bold text-sm text-piobite-text">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="font-body text-piobite-muted text-xs">{item.value}</span>}
                <ChevronRight size={16} className="text-piobite-muted" />
              </div>
            </button>
          ))}

          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-piobite-bg transition-colors border-b border-piobite-border/30" data-testid="profile-admin-panel">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-piobite-accent/15 rounded-xl flex items-center justify-center">
                  <Shield size={18} className="text-piobite-accent-hover" />
                </div>
                <span className="font-heading font-bold text-sm text-piobite-text">{t('nav.admin')}</span>
              </div>
              <ChevronRight size={16} className="text-piobite-muted" />
            </button>
          )}
        </div>

        <button onClick={handleLogout} className="w-full mt-4 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-error/20 p-4 flex items-center justify-center gap-2 text-piobite-error font-heading font-bold hover:bg-red-50 transition-all" data-testid="profile-logout-btn">
          <LogOut size={18} />
          {t('profile.logout')}
        </button>

        <p className="text-center mt-6 font-body text-piobite-muted text-xs">{t('profile.version')}</p>
      </div>
    </div>
  );
}
