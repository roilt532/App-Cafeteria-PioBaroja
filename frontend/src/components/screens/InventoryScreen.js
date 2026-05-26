import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Package, AlertTriangle, Check, Minus, Plus } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

export default function InventoryScreen() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchInventory = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const url = filter === 'low' ? `${API}/api/inventario?stock_bajo=true` : `${API}/api/inventario`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setInventory(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const updateStock = async (id, newStock) => {
    const token = localStorage.getItem('access_token');
    await fetch(`${API}/api/inventario/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ stock: Math.max(0, newStock) })
    });
    fetchInventory();
  };

  const toggleDisponible = async (id, current) => {
    const token = localStorage.getItem('access_token');
    await fetch(`${API}/api/inventario/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ disponible: !current })
    });
    fetchInventory();
  };

  return (
    <div className="min-h-screen bg-piobite-bg pb-24" data-testid="inventory-screen">
      <div className="bg-gradient-to-br from-piobite-primary to-emerald-700 px-6 pt-12 pb-16 md:px-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4" data-testid="inventory-back-btn">
            <ArrowLeft size={20} /><span className="font-body font-semibold text-sm">Volver</span>
          </button>
          <h1 className="font-heading font-black text-3xl text-white tracking-tighter">Gestión de Inventario</h1>
          <p className="font-body text-white/70 mt-1">Control de stock de todos los productos</p>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-full font-heading font-bold text-xs transition-all ${filter === 'all' ? 'bg-piobite-primary text-white shadow-lg' : 'bg-white text-piobite-text shadow-md border border-piobite-border/50'}`} data-testid="inventory-filter-all">
            Todos ({inventory.length})
          </button>
          <button onClick={() => setFilter('low')} className={`px-4 py-2 rounded-full font-heading font-bold text-xs transition-all flex items-center gap-1 ${filter === 'low' ? 'bg-piobite-error text-white shadow-lg' : 'bg-white text-piobite-text shadow-md border border-piobite-border/50'}`} data-testid="inventory-filter-low">
            <AlertTriangle size={12} /> Stock Bajo
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="font-body text-piobite-muted">Cargando inventario...</p></div>
        ) : (
          <div className="space-y-3">
            {inventory.map((item, i) => {
              const isLow = item.stock <= item.stock_minimo;
              return (
                <div key={item.id} className={`bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border p-4 animate-fade-in-up ${isLow ? 'border-piobite-error/30' : 'border-piobite-border/50'}`} data-testid={`inventory-item-${item.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm text-piobite-text">{item.nombre}</h3>
                      {isLow && <AlertTriangle size={14} className="text-piobite-error" />}
                    </div>
                    <span className="font-heading font-bold text-xs text-piobite-muted">{item.precio}€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-body text-xs text-piobite-muted">Stock:</span>
                      <div className="flex items-center gap-2 bg-piobite-bg rounded-full px-1 py-1">
                        <button onClick={() => updateStock(item.id, item.stock - 1)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-piobite-error hover:text-white transition-all" data-testid={`inv-minus-${item.id}`}>
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className={`font-heading font-bold text-sm w-8 text-center ${isLow ? 'text-piobite-error' : 'text-piobite-text'}`}>{item.stock}</span>
                        <button onClick={() => updateStock(item.id, item.stock + 1)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-piobite-primary hover:text-white transition-all" data-testid={`inv-plus-${item.id}`}>
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                      <span className="font-body text-[10px] text-piobite-muted">(mín: {item.stock_minimo})</span>
                    </div>
                    <button onClick={() => toggleDisponible(item.id, item.disponible)} className={`px-3 py-1.5 rounded-full font-heading font-bold text-[10px] transition-all flex items-center gap-1 ${item.disponible ? 'bg-piobite-success/15 text-piobite-success' : 'bg-piobite-error/15 text-piobite-error'}`} data-testid={`inv-toggle-${item.id}`}>
                      {item.disponible ? <><Check size={10} /> Disponible</> : 'No disponible'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
