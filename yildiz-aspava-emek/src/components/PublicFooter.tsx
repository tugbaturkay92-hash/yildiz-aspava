import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t-4 border-[#ad3114] text-white/40 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="text-white text-2xl font-bold tracking-wider uppercase mb-4">
              Yıldız Aspava <span className="text-[#C59D5F] text-base font-normal">Emek</span>
            </div>
            <p className="text-sm leading-relaxed">
              1978'den beri Ankara'nın lezzet mirası. Meşe odununda meşhur Ankara döneri, geleneksel kebaplar ve 9 çeşit ikram ritüeli.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b border-[#ad3114]/30">
              İletişim & Konum
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-start">
                <MapPin size={16} className="text-[#C59D5F] mt-0.5 shrink-0" />
                Emek Mah. Bişkek Cad. No: 64 B, Çankaya / Ankara
              </li>
              <li className="flex gap-2 items-center">
                <Phone size={16} className="text-[#C59D5F] shrink-0" />
                <a href="tel:05521193095" className="hover:text-white transition-colors">0552 119 30 95</a>
              </li>
              <li className="flex gap-2 items-center">
                <Clock size={16} className="text-[#C59D5F] shrink-0" />
                Her gün 11:00 – 22:00
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b border-[#ad3114]/30">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/menu" className="hover:text-[#C59D5F] transition-colors">Dijital Menü</Link></li>
              <li><Link href="/rezervasyon" className="hover:text-[#C59D5F] transition-colors">Masa Rezervasyonu</Link></li>
              <li><Link href="/rezervasyon/sorgula" className="hover:text-[#C59D5F] transition-colors">Rezervasyon Sorgula</Link></li>
              <li><Link href="/admin" className="hover:text-[#C59D5F] transition-colors">Yönetici Girişi</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} Yıldız Aspava Emek. Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
