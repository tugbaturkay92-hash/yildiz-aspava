import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RESTAURANT_SLUG } from '@/lib/constants';
import { generateTimeSlots, parseReservationDate } from '@/lib/reservation-utils';
import { addMinutes } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const guests = Number(searchParams.get('guests') || '1');

  if (!date) return NextResponse.json({ error: 'Tarih gerekli' }, { status: 400 });

  const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const allSlots = generateTimeSlots(
    restaurant.openingTime,
    restaurant.closingTime,
    restaurant.slotDuration,
    date
  );

  // Toplam masa kapasitesi
  const tables = await prisma.table.findMany({
    where: { restaurantId: restaurant.id, isActive: true },
  });
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  // Gün içindeki mevcut rezervasyonlar
  const [year, month, day] = date.split('-').map(Number);
  const dayStart = new Date(year, month - 1, day, 0, 0, 0);
  const dayEnd = new Date(year, month - 1, day, 23, 59, 59);

  const existingReservations = await prisma.reservation.findMany({
    where: {
      restaurantId: restaurant.id,
      date: { gte: dayStart, lte: dayEnd },
      status: { notIn: ['cancelled'] },
    },
  });

  const availableSlots = allSlots.map((slot) => {
    const slotStart = parseReservationDate(date, slot);
    const slotEnd = addMinutes(slotStart, restaurant.slotDuration);

    // Bu slotta çakışan rezervasyonların toplam kişi sayısı
    const overlappingGuests = existingReservations.reduce((sum, r) => {
      const rStart = new Date(r.date);
      const rEnd = addMinutes(rStart, r.duration);
      const overlaps = rStart < slotEnd && rEnd > slotStart;
      return overlaps ? sum + r.guestCount : sum;
    }, 0);

    const available = overlappingGuests + guests <= totalCapacity;
    const isPast = slotStart <= new Date();

    return { time: slot, available: available && !isPast };
  });

  return NextResponse.json(availableSlots);
}
