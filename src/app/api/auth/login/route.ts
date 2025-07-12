import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken, hashPassword } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      )
    }

    // Otomatik admin oluştur (sadece yoksa)
    let admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin && username === 'admin') {
      const hashedPassword = await hashPassword('admin123')
      admin = await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          email: 'admin@enerjibobinaj.com'
        }
      })
    }

    if (!admin) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı veya şifre' },
        { status: 401 }
      )
    }

    const isValidPassword = await comparePassword(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı veya şifre' },
        { status: 401 }
      )
    }

    const token = await generateToken({
      userId: admin.id,
      username: admin.username
    })

    return NextResponse.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 