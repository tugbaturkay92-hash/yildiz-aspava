'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReservationStatusBadge from '@/components/ReservationStatusBadge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { RESERVATION_STATUSES } from '@/lib/constants';
import { buildWhatsAppUrl, buildWhatsAppAppUrl, buildWhatsAppWebUrl, getConfirmationMessage } from '@/lib/whatsapp';

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  date: string;
  status: string;
  confirmationCode: string;
  table: { name: string } | null;
}

const statusTabs = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Bekliyor' },
  { key: 'confirmed', label: 'Onaylı' },
  { key: 'completed', label: 'Tamamlandı' },
  { key: 'cancelled', label: 'İptal' },
];

export default function RezervastonlarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeStatus !== 'all') params.set('status', activeStatus);
    if (dateFilter) params.set('date', dateFilter);
    const res = await fetch(`/api/reservations?${params}`);
    const data = await res.json();
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus, dateFilter]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">Rezervasyonlar</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-[#1e293b] border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#ad3114]"
        />
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wide transition-colors ${
              activeStatus === tab.key ? 'bg-[#ad3114] text-white' : 'bg-[#1e293b] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#1e293b] rounded-lg border border-white/5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#ad3114] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Rezervasyon bulunamadı.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Kod', 'Müşteri', 'Telefon', 'Tarih/Saat', 'Kişi', 'Masa', 'Durum', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-white/2">
                    <td className="px-6 py-4 font-mono text-[#ad3114] font-bold">{r.confirmationCode}</td>
                    <td className="px-6 py-4 text-white font-medium whitespace-nowrap">{r.customerName}</td>
                    <td className="px-6 py-4 text-gray-400">{r.customerPhone}</td>
                    <td className="px-6 py-4 text-white whitespace-nowrap">
                      {format(new Date(r.date), 'dd MMM, HH:mm', { locale: tr })}
                    </td>
                    <td className="px-6 py-4 text-white">{r.guestCount}</td>
                    <td className="px-6 py-4 text-gray-400">{r.table?.name || '—'}</td>
                    <td className="px-6 py-4"><ReservationStatusBadge status={r.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/rezervasyonlar/${r.id}`} className="text-[#ad3114] text-xs hover:underline font-semibold">
                          Detay
                        </Link>
                        <a
                          href={buildWhatsAppWebUrl(r.customerPhone, getConfirmationMessage({
                            customerName: r.customerName,
                            restaurantName: 'Yıldız Aspava Emek',
                            date: format(new Date(r.date), 'dd MMMM yyyy', { locale: tr }),
                            time: format(new Date(r.date), 'HH:mm'),
                            guests: r.guestCount,
                            code: r.confirmationCode,
                          }))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25d366]/20 text-[#25d366] hover:bg-[#25d366] hover:text-white px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>WA Onay</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
