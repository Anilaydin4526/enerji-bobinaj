const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
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