const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function hashPassword(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  return hash
}

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword('admin123')
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        email: 'admin@enerjibobinaj.com'
      }
    })
    
    console.log('Admin kullanıcısı oluşturuldu:', admin.username)
    console.log('Kullanıcı adı: admin')
    console.log('Şifre: admin123')
  } catch (error) {
    console.error('Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin() 