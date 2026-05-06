import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, ShieldCheck, GraduationCap } from 'lucide-react';

export default function RegisterScreen() {
  const { t } = useLang();
  const { register } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('client');

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(name || 'Nuevo Usuario', email || 'nuevo@piobaroja.es', password || '123456', role);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/home');
    }
  };

  return (
    <div className="min-h-screen bg-piobite-bg flex flex-col" data-testid="register-screen">
      <div className="h-48 md:h-56 bg-gradient-to-br from-piobite-primary to-emerald-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-piobite-accent/15 rounded-full -translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative z-10 px-6 pt-12 md:px-12">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6" data-testid="register-back-btn">
            <ArrowLeft size={20} />
            <span className="font-body font-semibold text-sm">{t('common.back')}</span>
          </button>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-white tracking-tighter">{t('register.title')}</h1>
          <p className="font-body text-white/70 mt-1">{t('register.subtitle')}</p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-12 -mt-8 max-w-md mx-auto w-full pb-8">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 md:p-8 animate-fade-in-up">
          <p className="font-heading font-bold text-sm text-piobite-muted uppercase tracking-wider mb-3">{t('register.role')}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setRole('client')}
              data-testid="register-role-client"
              className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${role === 'client' ? 'border-piobite-primary bg-piobite-primary/5 shadow-md' : 'border-piobite-border hover:border-piobite-primary/30'}`}
            >
              <GraduationCap size={28} className={role === 'client' ? 'text-piobite-primary' : 'text-piobite-muted'} />
              <span className={`font-heading font-bold text-sm ${role === 'client' ? 'text-piobite-primary' : 'text-piobite-muted'}`}>{t('register.client')}</span>
            </button>
            <button
              onClick={() => setRole('admin')}
              data-testid="register-role-admin"
              className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${role === 'admin' ? 'border-piobite-primary bg-piobite-primary/5 shadow-md' : 'border-piobite-border hover:border-piobite-primary/30'}`}
            >
              <ShieldCheck size={28} className={role === 'admin' ? 'text-piobite-primary' : 'text-piobite-muted'} />
              <span className={`font-heading font-bold text-sm ${role === 'admin' ? 'text-piobite-primary' : 'text-piobite-muted'}`}>{t('register.admin')}</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-piobite-muted" />
              <input type="text" placeholder={t('register.name')} value={name} onChange={e => setName(e.target.value)} data-testid="register-name-input"
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary text-base font-body font-medium transition-all outline-none" />
            </div>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-piobite-muted" />
              <input type="email" placeholder={t('register.email')} value={email} onChange={e => setEmail(e.target.value)} data-testid="register-email-input"
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary text-base font-body font-medium transition-all outline-none" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-piobite-muted" />
              <input type={showPass ? 'text' : 'password'} placeholder={t('register.password')} value={password} onChange={e => setPassword(e.target.value)} data-testid="register-password-input"
                className="w-full pl-11 pr-12 py-4 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary text-base font-body font-medium transition-all outline-none" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-piobite-muted hover:text-piobite-text transition-colors">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-piobite-muted" />
              <input type="password" placeholder={t('register.confirmPassword')} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} data-testid="register-confirm-password-input"
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary text-base font-body font-medium transition-all outline-none" />
            </div>

            <button type="submit" data-testid="register-submit-btn"
              className="w-full py-4 bg-piobite-primary text-white font-heading font-bold text-lg rounded-full shadow-lg hover:bg-piobite-primary-hover hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              {t('register.register')}
            </button>
          </form>

          <p className="text-center mt-6 font-body text-piobite-muted text-sm">
            {t('register.hasAccount')}{' '}
            <button onClick={() => navigate('/login')} className="text-piobite-primary font-bold hover:underline" data-testid="register-goto-login">
              {t('register.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
