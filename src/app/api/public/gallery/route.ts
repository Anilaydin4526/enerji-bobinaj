import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gallery = await prisma.galleryImage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Galeri yüklenirken hata oluştu' }, { status: 500 });
  }
} 