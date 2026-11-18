import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import { formatPrice } from '@/lib/utils';
import { Star } from 'lucide-react';

interface Props {
  params: Promise<{ tableId: string }>;
}

export default async function QRPage({ params }: Props) {
  const { tableId } = await params;

  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: { restaurant: true },
  });

  if (!table) notFound();

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: table.restaurantId, isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return (
    <>
      <PublicHeader />

      <main className="min-h-screen bg-[#111111] pt-16 pb-16">
        {/* Table banner */}
        <div className="bg-[#ad3114] py-6 px-6 text-center">
          <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{table.restaurant.name}</div>
          <div className="text-white text-2xl font-extrabold">{table.name}</div>
        </div>

        <div className="max-w-3xl mx-auto px-6 mt-8 space-y-10">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h2 className="text-[#ad3114] text-xs font-bold tracking-[0.3em] uppercase mb-4 border-b border-white/10 pb-2">
                {cat.name}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 bg-[#1e1e1e] rounded p-4 border border-white/8">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">{item.name}</span>
                        {item.isPopular && <Star size={11} className="text-[#ad3114] fill-[#ad3114] shrink-0" />}
                      </div>
                      {item.description && (
                        <p className="text-[#606060] text-xs mt-0.5 leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    <span className="text-[#ad3114] font-bold text-sm shrink-0">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
