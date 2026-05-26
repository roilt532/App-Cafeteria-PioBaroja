import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import QRCode from 'react-qr-code';
import { CheckCircle, Clock, Home, ClipboardList } from 'lucide-react';

export default function OrderConfirmation() {
  const { t } = useLang();
  const { lastOrder } = useApp();
  const navigate = useNavigate();

  const order = lastOrder || { code: 'PB0000', total: 0, timeSlot: '10:00 - 10:30', items: [] };

  return (
    <div className="min-h-screen bg-piobite-bg flex flex-col items-center px-6 pt-12 pb-28 md:pb-12" data-testid="order-confirmation-screen">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-bounce-in">
          <div className="w-20 h-20 bg-piobite-success/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={44} className="text-piobite-success" />
          </div>
          <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter">{t('orderConfirm.title')}</h1>
          <p className="font-body text-piobite-muted mt-1">{t('orderConfirm.subtitle')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-piobite-border/50 overflow-hidden animate-fade-in-up stagger-1" data-testid="order-qr-card">
          <div className="bg-gradient-to-br from-piobite-primary to-emerald-700 p-6 text-center">
            <p className="font-body text-white/70 text-xs uppercase tracking-wider mb-1">{t('orderConfirm.orderCode')}</p>
            <p className="font-heading font-black text-4xl text-white tracking-tighter" data-testid="order-code-text">{order.code}</p>
          </div>

          <div className="p-8 flex justify-center bg-white">
            <div className="p-4 bg-white rounded-2xl shadow-inner border border-piobite-border/30">
              <QRCode value={`PIOBITE-${order.code}`} size={160} level="H" data-testid="order-qr-code" />
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-t border-piobite-border/50">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-piobite-muted" />
                <span className="font-body text-piobite-muted text-sm">{t('orderConfirm.pickup')}</span>
              </div>
              <span className="font-heading font-bold text-piobite-text" data-testid="order-pickup-time">{order.timeSlot}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-piobite-border/50">
              <span className="font-body text-piobite-muted text-sm">{t('orderConfirm.total')}</span>
              <span className="font-heading font-black text-xl text-piobite-primary" data-testid="order-total">{order.total.toFixed(2)}€</span>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-piobite-border/50">
              <span className="font-body text-piobite-muted text-sm">{t('orderConfirm.status')}</span>
              <span className="px-3 py-1 bg-piobite-accent/20 text-piobite-accent-hover font-heading font-bold text-xs rounded-full" data-testid="order-status">
                {t('orderConfirm.pending')}
              </span>
            </div>

            {order.items.length > 0 && (
              <div className="pt-3 border-t border-piobite-border/50">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5">
                    <span className="font-body text-sm text-piobite-text">{item.qty}x {item.name}</span>
                    <span className="font-body text-sm text-piobite-muted">{(item.price * item.qty).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3 animate-fade-in-up stagger-3">
          <button onClick={() => navigate('/home')} className="w-full py-4 bg-piobite-primary text-white font-heading font-bold rounded-full shadow-lg hover:bg-piobite-primary-hover transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2" data-testid="order-back-home-btn">
            <Home size={18} />
            {t('orderConfirm.backHome')}
          </button>
          <button onClick={() => navigate('/orders')} className="w-full py-4 bg-white text-piobite-text font-heading font-bold rounded-full border border-piobite-border shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2" data-testid="order-view-orders-btn">
            <ClipboardList size={18} />
            {t('orderConfirm.viewOrders')}
          </button>
        </div>
      </div>
    </div>
  );
}
