import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const galleryImages = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(galleryImages)
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { title, description, imageUrl, order } = await request.json()

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Başlık ve resim URL gerekli' },
        { status: 400 }
      )
    }

    const galleryImage = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        order: order || 0
      }
    })

    return NextResponse.json(galleryImage)
  } catch (error) {
    console.error('Gallery POST error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 