import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { MapPin, Phone, Clock, Star, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <PublicHeader />

      {/* Hero */}
      <section className="min-h-screen flex items-center relative bg-[#0d0d0d] overflow-hidden pt-16">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-[#14110E]/80 to-[#9E1B1B]/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">
          <div className="inline-flex items-center gap-2 bg-[#C59D5F]/15 border border-[#C59D5F]/40 px-4 py-1.5 rounded-full text-[#C59D5F] text-xs font-bold tracking-[0.25em] uppercase mb-6">
            <Sparkles size={14} /> 1978'den Beri — Emek, Ankara
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Ankara'nın Lezzet Mirası
            <span className="block text-[#C59D5F]">Yıldız Aspava Emek</span>
          </h1>
          <p className="text-[#C4B9AA] text-lg max-w-2xl mb-10 leading-relaxed font-light">
            Meşe odununda pişen meşhur Ankara yaprak döneri, SSK dürüm, Yıldız Special, taş fırın pideleri ve 9 çeşit zengin ücretsiz ikram ritüelimizle Emek Bişkek Caddesi'nde hizmetinizdeyiz.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/rezervasyon"
              className="bg-[#9E1B1B] text-white px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#7D1515] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#9E1B1B]/30"
            >
              Online Masa Rezervasyonu
            </Link>
            <Link
              href="/menu"
              className="border-2 border-[#C59D5F] text-[#C59D5F] px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#C59D5F] hover:text-[#14110E] transition-all hover:-translate-y-0.5"
            >
              QR Menüyü İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Info bar */}
      <section className="bg-[#16120F] border-y-2 border-[#C59D5F]/40 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 items-start">
            <MapPin className="text-[#C59D5F] shrink-0 mt-0.5" size={24} />
            <div>
              <div className="text-white font-semibold text-sm mb-1">Adresimiz</div>
              <div className="text-[#C4B9AA] text-sm leading-relaxed">Emek Mah. Bişkek Cad. No: 64 B, Çankaya / Ankara</div>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Phone className="text-[#C59D5F] shrink-0 mt-0.5" size={24} />
            <div>
              <div className="text-white font-semibold text-sm mb-1">Rezervasyon & Paket Hattı</div>
              <a href="tel:05521193095" className="text-[#C59D5F] text-lg font-bold hover:opacity-80">
                0552 119 30 95
              </a>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Clock className="text-[#C59D5F] shrink-0 mt-0.5" size={24} />
            <div>
              <div className="text-white font-semibold text-sm mb-1">Çalışma Saatleri</div>
              <div className="text-[#C4B9AA] text-sm">Haftanın 7 Günü: 11:00 – 22:00</div>
            </div>
          </div>
        </div>
      </section>

      {/* İkram Ritüeli Banner */}
      <section className="py-16 bg-[#1A1410] border-b border-[#C59D5F]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
          <span className="text-[#C59D5F] text-xs font-bold uppercase tracking-widest block mb-2">Aspava Geleneği</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">9 Çeşit Ücretsiz İkram Ritüeli</h2>
          <p className="text-[#C4B9AA] max-w-2xl mx-auto text-sm leading-relaxed mb-8">
            Her masa siparişinizde ikramımız: Salata, cacık, patates tava, soslu patlıcan, ezme, çiğ köfte, sıcacık lavaş, irmik helvası ve semaverde demli çay.
          </p>
          <div className="flex justify-center flex-wrap gap-2 text-xs text-[#FAF7F2]">
            {['Meşhur Salata', 'Süzme Cacık', 'Çıtır Patates', 'Soslu Patlıcan', 'Acılı Ezme', 'Çiğ Köfte', 'Sıcak Lavaş', 'İrmik Helvası', 'Semaver Çayı'].map((ikram) => (
              <span key={ikram} className="bg-[#241C16] border border-[#C59D5F]/30 px-3 py-1.5 rounded-full">
                ✓ {ikram}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Hakkımızda */}
      <section className="py-24 bg-[#110E0B]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#C59D5F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Biz Kimiz?</p>
          <h2 className="text-4xl font-extrabold text-white mb-6">1978'den Beri Ankara'nın Lezzet Mirası</h2>
          <p className="text-[#C4B9AA] text-base leading-relaxed mb-4">
            <strong className="text-white">"Allah Sağlık, Para, Afiyet Versin Amin"</strong> temennisiyle kurulan Yıldız Aspava Emek; meşe odunu ateşinde dinlendirilerek pişen gerçek yaprak döneri, ağızda eriyen SSK dürümü ve taş fırından yeni çıkmış çıtır pideleriyle yarım asra yaklaşan bir lezzet durağıdır.
          </p>
          <p className="text-[#C4B9AA] text-base leading-relaxed">
            Emek Bişkek Caddesi'ndeki ferah iç mekânımız, bahçemiz ve terasımızda aileniz ve sevdiklerinizle unutulmaz sofralarda buluşmanız için sizleri bekliyoruz.
          </p>
        </div>
      </section>

      {/* Rezervasyon CTA */}
      <section className="py-20 bg-gradient-to-r from-[#14110E] via-[#2A1610] to-[#14110E] border-y border-[#C59D5F]/40">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Star className="text-[#C59D5F] mx-auto mb-4" size={32} />
          <h2 className="text-3xl font-bold text-white mb-4">Masanızı Şimdiden Ayırtın</h2>
          <p className="text-[#C4B9AA] mb-8 leading-relaxed">
            Hafta içi veya hafta sonu yoğun saatlerde beklemeden yerinizi garantiye alın. Rezervasyonunuz anında onaylanır.
          </p>
          <Link
            href="/rezervasyon"
            className="inline-block bg-[#9E1B1B] text-white px-12 py-4 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#7D1515] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#9E1B1B]/40"
          >
            Masa Rezervasyonu Yap
          </Link>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/905521193095?text=Merhaba%2C%20Y%C4%B1ld%C4%B1z%20Aspava%20Emek%20rezervasyon%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25d366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.849L.057 23.5l5.82-1.526A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.511-5.18-1.402l-.371-.22-3.455.905.923-3.36-.241-.387A9.955 9.955 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
        </svg>
      </a>

      <PublicFooter />
    </>
  );
}
