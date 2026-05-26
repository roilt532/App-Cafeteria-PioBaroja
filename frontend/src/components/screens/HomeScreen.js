import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Search, Heart, Plus, Leaf, Star, ShoppingCart } from 'lucide-react';

function ProductCard({ product, onAdd, onFav, isFav, lang }) {
  const displayName = lang === 'en' ? product.nameEn : product.name;
  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 overflow-hidden animate-fade-in-up transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group" data-testid={`product-card-${product.id}`}>
      <div className="relative h-36 md:h-44 overflow-hidden bg-piobite-bg">
        <img src={product.image} alt={displayName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        {product.healthy && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-heading font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Leaf size={12} /> Saludable
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onFav(product.id); }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-90 z-10" data-testid={`fav-btn-${product.id}`}>
          <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-piobite-muted'} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-sm text-piobite-text leading-tight truncate">{displayName}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="font-heading font-black text-lg text-piobite-primary">{product.price.toFixed(2)}€</span>
          <button onClick={(e) => { e.stopPropagation(); onAdd(product); }} className="w-10 h-10 bg-piobite-primary rounded-full flex items-center justify-center text-white shadow-md hover:bg-piobite-primary-hover transition-all duration-300 hover:scale-110 active:scale-90 relative z-10" data-testid={`add-to-cart-${product.id}`}>
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const { t, lang } = useLang();
  const { products, categories, addToCart, favorites, toggleFavorite, cartCount, user } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const name = lang === 'en' ? p.nameEn : p.name;
    const matchesSearch = !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const popularProducts = products.filter(p => p.popular);

  const getCategoryIcon = (icon) => {
    switch (icon) {
      case 'grid': return '🍽️';
      case 'sandwich': return '🥖';
      case 'croissant': return '🥐';
      case 'salad': return '🥗';
      case 'coffee': return '☕';
      case 'cup-soda': return '🧃';
      default: return '📦';
    }
  };

  return (
    <div className="min-h-screen bg-piobite-bg pb-24 md:pb-6" data-testid="home-screen">
      <div className="bg-gradient-to-br from-piobite-primary to-emerald-700 px-6 pt-12 pb-20 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-piobite-accent/15 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-body text-white/70 text-sm">{t('home.greeting')}, {user?.name || 'Estudiante'}!</p>
              <h1 className="font-heading font-black text-2xl md:text-3xl text-white tracking-tighter">PíoBite</h1>
            </div>
            <button onClick={() => navigate('/cart')} className="relative w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/25 transition-all" data-testid="header-cart-btn">
              <ShoppingCart size={22} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-piobite-accent text-piobite-text text-xs font-heading font-black rounded-full flex items-center justify-center shadow-md animate-bounce-in" data-testid="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder={t('home.search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              data-testid="search-input"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 text-white placeholder-white/50 font-body font-medium focus:bg-white/25 focus:border-white/30 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-12 max-w-4xl mx-auto">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4" data-testid="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              data-testid={`category-${cat.id}`}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-heading font-bold text-sm whitespace-nowrap transition-all duration-300 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-piobite-primary text-white shadow-lg shadow-piobite-primary/30'
                  : 'bg-white text-piobite-text shadow-md hover:shadow-lg border border-piobite-border/50'
              }`}
            >
              <span className="text-base">{getCategoryIcon(cat.icon)}</span>
              {lang === 'en' ? cat.nameEn : cat.name}
            </button>
          ))}
        </div>

        {activeCategory === 'all' && !searchQuery && (
          <div className="mt-6 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-extrabold text-xl text-piobite-text tracking-tight flex items-center gap-2">
                <Star size={20} className="text-piobite-accent fill-piobite-accent" />
                {t('home.popular')}
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
              {popularProducts.map(product => (
                <div key={product.id} className="min-w-[200px] md:min-w-[220px]">
                  <ProductCard
                    product={product}
                    onAdd={addToCart}
                    onFav={toggleFavorite}
                    isFav={favorites.includes(product.id)}
                    lang={lang}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="font-heading font-extrabold text-xl text-piobite-text tracking-tight mb-4">
            {activeCategory === 'all' ? t('home.categories') : (lang === 'en' ? categories.find(c => c.id === activeCategory)?.nameEn : categories.find(c => c.id === activeCategory)?.name)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <div key={product.id} className={`stagger-${(i % 5) + 1}`}>
                <ProductCard
                  product={product}
                  onAdd={addToCart}
                  onFav={toggleFavorite}
                  isFav={favorites.includes(product.id)}
                  lang={lang}
                />
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-piobite-muted text-lg">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
