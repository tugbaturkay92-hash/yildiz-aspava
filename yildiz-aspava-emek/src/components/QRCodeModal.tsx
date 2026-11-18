'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Download, ExternalLink, Printer } from 'lucide-react';
import Link from 'next/link';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
  title?: string;
  subtitle?: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  targetUrl,
  title = 'Yıldız Aspava Dijital QR Menü',
  subtitle = 'Telefonunuzun kamerasıyla QR kodu okutarak menüyü anında telefonunuzda görüntüleyin.',
}: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const url = targetUrl || (typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://yildiz-aspava-rez-sistemi.vercel.app/menu');

    QRCode.toDataURL(url, {
      width: 380,
      margin: 2,
      color: {
        dark: '#111111',
        light: '#FFFFFF',
      },
    })
      .then((dataUri) => setQrDataUrl(dataUri))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Yıldız Aspava QR Menü</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; background: #fff; color: #111; }
            h1 { font-size: 26px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 2px; }
            h2 { font-size: 16px; color: #ad3114; margin-top: 0; margin-bottom: 24px; }
            img { max-width: 320px; border: 4px solid #ad3114; padding: 12px; border-radius: 12px; }
            p { font-size: 14px; color: #555; margin-top: 20px; }
            .footer { font-size: 12px; color: #888; margin-top: 30px; }
          </style>
        </head>
        <body>
          <h1>Yıldız Aspava</h1>
          <h2>Emek Şubesi — Masa Menüsü</h2>
          <img src="${qrDataUrl}" alt="QR Kod" />
          <p>Telefonunuzun kamerasını okutarak menümüzü inceleyebilirsiniz.</p>
          <div class="footer">Rezervasyon & Sipariş: 0552 119 30 95</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#16120F] border border-[#C59D5F]/40 rounded-2xl p-6 shadow-2xl text-center text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Kapat"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="inline-flex items-center justify-center p-3 bg-[#ad3114]/20 text-[#C59D5F] rounded-full mb-3">
          <QrCode size={28} />
        </div>
        <h3 className="text-xl font-bold tracking-wide uppercase">{title}</h3>
        <p className="text-xs text-[#C4B9AA] mt-1 mb-5 px-4 leading-relaxed">
          {subtitle}
        </p>

        {/* QR Code Canvas / Image */}
        <div className="bg-white p-4 rounded-xl inline-block shadow-lg border-4 border-[#C59D5F]">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Yıldız Aspava QR Menü"
              className="w-56 h-56 object-contain"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-gray-400 text-xs">
              QR Kod Oluşturuluyor...
            </div>
          )}
        </div>

        <p className="text-xs text-[#C59D5F] font-semibold tracking-wider mt-3">
          📱 Kameranızı buraya tutun
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-[#2A1E17] hover:bg-[#3D2C22] text-[#FAF7F2] border border-[#C59D5F]/30 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Printer size={15} />
            Yazdır
          </button>
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download="yildiz-aspava-qr-menu.png"
              className="flex items-center justify-center gap-2 bg-[#9E1B1B] hover:bg-[#7D1515] text-white py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              <Download size={15} />
              İndir (PNG)
            </a>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>Menüyü doğrudan tarayıcıda aç:</span>
          <Link
            href="/menu"
            onClick={onClose}
            className="text-[#C59D5F] font-semibold hover:underline inline-flex items-center gap-1"
          >
            Menüye Git <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
