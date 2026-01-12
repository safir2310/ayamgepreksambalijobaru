import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      email: 'admin@ayamgeprek.com',
      phone: '085260812758',
      role: 'ADMIN',
      points: 0,
    },
  })
  console.log('Created/Updated admin user:', admin.username)

  // Create test user
  const userPassword = await hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: userPassword,
      email: 'user@test.com',
      phone: '081234567890',
      role: 'USER',
      points: 100,
    },
  })
  console.log('Created/Updated test user:', user.username)

  // Delete existing data first
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})

  // Create products
  const products = [
    {
      name: 'Ayam Geprek Sambal Ijo',
      description: 'Ayam goreng crispy dengan sambal ijo pedas yang menggugah selera',
      price: 15000,
      discountPrice: null,
      category: 'MAKANAN',
      image: null,
      isPromotion: true,
      isNew: false,
    },
    {
      name: 'Ayam Geprek Sambal Merah',
      description: 'Ayam goreng crispy dengan sambal merah yang pedas gurih',
      price: 15000,
      discountPrice: null,
      category: 'MAKANAN',
      image: null,
      isPromotion: true,
      isNew: false,
    },
    {
      name: 'Ayam Bakar',
      description: 'Ayam bakar dengan bumbu rempah khas',
      price: 18000,
      discountPrice: null,
      category: 'MAKANAN',
      image: null,
      isPromotion: false,
      isNew: true,
    },
    {
      name: 'Nasi Putih',
      description: 'Nasi putih pulen',
      price: 3000,
      discountPrice: null,
      category: 'MAKANAN',
      image: null,
      isPromotion: false,
      isNew: false,
    },
    {
      name: 'Es Teh Manis',
      description: 'Es teh manis segar',
      price: 3000,
      discountPrice: 2000,
      category: 'MINUMAN',
      image: null,
      isPromotion: true,
      isNew: false,
    },
    {
      name: 'Es Jeruk',
      description: 'Es jeruk peras segar',
      price: 4000,
      discountPrice: null,
      category: 'MINUMAN',
      image: null,
      isPromotion: false,
      isNew: true,
    },
    {
      name: 'Teh Hangat',
      description: 'Teh hangat menenangkan',
      price: 2000,
      discountPrice: null,
      category: 'MINUMAN',
      image: null,
      isPromotion: false,
      isNew: false,
    },
    {
      name: 'Paket Hemat 1',
      description: 'Ayam Geprek + Nasi + Es Teh',
      price: 20000,
      discountPrice: 18000,
      category: 'MAKANAN',
      image: null,
      isPromotion: true,
      isNew: false,
    },
    {
      name: 'Paket Hemat 2',
      description: 'Ayam Bakar + Nasi + Es Jeruk',
      price: 23000,
      discountPrice: 20000,
      category: 'MAKANAN',
      image: null,
      isPromotion: true,
      isNew: true,
    },
    {
      name: 'Tahu Crispy',
      description: 'Tahu goreng crispy gurih',
      price: 5000,
      discountPrice: null,
      category: 'MAKANAN',
      image: null,
      isPromotion: false,
      isNew: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
    console.log('Created product:', product.name)
  }

  // Create store profile
  const storeProfile = await prisma.storeProfile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'AYAM GEPREK SAMBAL IJO',
      slogan: 'Pedasnya Bikin Nagih!',
      address: 'Jl. Medan – Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151',
      phone: '085260812758',
      instagram: '@ayamgepreksambalijo',
      facebook: 'AyamGeprekSambalIjo',
    },
  })
  console.log('Created/Updated store profile')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
