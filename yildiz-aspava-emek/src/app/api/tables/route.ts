import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RESTAURANT_SLUG } from '@/lib/constants';

export async function GET() {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const tables = await prisma.table.findMany({
    where: { restaurantId: restaurant.id, isActive: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(tables);
}

export async function POST(request: NextRequest) {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { name, capacity, location } = await request.json();
    const table = await prisma.table.create({
      data: { restaurantId: restaurant.id, name, capacity: Number(capacity), location },
    });
    return NextResponse.json(table, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Oluşturulamadı' }, { status: 500 });
  }
}
