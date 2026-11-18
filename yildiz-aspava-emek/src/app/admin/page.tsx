export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { RESTAURANT_SLUG } from '@/lib/constants';
import { format, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReservationStatusBadge from '@/components/ReservationStatusBadge';
import Link from 'next/link';
import { buildWhatsAppUrl, buildWhatsAppAppUrl, buildWhatsAppWebUrl, getConfirmationMessage } from '@/lib/whatsapp';

async function getStats() {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
  if (!restaurant) return null;

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [todayReservations, pendingCount, todayGuestsAgg] = await Promise.all([
    prisma.reservation.findMany({
      where: { restaurantId: restaurant.id, date: { gte: todayStart, lte: todayEnd }, status: { notIn: ['cancelled'] } },
      include: { table: true },
      orderBy: { date: 'asc' },
    }),
    prisma.reservation.count({
      where: { restaurantId: restaurant.id, status: 'pending' },
    }),
    prisma.reservation.aggregate({
      where: { restaurantId: restaurant.id, date: { gte: todayStart, lte: todayEnd }, status: { notIn: ['cancelled'] } },
      _sum: { guestCount: true },
    }),
  ]);

  return { restaurant, todayReservations, pendingCount, todayGuests: todayGuestsAgg._sum.guestCount || 0 };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  if (!stats) return <div className="p-8 text-red-400">Restoran bulunamadı.</div>;

  const { restaurant, todayReservations, pendingCount, todayGuests } = stats;
  const today = format(new Date(), 'dd MMMM yyyy, EEEE', { locale: tr });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="text-gray-400 text-sm capitalize">{today}</div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Bugünün Rezervasyonları</div>
          <div className="text-white text-4xl font-bold">{todayReservations.length}</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Bekleyen Onay</div>
          <div className="text-[#ad3114] text-4xl font-bold">{pendingCount}</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Bugünün Misafirleri</div>
          <div className="text-white text-4xl font-bold">{todayGuests}</div>
        </div>
      </div>

      {/* Today's reservations */}
      <div className="bg-[#1e293b] rounded-lg border border-white/5">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-white font-semibold">Bugünkü Rezervasyonlar</h2>
          <Link href="/admin/rezervasyonlar" className="text-[#ad3114] text-sm hover:underline">
            Tümünü Gör →
          </Link>
        </div>

        {todayReservations.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-500">Bugün rezervasyon yok.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Müşteri', 'Saat', 'Kişi', 'Masa', 'Durum', 'İşlemler'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {todayReservations.map((r) => {
                  const waUrl = buildWhatsAppWebUrl(r.customerPhone, getConfirmationMessage({
                    customerName: r.customerName,
                    restaurantName: restaurant.name,
                    date: format(new Date(r.date), 'dd MMMM yyyy', { locale: tr }),
                    time: format(new Date(r.date), 'HH:mm'),
                    guests: r.guestCount,
                    code: r.confirmationCode,
                  }));
                  return (
                    <tr key={r.id} className="hover:bg-white/2">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{r.customerName}</div>
                        <div className="text-gray-500 text-xs">{r.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-white">{format(new Date(r.date), 'HH:mm')}</td>
                      <td className="px-6 py-4 text-white">{r.guestCount}</td>
                      <td className="px-6 py-4 text-gray-400">{r.table?.name || '—'}</td>
                      <td className="px-6 py-4"><ReservationStatusBadge status={r.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/rezervasyonlar/${r.id}`} className="text-[#ad3114] text-xs hover:underline font-semibold">
                            Detay
                          </Link>
                          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-[#25d366] text-xs hover:underline font-semibold">
                            WA
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
