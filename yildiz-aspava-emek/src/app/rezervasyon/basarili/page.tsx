import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { CheckCircle } from 'lucide-react';
import { getConfirmationMessage } from '@/lib/whatsapp';
import WhatsAppShareBox from '@/components/WhatsAppShareBox';

interface Props {
  searchParams: Promise<{ code?: string; date?: string; time?: string; guests?: string; name?: string }>;
}

export default async function BasariliPage({ searchParams }: Props) {
  const { code, date, time, guests, name } = await searchParams;

  const waMessage = code && date && time && guests
    ? getConfirmationMessage({
        customerName: name ? decodeURIComponent(name) : 'Değerli Misafirimiz',
        restaurantName: 'Yıldız Aspava Emek',
        date: date,
        time: time,
        guests: Number(guests),
        code: code,
      })
    : '';

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#111111] pt-20 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-[#1e1e1e] border border-white/8 rounded-lg p-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-green-400" size={64} />
          </div>

          <h1 className="text-white text-2xl font-extrabold mb-2">Rezervasyonunuz Alındı!</h1>
          <p className="text-[#808080] text-sm mb-8">
            Kısa süre içinde onay için iletişime geçeceğiz.
          </p>

          {code && (
            <div className="bg-[#111] border border-[#ad3114]/30 rounded p-6 mb-8">
              <div className="text-[#808080] text-xs font-bold uppercase tracking-wider mb-2">Onay Kodunuz</div>
              <div className="text-[#ad3114] text-4xl font-extrabold tracking-widest font-mono">{code}</div>
              <p className="text-[#606060] text-xs mt-2">Bu kodu saklayın — rezervasyonunuzu sorgulamak için gerekli.</p>
            </div>
          )}

          {date && time && guests && (
            <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
              <div className="bg-[#111] rounded p-3">
                <div className="text-[#606060] text-xs mb-1">Tarih</div>
                <div className="text-white font-semibold">{date}</div>
              </div>
              <div className="bg-[#111] rounded p-3">
                <div className="text-[#606060] text-xs mb-1">Saat</div>
                <div className="text-white font-semibold">{time}</div>
              </div>
              <div className="bg-[#111] rounded p-3">
                <div className="text-[#606060] text-xs mb-1">Kişi</div>
                <div className="text-white font-semibold">{guests}</div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {waMessage && (
              <WhatsAppShareBox phone="+905521193095" message={waMessage} />
            )}
            <Link
              href="/rezervasyon/sorgula"
              className="w-full border border-white/10 text-[#a0a0a0] py-3 rounded font-semibold text-sm text-center hover:text-white hover:border-white/30 transition-colors mt-2"
            >
              Rezervasyonumu Sorgula
            </Link>
            <Link
              href="/"
              className="w-full text-[#606060] py-2 text-sm text-center hover:text-white transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
