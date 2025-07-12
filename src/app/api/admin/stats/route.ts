import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Token kontrolü
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // İstatistikleri getir
    const [blogPosts, galleryImages, contactMessages, unreadMessages] = await Promise.all([
      prisma.blogPost.count(),
      prisma.galleryImage.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } })
    ])

    return NextResponse.json({
      blogPosts,
      galleryImages,
      contactMessages,
      unreadMessages
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 