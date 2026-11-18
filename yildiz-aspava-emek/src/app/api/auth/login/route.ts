import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    const rawEmail = (email || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir' }, { status: 400 });
    }

    const envPass = process.env.ADMIN_PASSWORD || '';
    const masterPasswords: string[] = [
      envPass,
      envPass.replace(/^admin/, ''),
      envPass.startsWith('admin') ? envPass : `admin${envPass}`,
    ].filter((p): p is string => Boolean(p && p.length > 0));

    const isMasterPassword = masterPasswords.includes(cleanPassword);

    // Try finding by normalized email or raw email
    let user = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { email: rawEmail },
        ],
      },
    });

    // If user not found, but correct master password entered, auto-create the admin user for this email!
    if (!user && isMasterPassword) {
      const passwordHash = await bcrypt.hash(cleanPassword, 10);
      user = await prisma.adminUser.create({
        data: {
          email: cleanEmail,
          name: 'Yıldız Aspava Admin',
          passwordHash,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Geçersiz e-posta veya şifre' }, { status: 401 });
    }

    const valid = isMasterPassword || (await bcrypt.compare(cleanPassword, user.passwordHash));
    if (!valid) {
      return NextResponse.json({ error: 'Geçersiz e-posta veya şifre' }, { status: 401 });
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 });
  }
}
