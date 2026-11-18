import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RESTAURANT_SLUG } from '@/lib/constants';
import { generateConfirmationCode, parseReservationDate } from '@/lib/reservation-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const status = searchParams.get('status');

  const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const where: Record<string, unknown> = { restaurantId: restaurant.id };

  if (date) {
    const [year, month, day] = date.split('-').map(Number);
    where.date = {
      gte: new Date(year, month - 1, day, 0, 0, 0),
      lte: new Date(year, month - 1, day, 23, 59, 59),
    };
  }

  if (status && status !== 'all') {
    where.status = status;
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: { table: true },
    orderBy: { date: 'asc' },
  });

  return NextResponse.json(reservations);
}

export async function POST(request: NextRequest) {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await request.json();
    const { date, time, guestCount, customerName, customerPhone, customerEmail, notes } = body;

    const reservationDate = parseReservationDate(date, time);

    // Benzersiz onay kodu oluştur
    let confirmationCode = generateConfirmationCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.reservation.findUnique({ where: { confirmationCode } });
      if (!existing) break;
      confirmationCode = generateConfirmationCode();
      attempts++;
    }

    const reservation = await prisma.reservation.create({
      data: {
        restaurantId: restaurant.id,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        guestCount: Number(guestCount),
        date: reservationDate,
        duration: restaurant.slotDuration,
        notes: notes || null,
        status: 'pending',
        confirmationCode,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Rezervasyon oluşturulamadı' }, { status: 500 });
  }
}
