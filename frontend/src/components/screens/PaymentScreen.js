import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CreditCard, Shield, CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentScreen() {
  const { t } = useLang();
  const { lastOrder, setLastOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const order = lastOrder;
  if (!order) {
    return (
      <div className="min-h-screen bg-piobite-bg flex items-center justify-center" data-testid="payment-screen">
        <div className="text-center">
          <p className="font-body text-piobite-muted">No hay pedido pendiente de pago</p>
          <button onClick={() => navigate('/home')} className="mt-4 px-6 py-3 bg-piobite-primary text-white rounded-full font-heading font-bold" data-testid="payment-go-home">Volver al menú</button>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    setProcessing(true);
    setTimeout(() => {
      setStep('success');
      setProcessing(false);
      if (order) {
        setLastOrder({ ...order, pagado: true, estado: 'pendiente' });
      }
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-piobite-bg flex flex-col items-center justify-center px-6" data-testid="payment-success-screen">
        <div className="animate-bounce-in mb-6">
          <div className="w-20 h-20 bg-piobite-success/15 rounded-full flex items-center justify-center">
            <CheckCircle size={44} className="text-piobite-success" />
          </div>
        </div>
        <h1 className="font-heading font-black text-2xl text-piobite-text mb-2">Pago Realizado</h1>
        <p className="font-body text-piobite-muted text-center mb-6">Tu pago de <strong className="text-piobite-primary">{order.total?.toFixed(2) || '0.00'}€</strong> ha sido procesado correctamente</p>
        <button onClick={() => navigate('/order-confirmed')} className="px-8 py-4 bg-piobite-primary text-white rounded-full font-heading font-bold shadow-lg hover:scale-[1.02] transition-all" data-testid="payment-continue-btn">
          Ver Confirmación
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-piobite-bg pb-24" data-testid="payment-screen">
      <div className="px-6 pt-12 md:px-12 max-w-md mx-auto">
        <button onClick={() => navigate('/timeslot')} className="flex items-center gap-2 text-piobite-muted hover:text-piobite-text transition-colors mb-6" data-testid="payment-back-btn">
          <ArrowLeft size={20} />
          <span className="font-body font-semibold text-sm">Volver</span>
        </button>

        <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter mb-2">Pasarela de Pago</h1>
        <div className="flex items-center gap-2 mb-6">
          <Shield size={14} className="text-piobite-success" />
          <span className="font-body text-piobite-muted text-xs">Pago seguro con Redsys</span>
        </div>

        <div className="bg-piobite-primary/10 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-body text-piobite-muted text-sm">Total a pagar</span>
            <span className="font-heading font-black text-2xl text-piobite-primary">{order.total?.toFixed(2) || '0.00'}€</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="font-body text-piobite-muted text-xs">Pedido #{order.codigo || order.code}</span>
            <span className="font-body text-piobite-muted text-xs">Recogida: {order.franja_horaria || order.timeSlot}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={20} className="text-piobite-primary" />
            <h2 className="font-heading font-bold text-base">Datos de la tarjeta</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-body font-semibold text-xs text-piobite-muted uppercase tracking-wider">Número de tarjeta</label>
              <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={e => setCardNumber(e.target.value)} data-testid="payment-card-number"
                className="w-full mt-1 px-4 py-3.5 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary font-body font-medium outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body font-semibold text-xs text-piobite-muted uppercase tracking-wider">Caducidad</label>
                <input type="text" placeholder="MM/AA" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} data-testid="payment-expiry"
                  className="w-full mt-1 px-4 py-3.5 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary font-body font-medium outline-none transition-all" />
              </div>
              <div>
                <label className="font-body font-semibold text-xs text-piobite-muted uppercase tracking-wider">CVV</label>
                <input type="text" placeholder="123" maxLength={3} value={cvv} onChange={e => setCvv(e.target.value)} data-testid="payment-cvv"
                  className="w-full mt-1 px-4 py-3.5 rounded-2xl border border-piobite-border bg-piobite-bg focus:ring-2 focus:ring-piobite-primary focus:border-piobite-primary font-body font-medium outline-none transition-all" />
              </div>
            </div>
          </div>

          <button onClick={handlePay} disabled={processing} className="w-full mt-6 py-4 bg-piobite-primary text-white font-heading font-bold text-lg rounded-full shadow-lg hover:bg-piobite-primary-hover transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" data-testid="payment-pay-btn">
            {processing ? <><Loader2 size={20} className="animate-spin" /> Procesando...</> : `Pagar ${order.total?.toFixed(2) || '0.00'}€`}
          </button>

          <p className="text-center mt-4 font-body text-piobite-muted text-[10px]">Simulación de pasarela Redsys · Entorno de pruebas</p>
        </div>
      </div>
    </div>
  );
}
