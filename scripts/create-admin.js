const { PrismaClient } = require('@prisma/client')
const { createHash, randomBytes } = require('crypto')

const prisma = new PrismaClient()

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(password + salt).digest('hex')
  return salt + ':' + hash
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