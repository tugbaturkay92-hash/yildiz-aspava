import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RESTAURANT_SLUG } from '@/lib/constants';

export async function GET() {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const categories = await prisma.menuCategory.findMany({
    where: { restaurantId: restaurant.id, isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try {
    const restaurant = await prisma.restaurant.findUnique({ where: { slug: RESTAURANT_SLUG } });
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { name } = await request.json();
    const last = await prisma.menuCategory.findFirst({
      where: { restaurantId: restaurant.id },
      orderBy: { sortOrder: 'desc' },
    });
    const category = await prisma.menuCategory.create({
      data: { restaurantId: restaurant.id, name, sortOrder: (last?.sortOrder ?? -1) + 1 },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Oluşturulamadı' }, { status: 500 });
  }
}
