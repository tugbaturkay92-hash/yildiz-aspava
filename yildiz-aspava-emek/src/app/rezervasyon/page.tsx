'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, User } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

interface Slot {
  time: string;
  available: boolean;
}

export default function ReservasyonPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calendar state
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(calendarMonth.getFullYear(), calendarMonth.getMonth());
  const firstDay = getFirstDayOfMonth(calendarMonth.getFullYear(), calendarMonth.getMonth());
  // Adjust first day: Monday = 0
  const adjustedFirstDay = (firstDay + 6) % 7;

  const handleDateSelect = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime('');
    setStep(2);
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/reservations/available-slots?date=${dateStr}&guests=${guestCount}`);
      const data = await res.json();
      setSlots(data);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleGuestConfirm = () => {
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.customerPhone.trim()) {
      setError('Ad soyad ve telefon zorunludur.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          guestCount,
          ...form,
        }),
      });
      if (!res.ok) throw new Error('Hata');
      const data = await res.json();
      router.push(`/rezervasyon/basarili?code=${data.confirmationCode}&date=${selectedDate}&time=${selectedTime}&guests=${guestCount}&name=${encodeURIComponent(form.customerName)}`);
    } catch {
      setError('Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ['Tarih', 'Saat', 'Kişi Sayısı', 'Bilgiler'];
  const stepIcons = [Calendar, Clock, Users, User];

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#111111] pt-20 pb-16">
        <div className="bg-[#0d0d0d] border-b-4 border-[#ad3114] py-10">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-[#C59D5F] text-xs font-bold tracking-[0.3em] uppercase mb-2">Yıldız Aspava Emek</p>
            <h1 className="text-3xl font-extrabold text-white">Rezervasyon</h1>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-10">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10">
            {stepLabels.map((label, i) => {
              const StepIcon = stepIcons[i];
              const stepNum = (i + 1) as Step;
              const done = step > stepNum;
              const active = step === stepNum;
              return (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-colors ${
                    done ? 'bg-[#ad3114] text-white' : active ? 'bg-[#ad3114] text-white ring-4 ring-[#ad3114]/20' : 'bg-[#1e1e1e] text-[#606060] border border-white/10'
                  }`}>
                    {done ? '✓' : <StepIcon size={16} />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-white' : 'text-[#606060]'}`}>{label}</span>
                  {i < 3 && <div className={`absolute h-0.5 w-full ${done ? 'bg-[#ad3114]' : 'bg-white/10'}`} style={{ display: 'none' }} />}
                </div>
              );
            })}
          </div>

          {/* Step 1: Tarih */}
          {step === 1 && (
            <div className="bg-[#1e1e1e] border border-white/8 rounded-lg p-8">
              <h2 className="text-white text-xl font-bold mb-6">Tarih Seçin</h2>

              {/* Calendar nav */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                  className="text-[#808080] hover:text-white p-2"
                  disabled={calendarMonth <= new Date(today.getFullYear(), today.getMonth(), 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-white font-semibold capitalize">
                  {format(calendarMonth, 'MMMM yyyy', { locale: tr })}
                </span>
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                  className="text-[#808080] hover:text-white p-2"
                  disabled={calendarMonth >= addDays(today, 30)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map((d) => (
                  <div key={d} className="text-center text-[#606060] text-xs font-bold py-1">{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: adjustedFirstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dateObj = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
                  const isPast = isBefore(dateObj, startOfDay(today));
                  const isFuture = dateObj > addDays(today, 30);
                  const isSelected = selectedDate === dateStr;
                  const isDisabled = isPast || isFuture;

                  return (
                    <button
                      key={day}
                      onClick={() => !isDisabled && handleDateSelect(dateStr)}
                      disabled={isDisabled}
                      className={`aspect-square rounded text-sm font-semibold transition-colors ${
                        isSelected ? 'bg-[#ad3114] text-white' :
                        isDisabled ? 'text-[#333] cursor-not-allowed' :
                        'text-[#a0a0a0] hover:bg-[#ad3114]/20 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Saat */}
          {step === 2 && (
            <div className="bg-[#1e1e1e] border border-white/8 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(1)} className="text-[#808080] hover:text-white"><ChevronLeft size={18} /></button>
                <h2 className="text-white text-xl font-bold">
                  Saat Seçin — <span className="text-[#ad3114]">{selectedDate}</span>
                </h2>
              </div>

              {slotsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#ad3114] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(({ time, available }) => (
                    <button
                      key={time}
                      disabled={!available}
                      onClick={() => available && handleTimeSelect(time)}
                      className={`py-3 rounded text-sm font-bold tracking-wide transition-colors ${
                        selectedTime === time ? 'bg-[#ad3114] text-white' :
                        available ? 'bg-[#2a2a2a] text-white hover:bg-[#ad3114]/30 border border-white/10' :
                        'bg-[#1a1a1a] text-[#333] cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {time}
                      {!available && <span className="block text-xs font-normal opacity-60">Dolu</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Kişi sayısı */}
          {step === 3 && (
            <div className="bg-[#1e1e1e] border border-white/8 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(2)} className="text-[#808080] hover:text-white"><ChevronLeft size={18} /></button>
                <h2 className="text-white text-xl font-bold">Kaç Kişisiniz?</h2>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setGuestCount(n)}
                    className={`w-14 h-14 rounded text-base font-bold transition-colors ${
                      guestCount === n ? 'bg-[#ad3114] text-white' : 'bg-[#2a2a2a] text-white border border-white/10 hover:border-[#ad3114]/50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGuestConfirm}
                className="bg-[#ad3114] text-white px-8 py-3 rounded font-bold tracking-widest uppercase text-sm hover:bg-[#8a2710] transition-colors"
              >
                Devam Et
              </button>
            </div>
          )}

          {/* Step 4: Bilgiler */}
          {step === 4 && (
            <div className="bg-[#1e1e1e] border border-white/8 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep(3)} className="text-[#808080] hover:text-white"><ChevronLeft size={18} /></button>
                <h2 className="text-white text-xl font-bold">İletişim Bilgileri</h2>
              </div>

              {/* Summary */}
              <div className="bg-[#111] rounded p-4 mb-6 text-sm space-y-1 border border-[#ad3114]/20">
                <div className="flex justify-between"><span className="text-[#808080]">Tarih</span><span className="text-white">{selectedDate}</span></div>
                <div className="flex justify-between"><span className="text-[#808080]">Saat</span><span className="text-white">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-[#808080]">Kişi Sayısı</span><span className="text-white">{guestCount} kişi</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#a0a0a0] uppercase tracking-wider mb-1.5">Ad Soyad *</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Adınız Soyadınız"
                    required
                    className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#ad3114] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#a0a0a0] uppercase tracking-wider mb-1.5">Telefon *</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="+90 5xx xxx xx xx"
                    required
                    className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#ad3114] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#a0a0a0] uppercase tracking-wider mb-1.5">E-posta</label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    placeholder="ornek@email.com"
                    className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#ad3114] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#a0a0a0] uppercase tracking-wider mb-1.5">Notlar</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Özel istekleriniz, doğum günü, allerji vb."
                    rows={3}
                    className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#ad3114] text-sm resize-none"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#ad3114] text-white py-4 rounded font-bold tracking-widest uppercase text-sm hover:bg-[#8a2710] transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Gönderiliyor...' : 'Rezervasyon Yap'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
