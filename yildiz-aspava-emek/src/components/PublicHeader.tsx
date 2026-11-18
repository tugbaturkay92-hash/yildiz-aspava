'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111111]/95 backdrop-blur border-b border-[#ad3114]/25">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg tracking-wider uppercase">
          <UtensilsCrossed className="text-[#C59D5F]" size={22} />
          <span>Yıldız Aspava <span className="text-[#C59D5F] text-sm font-normal">Emek</span></span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 text-xs font-semibold tracking-widest uppercase text-[#808080]">
          <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
          <li><Link href="/menu" className="hover:text-white transition-colors">Menü</Link></li>
          <li><Link href="/rezervasyon" className="hover:text-white transition-colors">Rezervasyon</Link></li>
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/rezervasyon"
            className="bg-[#ad3114] text-white px-5 py-2 rounded text-xs font-bold tracking-widest uppercase hover:bg-[#8a2710] transition-colors"
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
          <Link href="/rezervasyon" onClick={() => setMenuOpen(false)} className="hover:text-white">Rezervasyon</Link>
        </div>
      )}
    </nav>
  );
}
