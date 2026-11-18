'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, UtensilsCrossed, QrCode } from 'lucide-react';
import QRCodeModal from '@/components/QRCodeModal';

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-[#111111]/95 backdrop-blur border-b border-[#ad3114]/25">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-wider uppercase">
            <UtensilsCrossed className="text-[#C59D5F]" size={22} />
            <span>Yıldız Aspava <span className="text-[#C59D5F] text-sm font-normal">Emek</span></span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-[#808080]">
            <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
            <li><Link href="/menu" className="hover:text-white transition-colors">Menü</Link></li>
            <li>
              <button
                onClick={() => setShowQRModal(true)}
                className="hover:text-[#C59D5F] transition-colors flex items-center gap-1.5 uppercase font-semibold"
              >
                <QrCode size={14} className="text-[#C59D5F]" />
                QR Menü
              </button>
            </li>
            <li><Link href="/rezervasyon" className="hover:text-white transition-colors">Rezervasyon</Link></li>
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setShowQRModal(true)}
              className="border border-[#C59D5F]/40 text-[#C59D5F] px-4 py-2 rounded text-xs font-bold tracking-widest uppercase hover:bg-[#C59D5F] hover:text-[#111] transition-all flex items-center gap-1.5"
            >
              <QrCode size={14} />
              QR Kod
            </button>
            <Link
              href="/rezervasyon"
              className="bg-[#ad3114] text-white px-5 py-2 rounded text-xs font-bold tracking-widest uppercase hover:bg-[#8a2710] transition-colors shadow-md shadow-[#ad3114]/30"
            >
              Rezervasyon
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1a1a1a] border-t border-[#ad3114]/20 px-6 py-4 flex flex-col gap-4 text-sm font-semibold text-[#808080] uppercase tracking-widest">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-white">Ana Sayfa</Link>
            <Link href="/menu" onClick={() => setMenuOpen(false)} className="hover:text-white">Menü</Link>
            <button
              onClick={() => { setMenuOpen(false); setShowQRModal(true); }}
              className="text-left hover:text-[#C59D5F] flex items-center gap-2 uppercase"
            >
              <QrCode size={16} className="text-[#C59D5F]" />
              QR Menü Kodu
            </button>
            <Link href="/rezervasyon" onClick={() => setMenuOpen(false)} className="hover:text-white">Rezervasyon</Link>
          </div>
        )}
      </nav>

      {/* QR Code Modal accessible from any page via header */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Yıldız Aspava QR Menü"
        subtitle="Masanızda otururken telefonunuzun kamerasıyla bu QR kodu okutarak menümüzü hemen cep telefonunuzda açın."
      />
    </>
  );
}
