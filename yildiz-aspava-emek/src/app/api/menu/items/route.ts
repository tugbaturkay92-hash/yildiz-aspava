import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const item = await prisma.menuItem.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Oluşturulamadı' }, { status: 500 });
  }
}
