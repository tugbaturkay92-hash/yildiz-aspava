import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { table: true },
  });
  if (!reservation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(reservation);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const reservation = await prisma.reservation.update({
      where: { id },
      data,
      include: { table: true },
    });
    return NextResponse.json(reservation);
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.reservation.update({ where: { id }, data: { status: 'cancelled' } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'İptal edilemedi' }, { status: 500 });
  }
}
