import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

// Tüm ayarları getir
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const settings = await prisma.siteSettings.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Tek bir ayarı güncelle veya ekle
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { key, value, description } = await request.json();
    if (!key || typeof value !== 'string') {
      return NextResponse.json({ error: 'Eksik veya hatalı veri' }, { status: 400 });
    }
    const updated = await prisma.siteSettings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 