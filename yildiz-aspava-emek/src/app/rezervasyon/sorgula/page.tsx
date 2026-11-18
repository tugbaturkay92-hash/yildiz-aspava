'use client';

import { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import ReservationStatusBadge from '@/components/ReservationStatusBadge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Search } from 'lucide-react';

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  date: string;
  confirmationCode: string;
  status: string;
  notes: string | null;
  table: { name: string } | null;
}

export default function SorgulaPage() {
  const [code, setCode] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setReservation(null);
    try {
      const res = await fetch(`/api/reservations/check?code=${code.trim().toUpperCase()}`);
      if (!res.ok) {
        setError('Rezervasyon bulunamadı. Kodu kontrol ediniz.');
        return;
      }
      const data = await res.json();
      setReservation(data);
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#111111] pt-20 pb-16">
        <div className="bg-[#0d0d0d] border-b-4 border-[#ad3114] py-10">
          <div className="max-w-xl mx-auto px-6">
            <p className="text-[#C59D5F] text-xs font-bold tracking-[0.3em] uppercase mb-2">Yıldız Aspava Emek</p>
            <h1 className="text-3xl font-extrabold text-white">Rezervasyon Sorgula</h1>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-6 mt-10">
          <div className="bg-[#1e1e1e] border border-white/8 rounded-lg p-8">
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Onay kodunuzu girin (örn: RZ4K8M)"
                maxLength={6}
                className="flex-1 bg-[#111] border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#ad3114] text-sm font-mono tracking-widest uppercase"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ad3114] text-white px-5 py-3 rounded font-bold hover:bg-[#8a2710] transition-colors disabled:opacity-60"
              >
                <Search size={18} />
              </button>
            </form>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            {reservation && (
              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-white font-bold text-lg">{reservation.customerName}</div>
                    <div className="text-[#ad3114] font-mono font-bold">{reservation.confirmationCode}</div>
                  </div>
                  <ReservationStatusBadge status={reservation.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-[#111] rounded p-3">
                    <div className="text-[#606060] text-xs mb-1">Tarih ve Saat</div>
                    <div className="text-white font-semibold">
                      {format(new Date(reservation.date), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                    </div>
                  </div>
                  <div className="bg-[#111] rounded p-3">
                    <div className="text-[#606060] text-xs mb-1">Kişi Sayısı</div>
                    <div className="text-white font-semibold">{reservation.guestCount} kişi</div>
                  </div>
                  {reservation.table && (
                    <div className="bg-[#111] rounded p-3">
                      <div className="text-[#606060] text-xs mb-1">Masa</div>
                      <div className="text-white font-semibold">{reservation.table.name}</div>
                    </div>
                  )}
                  {reservation.notes && (
                    <div className="bg-[#111] rounded p-3 col-span-2">
                      <div className="text-[#606060] text-xs mb-1">Notlar</div>
                      <div className="text-white text-sm">{reservation.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
