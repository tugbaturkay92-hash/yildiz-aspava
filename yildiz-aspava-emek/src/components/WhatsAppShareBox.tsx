'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';

interface Props {
  phone: string;
  message: string;
}

export default function WhatsAppShareBox({ phone, message }: Props) {
  const [copied, setCopied] = useState(false);

  // Clean phone to Turkish format 905xxxxxxxxx
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = '90' + cleanPhone.slice(1);
  } else if (cleanPhone.length === 10) {
    cleanPhone = '90' + cleanPhone;
  }

  const encodedMsg = encodeURIComponent(message);

  // 1. Native app protocol: Opens WhatsApp Windows desktop app or mobile app directly
  const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMsg}`;

  // 2. WhatsApp Web direct link: For browser usage
  const webUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;

  // 3. Fallback universal API
  const universalUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedMsg}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = message;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-2.5 w-full">
      {/* 1. Primary: WhatsApp Web (Doğrudan Tarayıcıda Açılır) */}
      <a
        href={webUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white py-3.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25d366]/25"
      >
        <MessageCircle size={20} />
        <span>WhatsApp Web ile İlet (Tarayıcıda Aç)</span>
      </a>

      {/* 2. Secondary: Native App */}
      <a
        href={appUrl}
        className="w-full bg-[#1e293b] hover:bg-[#24334a] text-[#25d366] border border-[#25d366]/40 py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <ExternalLink size={15} />
        <span>WhatsApp Masaüstü / Telefon Uygulaması ile Aç</span>
      </a>

      {/* 3. Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
          copied
            ? 'bg-green-900/40 text-green-300 border-green-500/50'
            : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
        }`}
      >
        {copied ? (
          <>
            <Check size={15} className="text-green-400" />
            <span>Rezervasyon Metni Kopyalandı! ✓</span>
          </>
        ) : (
          <>
            <Copy size={15} />
            <span>Rezervasyon Onay Metnini Kopyala</span>
          </>
        )}
      </button>

      {/* Notice info */}
      <p className="text-[11px] text-gray-400 leading-tight pt-1">
        💡 Bilgisayarınızda yüklü olan WhatsApp uygulaması ilk butonla doğrudan açılır; tarayıcı / Chrome indirme uyarısı almazsınız.
      </p>
    </div>
  );
}
