import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartScreen() {
  const { t, lang } = useLang();
  const { cart, updateCartQty, removeFromCart, cartTotal, cartCount } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-piobite-bg flex flex-col" data-testid="cart-screen">
        <div className="px-6 pt-12 md:px-12">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-piobite-muted hover:text-piobite-text transition-colors mb-6" data-testid="cart-back-btn">
            <ArrowLeft size={20} />
            <span className="font-body font-semibold text-sm">{t('common.back')}</span>
          </button>
          <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter">{t('cart.title')}</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
          <div className="w-24 h-24 bg-piobite-primary/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
            <ShoppingBag size={40} className="text-piobite-primary" />
          </div>
          <h2 className="font-heading font-bold text-xl text-piobite-text mb-2">{t('cart.empty')}</h2>
          <p className="font-body text-piobite-muted text-sm mb-6">{t('cart.emptySubtitle')}</p>
          <button onClick={() => navigate('/home')} className="px-8 py-3 bg-piobite-primary text-white font-heading font-bold rounded-full shadow-lg hover:bg-piobite-primary-hover transition-all hover:scale-[1.02] active:scale-[0.98]" data-testid="cart-go-menu-btn">
            {t('cart.goToMenu')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-piobite-bg pb-40 md:pb-24" data-testid="cart-screen">
      <div className="px-6 pt-12 md:px-12 max-w-2xl mx-auto">
        <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-piobite-muted hover:text-piobite-text transition-colors mb-6" data-testid="cart-back-btn">
          <ArrowLeft size={20} />
          <span className="font-body font-semibold text-sm">{t('common.back')}</span>
        </button>
        <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter mb-6">{t('cart.title')} ({cartCount})</h1>

        <div className="space-y-4">
          {cart.map((item, i) => (
            <div key={item.id} className={`bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-4 flex gap-4 animate-fade-in-up stagger-${(i % 5) + 1}`} data-testid={`cart-item-${item.id}`}>
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-piobite-bg">
                <img src={item.image} alt={lang === 'en' ? item.nameEn : item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-sm text-piobite-text truncate">{lang === 'en' ? item.nameEn : item.name}</h3>
                <p className="font-heading font-black text-piobite-primary mt-1">{(item.price * item.qty).toFixed(2)}€</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-piobite-bg rounded-full px-1 py-1">
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-piobite-primary hover:text-white transition-all" data-testid={`cart-minus-${item.id}`}>
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="font-heading font-bold text-sm w-6 text-center" data-testid={`cart-qty-${item.id}`}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-piobite-primary hover:text-white transition-all" data-testid={`cart-plus-${item.id}`}>
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-piobite-error hover:bg-piobite-error/10 transition-all" data-testid={`cart-remove-${item.id}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-piobite-border/50 px-6 py-4 md:px-12 z-30" data-testid="cart-footer">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-body text-piobite-muted text-xs uppercase tracking-wider">{t('cart.total')}</p>
            <p className="font-heading font-black text-2xl text-piobite-text">{cartTotal.toFixed(2)}€</p>
          </div>
          <button onClick={() => navigate('/timeslot')} className="px-8 py-4 bg-piobite-primary text-white font-heading font-bold rounded-full shadow-lg hover:bg-piobite-primary-hover hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]" data-testid="cart-checkout-btn">
            {t('cart.checkout')}
          </button>
        </div>
      </div>
    </div>
  );
}
