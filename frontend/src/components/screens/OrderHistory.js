import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ClipboardList, Clock, RefreshCw, ChevronRight } from 'lucide-react';

const statusColors = {
  pendiente: 'bg-amber-100 text-amber-700',
  preparando: 'bg-blue-100 text-blue-700',
  listo: 'bg-emerald-100 text-emerald-700',
  entregado: 'bg-gray-100 text-gray-500',
};

export default function OrderHistory() {
  const { t, lang } = useLang();
  const { orders } = useApp();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-piobite-bg pb-24" data-testid="order-history-screen">
        <div className="px-6 pt-12 md:px-12">
          <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter">{t('orderHistory.title')}</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 mt-20">
          <div className="w-24 h-24 bg-piobite-primary/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
            <ClipboardList size={40} className="text-piobite-primary" />
          </div>
          <h2 className="font-heading font-bold text-xl text-piobite-text mb-2">{t('orderHistory.empty')}</h2>
          <p className="font-body text-piobite-muted text-sm">{t('orderHistory.emptySubtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-piobite-bg pb-24" data-testid="order-history-screen">
      <div className="px-6 pt-12 md:px-12 max-w-2xl mx-auto">
        <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter mb-6">{t('orderHistory.title')}</h1>

        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order.id} className={`bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-5 animate-fade-in-up stagger-${(i % 5) + 1}`} data-testid={`order-card-${order.id}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-heading font-black text-lg text-piobite-text" data-testid={`order-code-${order.id}`}>{order.code}</p>
                  <p className="font-body text-piobite-muted text-xs">{order.date}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full font-heading font-bold text-xs ${statusColors[order.status]}`} data-testid={`order-status-${order.id}`}>
                  {t(`orderHistory.status.${order.status}`)}
                </span>
              </div>

              <div className="space-y-1.5 py-3 border-t border-b border-piobite-border/50">
                {order.items.map((item, j) => (
                  <div key={j} className="flex justify-between">
                    <span className="font-body text-sm text-piobite-text">{item.qty}x {item.name}</span>
                    <span className="font-body text-sm text-piobite-muted">{(item.price * item.qty).toFixed(2)}€</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5 text-piobite-muted">
                  <Clock size={14} />
                  <span className="font-body text-xs">{order.timeSlot}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading font-black text-piobite-primary">{order.total.toFixed(2)}€</span>
                  <button className="flex items-center gap-1 text-piobite-primary font-heading font-bold text-xs hover:underline" data-testid={`reorder-btn-${order.id}`}>
                    <RefreshCw size={12} />
                    {t('orderHistory.reorder')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
