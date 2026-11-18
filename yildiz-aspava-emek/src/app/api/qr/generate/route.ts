import { NextRequest, NextResponse } from 'next/server';
import { generateQRCode } from '@/lib/qr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tableId = searchParams.get('tableId');

  if (!tableId) return NextResponse.json({ error: 'tableId gerekli' }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const dataUrl = await generateQRCode(tableId, baseUrl);

  return NextResponse.json({ dataUrl });
}
