import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, TrendingUp, ShoppingBag, DollarSign, Package, AlertTriangle, Clock } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

export default function StatsScreen() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        const [resumen, top] = await Promise.all([
          fetch(`${API}/api/estadisticas/resumen`, { headers }).then(r => r.json()),
          fetch(`${API}/api/estadisticas/productos-top?limite=5`, { headers }).then(r => r.json())
        ]);
        setStats(resumen);
        setTopProducts(top);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-piobite-bg flex items-center justify-center" data-testid="stats-screen">
        <p className="font-body text-piobite-muted">Cargando estadísticas...</p>
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Pedidos Totales', value: stats.pedidos_totales, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Ingresos Totales', value: `${stats.ingresos_totales}€`, icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Ticket Medio', value: `${stats.ticket_medio}€`, icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
    { label: 'Pedidos Hoy', value: stats.pedidos_hoy, icon: Clock, color: 'bg-purple-100 text-purple-600' },
    { label: 'Ingresos Hoy', value: `${stats.ingresos_hoy}€`, icon: DollarSign, color: 'bg-piobite-primary/10 text-piobite-primary' },
    { label: 'Stock Bajo', value: stats.productos_stock_bajo, icon: AlertTriangle, color: stats.productos_stock_bajo > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500' },
  ] : [];

  return (
    <div className="min-h-screen bg-piobite-bg pb-24" data-testid="stats-screen">
      <div className="bg-gradient-to-br from-piobite-primary to-emerald-700 px-6 pt-12 pb-16 md:px-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4" data-testid="stats-back-btn">
            <ArrowLeft size={20} /><span className="font-body font-semibold text-sm">Volver</span>
          </button>
          <h1 className="font-heading font-black text-3xl text-white tracking-tighter">Estadísticas</h1>
          <p className="font-body text-white/70 mt-1">Resumen de ventas y rendimiento</p>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {statCards.map((card, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-4 animate-fade-in-up stagger-${(i % 5) + 1}`} data-testid={`stat-card-${i}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon size={18} />
              </div>
              <p className="font-heading font-black text-xl text-piobite-text">{card.value}</p>
              <p className="font-body text-piobite-muted text-xs mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {stats && (
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-5 mb-6 animate-fade-in-up">
            <h2 className="font-heading font-bold text-base mb-3">Estado de Pedidos</h2>
            <div className="space-y-2">
              {Object.entries(stats.estados).map(([estado, count]) => {
                const total = Object.values(stats.estados).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total * 100) : 0;
                const colors = { pendiente: 'bg-amber-400', preparando: 'bg-blue-400', listo: 'bg-emerald-400', entregado: 'bg-gray-300' };
                return (
                  <div key={estado} className="flex items-center gap-3">
                    <span className="font-body text-xs text-piobite-muted w-20 capitalize">{estado}</span>
                    <div className="flex-1 h-3 bg-piobite-bg rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${colors[estado] || 'bg-gray-300'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-heading font-bold text-xs text-piobite-text w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats && (
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-5 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Package size={16} className="text-piobite-primary" />
              <h3 className="font-heading font-bold text-sm">Producto Estrella</h3>
            </div>
            <p className="font-heading font-black text-lg text-piobite-primary">{stats.producto_mas_vendido}</p>
          </div>
        )}

        {topProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-5 animate-fade-in-up">
            <h2 className="font-heading font-bold text-base mb-3">Top Productos Vendidos</h2>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-piobite-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-piobite-primary/10 rounded-lg flex items-center justify-center font-heading font-black text-xs text-piobite-primary">{i + 1}</span>
                    <span className="font-body font-semibold text-sm text-piobite-text">{p.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-bold text-sm text-piobite-text">{p.vendidos} uds</span>
                    <span className="font-body text-piobite-muted text-xs ml-2">{p.ingresos}€</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
