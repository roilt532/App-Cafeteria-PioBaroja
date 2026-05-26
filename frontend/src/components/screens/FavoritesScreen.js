import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Heart, Plus } from 'lucide-react';

export default function FavoritesScreen() {
  const { t, lang } = useLang();
  const { products, favorites, toggleFavorite, addToCart } = useApp();
  const navigate = useNavigate();

  const favProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-piobite-bg pb-24" data-testid="favorites-screen">
      <div className="px-6 pt-12 md:px-12 max-w-2xl mx-auto">
        <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter mb-6">{t('favorites.title')}</h1>

        {favProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-scale-in">
              <Heart size={40} className="text-red-400" />
            </div>
            <h2 className="font-heading font-bold text-xl text-piobite-text mb-2">{t('favorites.empty')}</h2>
            <p className="font-body text-piobite-muted text-sm text-center max-w-xs">{t('favorites.emptySubtitle')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favProducts.map((product, i) => (
              <div key={product.id} className={`bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-4 flex gap-4 animate-fade-in-up stagger-${(i % 5) + 1}`} data-testid={`fav-item-${product.id}`}>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-piobite-bg">
                  <img src={product.image} alt={lang === 'en' ? product.nameEn : product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-sm text-piobite-text truncate">{lang === 'en' ? product.nameEn : product.name}</h3>
                  <p className="font-body text-piobite-muted text-xs mt-0.5 truncate">{lang === 'en' ? product.descriptionEn : product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-heading font-black text-piobite-primary">{product.price.toFixed(2)}€</span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleFavorite(product.id)} className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-all" data-testid={`fav-remove-${product.id}`}>
                        <Heart size={16} className="fill-current" />
                      </button>
                      <button onClick={() => addToCart(product)} className="w-9 h-9 rounded-full bg-piobite-primary flex items-center justify-center text-white hover:bg-piobite-primary-hover transition-all" data-testid={`fav-add-cart-${product.id}`}>
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
