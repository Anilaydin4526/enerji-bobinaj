// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req, { params }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(image);
} 