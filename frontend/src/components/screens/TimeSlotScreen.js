import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Clock, Check, X } from 'lucide-react';

export default function TimeSlotScreen() {
  const { t } = useLang();
  const { timeSlots, selectedTimeSlot, setSelectedTimeSlot, placeOrder } = useApp();
  const navigate = useNavigate();

  const handleConfirm = () => {
    placeOrder();
    navigate('/payment');
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-piobite-bg pb-32 md:pb-24" data-testid="timeslot-screen">
      <div className="px-6 pt-12 md:px-12 max-w-2xl mx-auto">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-piobite-muted hover:text-piobite-text transition-colors mb-6" data-testid="timeslot-back-btn">
          <ArrowLeft size={20} />
          <span className="font-body font-semibold text-sm">{t('common.back')}</span>
        </button>
        <h1 className="font-heading font-black text-3xl text-piobite-text tracking-tighter">{t('timeSlot.title')}</h1>
        <p className="font-body text-piobite-muted mt-1 mb-2">{t('timeSlot.subtitle')}</p>

        <div className="flex items-center gap-2 mt-4 mb-6 bg-piobite-primary/10 px-4 py-2.5 rounded-2xl w-fit">
          <Clock size={16} className="text-piobite-primary" />
          <span className="font-heading font-bold text-sm text-piobite-primary capitalize">{t('timeSlot.today')}: {dateStr}</span>
        </div>

        <div className="grid grid-cols-2 gap-3" data-testid="timeslot-grid">
          {timeSlots.map((slot, i) => (
            <button
              key={slot.id}
              onClick={() => slot.available && setSelectedTimeSlot(slot)}
              disabled={!slot.available}
              data-testid={`timeslot-${slot.id}`}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 animate-fade-in-up stagger-${(i % 5) + 1} ${
                !slot.available
                  ? 'border-piobite-border bg-piobite-bg/50 opacity-50 cursor-not-allowed'
                  : selectedTimeSlot?.id === slot.id
                    ? 'border-piobite-primary bg-piobite-primary/5 shadow-lg shadow-piobite-primary/20'
                    : 'border-piobite-border bg-white hover:border-piobite-primary/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Clock size={16} className={selectedTimeSlot?.id === slot.id ? 'text-piobite-primary' : 'text-piobite-muted'} />
                {slot.available ? (
                  selectedTimeSlot?.id === slot.id ? (
                    <div className="w-6 h-6 bg-piobite-primary rounded-full flex items-center justify-center"><Check size={14} className="text-white" /></div>
                  ) : (
                    <span className="font-body text-xs font-semibold text-piobite-success">{t('timeSlot.available')}</span>
                  )
                ) : (
                  <span className="font-body text-xs font-semibold text-piobite-error flex items-center gap-1"><X size={12} />{t('timeSlot.full')}</span>
                )}
              </div>
              <p className={`font-heading font-bold text-base ${selectedTimeSlot?.id === slot.id ? 'text-piobite-primary' : 'text-piobite-text'}`}>{slot.time}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-piobite-border/50 px-6 py-4 md:px-12 z-30">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleConfirm}
            disabled={!selectedTimeSlot}
            data-testid="timeslot-confirm-btn"
            className={`w-full py-4 font-heading font-bold text-lg rounded-full shadow-lg transition-all duration-300 ${
              selectedTimeSlot
                ? 'bg-piobite-primary text-white hover:bg-piobite-primary-hover hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-piobite-border text-piobite-muted cursor-not-allowed'
            }`}
          >
            {t('timeSlot.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
