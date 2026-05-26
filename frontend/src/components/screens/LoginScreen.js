import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';

export default function LoginScreen() {
  const { t } = useLang();
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('client');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email || 'admin@piobite.es', password || 'admin123', role);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/home');
    }
  };

  return (
    <div className="min-h-screen bg-piobite-bg flex flex-col" data-testid="login-screen">
      <div className="h-48 md:h-56 bg-gradient-to-br from-piobite-primary to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(255,193,7,0.3) 0%, transparent 60%)'
        }} />
        <div className="absolute top-0 right-0 w-40 h-40 bg-piobite-accent/20 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 px-6 pt-12 md:px-12">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6" data-testid="login-back-btn">
            <ArrowLeft size={20} />
            <span className="font-body font-semibold text-sm">{t('common.back')}</span>
          </button>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-white tracking-tighter">{t('login.title')}</h1>
          <p className="font-body text-white/70 mt-1">{t('login.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-12 -mt-8 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8 animate-fade-in-up">
          <div className="flex bg-piobite-bg rounded-2xl p-1 mb-6">
            <button
              onClick={() => setRole('client')}
              data-testid="login-role-client"
              className={`flex-1 py-3 px-4 rounded-xl font-heading font-bold text-sm transition-all duration-300 ${role === 'client' ? 'bg-piobite-primary text-white shadow-md' : 'text-piobite-muted hover:text-piobite-text'}`}
            >
              {t('register.client')}
            </button>
            <button
              onClick={() => setRole('admin')}
              data-testid="login-role-admin"
              className={`flex-1 py-3 px-4 rounded-xl font-heading font-bold text-sm transition-all duration-300 ${role === 'admin' ? 'bg-piobite-primary text-white shadow-md' : 'text-piobite-muted hover:text-piobite-text'}`}
            >
              {t('register.admin')}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-piobite-muted" />
              <input
                type="email"
                placeholder={t('login.email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                data-testid="login-email-input"
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary text-base font-body font-medium transition-all duration-300 outline-none"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-piobite-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('login.password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                data-testid="login-password-input"
                className="w-full pl-11 pr-12 py-4 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary text-base font-body font-medium transition-all duration-300 outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-piobite-muted hover:text-piobite-text transition-colors" data-testid="login-toggle-password">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right">
              <button type="button" className="text-piobite-primary font-body font-semibold text-sm hover:underline" data-testid="login-forgot-password">
                {t('login.forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              data-testid="login-submit-btn"
              className="w-full py-4 bg-piobite-primary text-white font-heading font-bold text-lg rounded-full shadow-lg hover:bg-piobite-primary-hover hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('login.login')}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-piobite-border" />
            <span className="font-body text-piobite-muted text-xs font-semibold uppercase tracking-wider">o</span>
            <div className="flex-1 h-px bg-piobite-border" />
          </div>

          <button
            data-testid="login-google-btn"
            className="w-full py-4 border-2 border-piobite-border rounded-full font-heading font-bold text-piobite-text hover:bg-piobite-bg transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {t('login.google')}
          </button>

          <p className="text-center mt-6 font-body text-piobite-muted text-sm">
            {t('login.noAccount')}{' '}
            <button onClick={() => navigate('/register')} className="text-piobite-primary font-bold hover:underline" data-testid="login-goto-register">
              {t('login.register')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
