import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Tüm sliderları listele
export async function GET() {
  const sliders = await prisma.slider.findMany({
    orderBy: { order: 'asc' }
  });
  return NextResponse.json(sliders);
}

// POST: Yeni slider ekle
export async function POST(req: NextRequest) {
  const data = await req.json();
  const slider = await prisma.slider.create({ data });
  return NextResponse.json(slider);
}

// PATCH: Slider güncelle (id ve data body'de)
export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  const slider = await prisma.slider.update({
    where: { id },
    data
  });
  return NextResponse.json(slider);
}

// DELETE: Slider sil (id body'de)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.slider.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 