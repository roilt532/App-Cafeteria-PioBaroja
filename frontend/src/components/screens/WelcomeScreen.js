import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { ChevronRight } from 'lucide-react';

export default function WelcomeScreen() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" data-testid="welcome-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-piobite-primary via-emerald-600 to-emerald-800" />
      <div className="absolute inset-0 opacity-20" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(255,193,7,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.2) 0%, transparent 50%)',
      }} />
      <div className="absolute top-0 right-0 w-72 h-72 bg-piobite-accent/20 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-16 pb-10 md:px-12 lg:px-20 max-w-lg mx-auto w-full justify-between">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-piobite-primary font-heading font-black text-xl">P</span>
            </div>
            <span className="text-white/60 font-body text-sm font-semibold tracking-wider uppercase">Instituto Pío Baroja</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center py-10">
          <h1 className="font-heading font-black text-6xl md:text-7xl text-white tracking-tighter leading-none animate-fade-in-up mb-4" data-testid="welcome-title">
            {t('welcome.title')}
          </h1>
          <p className="font-heading font-bold text-xl md:text-2xl text-piobite-accent tracking-tight animate-fade-in-up stagger-1 mb-3">
            {t('welcome.subtitle')}
          </p>
          <p className="font-body text-white/70 text-base md:text-lg animate-fade-in-up stagger-2 max-w-xs">
            {t('welcome.tagline')}
          </p>
        </div>

        <div className="space-y-3 animate-fade-in-up stagger-3">
          <button
            onClick={() => navigate('/login')}
            data-testid="welcome-login-btn"
            className="w-full py-4 px-6 bg-white text-piobite-primary font-heading font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {t('welcome.login')}
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => navigate('/register')}
            data-testid="welcome-register-btn"
            className="w-full py-4 px-6 bg-white/15 backdrop-blur-sm text-white font-heading font-bold text-lg rounded-full border border-white/20 hover:bg-white/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('welcome.register')}
          </button>
          <button
            onClick={() => navigate('/home')}
            data-testid="welcome-guest-btn"
            className="w-full py-3 text-white/60 font-body font-semibold text-sm hover:text-white transition-colors duration-300"
          >
            {t('welcome.guest')}
          </button>
        </div>
      </div>
    </div>
  );
}
