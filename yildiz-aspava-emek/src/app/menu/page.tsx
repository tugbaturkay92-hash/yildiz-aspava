'use client';

import { useEffect, useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { formatPrice } from '@/lib/utils';
import { Star, X } from 'lucide-react';

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

  useEffect(() => {
    fetch('/api/menu/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#111111] pt-20 pb-16">
        {/* Header */}
        <div className="bg-[#0d0d0d] border-b-4 border-[#ad3114] py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <p className="text-[#C59D5F] text-xs font-bold tracking-[0.3em] uppercase mb-2">Yıldız Aspava Emek</p>
            <h1 className="text-3xl font-extrabold text-white">Dijital Menümüz</h1>
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
                  className={`whitespace-nowrap px-5 py-2 rounded text-sm font-bold tracking-wide uppercase transition-colors shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-[#ad3114] text-white'
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
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-[#1e1e1e] border border-white/8 rounded p-5 text-left hover:border-[#ad3114]/60 hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm group-hover:text-[#ad3114] transition-colors">
                            {item.name}
                          </span>
                          {item.isPopular && (
                            <Star size={12} className="text-[#ad3114] shrink-0 fill-[#ad3114]" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[#606060] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      <span className="text-[#ad3114] font-bold text-sm shrink-0">{formatPrice(item.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Item detail modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#1e1e1e] border border-white/10 rounded-lg p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white text-xl font-bold">{selectedItem.name}</h3>
                {selectedItem.isPopular && (
                  <span className="inline-flex items-center gap-1 text-[#ad3114] text-xs font-bold mt-1">
                    <Star size={11} fill="currentColor" /> Popüler
                  </span>
                )}
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-[#606060] hover:text-white ml-4">
                <X size={20} />
              </button>
            </div>
            {selectedItem.description && (
              <p className="text-[#808080] text-sm leading-relaxed mb-6">{selectedItem.description}</p>
            )}
            <div className="text-[#ad3114] text-2xl font-extrabold">{formatPrice(selectedItem.price)}</div>
          </div>
        </div>
      )}

      <PublicFooter />
    </>
  );
}
