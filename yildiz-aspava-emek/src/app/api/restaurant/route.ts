import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RESTAURANT_SLUG } from '@/lib/constants';

export async function GET() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: RESTAURANT_SLUG },
  });
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(restaurant);
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}
