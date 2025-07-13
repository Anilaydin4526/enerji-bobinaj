import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.siteSettings.findMany();
  return NextResponse.json(settings);
} 