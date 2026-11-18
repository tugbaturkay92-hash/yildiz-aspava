'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReservationStatusBadge from '@/components/ReservationStatusBadge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  buildWhatsAppUrl,
  buildWhatsAppAppUrl,
  buildWhatsAppWebUrl,
  getConfirmationMessage,
  getReminderMessage,
  getCancellationMessage,
} from '@/lib/whatsapp';
import { ChevronLeft, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  guestCount: number;
  date: string;
  status: string;
  confirmationCode: string;
  notes: string | null;
  table: { name: string } | null;
}

const STATUS_ACTIONS = [
  { status: 'confirmed', label: 'Onayla', color: 'bg-green-600 hover:bg-green-700' },
  { status: 'completed', label: 'Tamamlandı', color: 'bg-blue-600 hover:bg-blue-700' },
  { status: 'no_show', label: 'Gelmedi', color: 'bg-gray-600 hover:bg-gray-700' },
  { status: 'cancelled', label: 'İptal Et', color: 'bg-red-700 hover:bg-red-800' },
];

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/reservations/${id}`)
      .then((r) => r.json())
      .then(setReservation)
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReservation(updated);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#ad3114] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!reservation) return <div className="p-8 text-red-400">Rezervasyon bulunamadı.</div>;

  const dateFormatted = format(new Date(reservation.date), 'dd MMMM yyyy', { locale: tr });
  const timeFormatted = format(new Date(reservation.date), 'HH:mm');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const confirmMsg = getConfirmationMessage({
    customerName: reservation.customerName, restaurantName: 'Yıldız Aspava Emek',
    date: dateFormatted, time: timeFormatted, guests: reservation.guestCount, code: reservation.confirmationCode,
  });
  const reminderMsg = getReminderMessage({
    customerName: reservation.customerName, restaurantName: 'Yıldız Aspava Emek',
    time: timeFormatted, guests: reservation.guestCount, code: reservation.confirmationCode,
  });
  const cancelMsg = getCancellationMessage({
    customerName: reservation.customerName, date: dateFormatted, reservationUrl: `${appUrl}/rezervasyon`,
  });

  const waConfirmApp = buildWhatsAppAppUrl(reservation.customerPhone, confirmMsg);
  const waConfirmWeb = buildWhatsAppWebUrl(reservation.customerPhone, confirmMsg);

  const copyConfirmation = async () => {
    try {
      await navigator.clipboard.writeText(confirmMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = confirmMsg;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/rezervasyonlar" className="text-gray-400 hover:text-white">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-white text-2xl font-bold">Rezervasyon Detayı</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Info card */}
        <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-white text-xl font-bold">{reservation.customerName}</div>
              <div className="text-[#ad3114] font-mono font-bold">{reservation.confirmationCode}</div>
            </div>
            <ReservationStatusBadge status={reservation.status} />
          </div>

          {[
            { label: 'Telefon', value: reservation.customerPhone },
            { label: 'E-posta', value: reservation.customerEmail || '—' },
            { label: 'Tarih', value: dateFormatted },
            { label: 'Saat', value: timeFormatted },
            { label: 'Kişi Sayısı', value: `${reservation.guestCount} kişi` },
            { label: 'Masa', value: reservation.table?.name || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-t border-white/5 pt-3">
              <span className="text-gray-400">{label}</span>
              <span className="text-white font-medium">{value}</span>
            </div>
          ))}

          {reservation.notes && (
            <div className="border-t border-white/5 pt-3">
              <div className="text-gray-400 text-sm mb-1">Notlar</div>
              <div className="text-white text-sm">{reservation.notes}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Durum Güncelle</h3>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_ACTIONS.map(({ status, label, color }) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={reservation.status === status}
                  className={`py-2 rounded text-white text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-40 ${color}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5 space-y-3">
            <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">WhatsApp Onay Bildirimi</h3>
            <p className="text-xs text-gray-400 mb-3">
              Müşteriye ({reservation.customerPhone}) rezervasyon onayını iletin:
            </p>

            {/* 1. WhatsApp Web */}
            <a
              href={waConfirmWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#20ba5a] text-white py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-md shadow-[#25d366]/20"
            >
              <ExternalLink size={15} />
              <span>WhatsApp Web ile Gönder (Önerilen)</span>
            </a>

            {/* 2. Direct App link */}
            <a
              href={waConfirmApp}
              className="flex items-center justify-center gap-2 w-full bg-[#0f172a] hover:bg-[#1e293b] text-[#25d366] border border-[#25d366]/40 py-2 px-3 rounded-lg text-xs font-semibold transition-colors"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Masaüstü Uygulaması ile Aç</span>
            </a>

            {/* 3. Copy text */}
            <button
              type="button"
              onClick={copyConfirmation}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                copied
                  ? 'bg-green-900/40 text-green-300 border-green-500/50'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span>Onay Metni Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Onay Metnini Kopyala</span>
                </>
              )}
            </button>

            <div className="border-t border-white/10 pt-3 mt-3 space-y-1.5">
              <span className="text-[11px] text-gray-400 block font-semibold">Diğer Bildirimler:</span>
              <a
                href={buildWhatsAppAppUrl(reservation.customerPhone, reminderMsg)}
                className="flex items-center gap-2 w-full bg-[#128C7E] hover:bg-[#0f7a6e] text-white py-1.5 px-3 rounded text-xs font-semibold transition-colors"
              >
                <span>🔔</span> Hatırlatma Gönder
              </a>
              <a
                href={buildWhatsAppAppUrl(reservation.customerPhone, cancelMsg)}
                className="flex items-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-white py-1.5 px-3 rounded text-xs font-semibold transition-colors"
              >
                <span>✕</span> İptal Bildirimi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
