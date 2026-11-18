'use client';

import { useEffect, useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import QRCodeModal from '@/components/QRCodeModal';
import { formatPrice } from '@/lib/utils';
import { Star, X, QrCode, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isPopular: boolean;
  isAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrThumbnail, setQrThumbnail] = useState<string>('');

  useEffect(() => {
    fetch('/api/menu/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].id);
      })
      .finally(() => setLoading(false));

    // Generate menu QR code thumbnail
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/menu`;
      QRCode.toDataURL(url, { width: 140, margin: 1 })
        .then((uri) => setQrThumbnail(uri))
        .catch(() => {});
    }
  }, []);

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#111111] pt-16 pb-16">
        {/* Header */}
        <div className="bg-[#0d0d0d] border-b-4 border-[#ad3114] py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#C59D5F] text-xs font-bold tracking-[0.25em] uppercase mb-1">
                <Sparkles size={13} /> Yıldız Aspava Emek
              </div>
              <h1 className="text-3xl font-extrabold text-white">Dijital Menümüz</h1>
              <p className="text-xs text-[#C4B9AA] mt-1">Meşe odununda pişen Ankara döneri, kebaplar & 9 çeşit meşhur ikram ritüeli</p>
            </div>

            {/* QR Quick Bar */}
            <div className="flex items-center gap-4 bg-[#16120F] border border-[#C59D5F]/40 p-3.5 rounded-xl shadow-lg">
              {qrThumbnail ? (
                <img
                  src={qrThumbnail}
                  alt="QR Kod"
                  className="w-16 h-16 bg-white p-1 rounded-lg border-2 border-[#C59D5F] cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowQRModal(true)}
                  title="Büyütmek için tıklayın"
                />
              ) : (
                <div className="w-16 h-16 bg-white/10 rounded-lg animate-pulse" />
              )}
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <QrCode size={14} className="text-[#C59D5F]" /> Masa QR Kodu
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">Telefon kamerasıyla okutun</div>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="text-xs text-[#C59D5F] font-bold hover:underline mt-1 block"
                >
                  Kodu Büyüt & Yazdır →
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-[#ad3114] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 lg:px-16 mt-8">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-[#ad3114] text-white shadow-md shadow-[#ad3114]/30'
                      : 'bg-[#1e1e1e] text-[#808080] hover:text-white border border-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Items grid */}
            {currentCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCategory.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 hover:border-[#ad3114]/50 transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-white font-bold text-sm group-hover:text-[#C59D5F] transition-colors">{item.name}</span>
                        {item.isPopular && (
                          <span className="inline-flex items-center gap-1 bg-[#ad3114]/20 text-[#ad3114] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#ad3114]/30 shrink-0">
                            <Star size={9} className="fill-[#ad3114]" /> Meşhur
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[#C59D5F] font-extrabold text-base">{formatPrice(item.price)}</span>
                      <span className="text-[11px] text-gray-500 group-hover:text-white transition-colors">Detay →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#1a1a1a] border border-[#ad3114]/30 rounded-xl p-6 text-white">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
            {selectedItem.description && (
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{selectedItem.description}</p>
            )}
            <div className="text-[#C59D5F] text-xl font-extrabold mb-4">{formatPrice(selectedItem.price)}</div>
            <div className="text-xs text-gray-400 border-t border-white/10 pt-3">
              ✨ 9 çeşit ücretsiz ikramımızla birlikte servis edilir.
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Yıldız Aspava QR Menü"
        subtitle="Masanızda otururken telefonunuzun kamerasıyla bu kodu okutun, menü doğrudan telefonunuzda açılsın."
      />

      <PublicFooter />
    </>
  );
}
