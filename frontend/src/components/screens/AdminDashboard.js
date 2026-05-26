import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Search, Clock, CheckCircle, ChefHat, Truck, Package, AlertCircle, BarChart3, Boxes } from 'lucide-react';

const statusConfig = {
  pendiente: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pendiente' },
  preparando: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ChefHat, label: 'Preparando' },
  listo: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Package, label: 'Listo' },
  entregado: { color: 'bg-gray-100 text-gray-500 border-gray-200', icon: Truck, label: 'Entregado' },
};

const statusTransitions = {
  pendiente: 'preparando',
  preparando: 'listo',
  listo: 'entregado',
};

export default function AdminDashboard() {
  const { t } = useLang();
  const { adminOrders, updateAdminOrderStatus } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const tabs = [
    { id: 'all', label: 'Todos', count: adminOrders.length },
    { id: 'pendiente', label: t('admin.pending'), count: adminOrders.filter(o => o.status === 'pendiente').length },
    { id: 'preparando', label: t('admin.preparing'), count: adminOrders.filter(o => o.status === 'preparando').length },
    { id: 'listo', label: t('admin.ready'), count: adminOrders.filter(o => o.status === 'listo').length },
    { id: 'entregado', label: t('admin.delivered'), count: adminOrders.filter(o => o.status === 'entregado').length },
  ];

  const filteredOrders = activeTab === 'all' ? adminOrders : adminOrders.filter(o => o.status === activeTab);

  const handleVerify = () => {
    const found = adminOrders.find(o => o.code.toLowerCase() === verifyCode.toLowerCase());
    setVerifyResult(found ? { success: true, order: found } : { success: false });
    setTimeout(() => setVerifyResult(null), 3000);
  };

  const getActionButton = (order) => {
    const nextStatus = statusTransitions[order.status];
    if (!nextStatus) return null;
    const labels = { preparando: t('admin.markPreparing'), listo: t('admin.markReady'), entregado: t('admin.markDelivered') };
    return (
      <button onClick={() => updateAdminOrderStatus(order.id, nextStatus)}
        className="px-4 py-2 bg-piobite-primary text-white font-heading font-bold text-xs rounded-full hover:bg-piobite-primary-hover transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
        data-testid={`admin-action-${order.id}`}>
        {labels[nextStatus]}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-piobite-bg pb-24" data-testid="admin-dashboard-screen">
      <div className="bg-gradient-to-br from-piobite-primary to-emerald-700 px-6 pt-12 pb-16 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-piobite-accent/15 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4" data-testid="admin-back-btn">
            <ArrowLeft size={20} />
            <span className="font-body font-semibold text-sm">{t('common.back')}</span>
          </button>
          <h1 className="font-heading font-black text-3xl text-white tracking-tighter">{t('admin.title')}</h1>
          <p className="font-body text-white/70 mt-1">{t('admin.subtitle')}</p>

          <div className="flex gap-2 mt-4">
            <button onClick={() => navigate('/inventory')} className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/10 text-white font-heading font-bold text-xs hover:bg-white/25 transition-all" data-testid="admin-goto-inventory">
              <Boxes size={14} /> Inventario
            </button>
            <button onClick={() => navigate('/stats')} className="flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/10 text-white font-heading font-bold text-xs hover:bg-white/25 transition-all" data-testid="admin-goto-stats">
              <BarChart3 size={14} /> Estadísticas
            </button>
          </div>

          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="font-heading font-bold text-xs text-white/80 mb-2 uppercase tracking-wider">{t('admin.verifyCode')}</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder={t('admin.enterCode')}
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value)}
                  data-testid="admin-verify-input"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/15 border border-white/10 text-white placeholder-white/40 font-body font-medium text-sm outline-none focus:bg-white/25 transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                />
              </div>
              <button onClick={handleVerify} className="px-5 py-3 bg-piobite-accent text-piobite-text font-heading font-bold text-sm rounded-xl hover:bg-piobite-accent-hover transition-all" data-testid="admin-verify-btn">
                {t('admin.verify')}
              </button>
            </div>
            {verifyResult && (
              <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-body font-semibold ${verifyResult.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`} data-testid="admin-verify-result">
                {verifyResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {verifyResult.success ? `${t('admin.orderVerified')} - ${verifyResult.order.customer}` : t('admin.orderNotFound')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 max-w-4xl mx-auto">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4" data-testid="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`admin-tab-${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-heading font-bold text-xs whitespace-nowrap transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-piobite-primary text-white shadow-lg'
                  : 'bg-white text-piobite-text shadow-md border border-piobite-border/50'
              }`}
            >
              {tab.label}
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black ${
                activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-piobite-bg text-piobite-muted'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {filteredOrders.map((order, i) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <div key={order.id} className={`bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-piobite-border/50 p-5 animate-fade-in-up stagger-${(i % 5) + 1}`} data-testid={`admin-order-${order.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-black text-lg text-piobite-text">{order.code}</span>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-heading font-bold border ${config.color} flex items-center gap-1`}>
                        <StatusIcon size={10} />
                        {config.label}
                      </span>
                    </div>
                    <p className="font-body text-piobite-muted text-sm">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-black text-piobite-primary">{order.total.toFixed(2)}€</p>
                    <div className="flex items-center gap-1 text-piobite-muted mt-1">
                      <Clock size={12} />
                      <span className="font-body text-xs">{order.timeSlot}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-piobite-bg rounded-xl p-3 mb-3">
                  {order.items.map((item, j) => (
                    <p key={j} className="font-body text-sm text-piobite-text">{item.qty}x {item.name}</p>
                  ))}
                </div>

                <div className="flex justify-end">
                  {getActionButton(order)}
                </div>
              </div>
            );
          })}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="font-body text-piobite-muted">No hay pedidos en esta categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
