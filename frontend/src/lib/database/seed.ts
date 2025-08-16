// src/lib/database/seed.ts - Database seeding script
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Starting database seeding...')

    // Clear existing data if --force flag is provided
    const forceMode = process.argv.includes('--force')
    
    if (forceMode) {
      console.log('🗑️ Force mode: Clearing existing data...')
      
      // Clear in reverse order of dependencies
      await prisma.post.deleteMany()
      await prisma.user.deleteMany()
      await prisma.nozzle.deleteMany()
      await prisma.systemCache.deleteMany()
      
      console.log('✅ Existing data cleared')
    }

    // Seed Users
    console.log('👤 Seeding users...')
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'admin@fuelstation.com' },
        update: {},
        create: {
          email: 'admin@fuelstation.com',
          name: 'System Administrator',
        },
      }),
      prisma.user.upsert({
        where: { email: 'manager@fuelstation.com' },
        update: {},
        create: {
          email: 'manager@fuelstation.com',
          name: 'Station Manager',
        },
      }),
      prisma.user.upsert({
        where: { email: 'operator@fuelstation.com' },
        update: {},
        create: {
          email: 'operator@fuelstation.com',
          name: 'Station Operator',
        },
      }),
    ])

    console.log(`✅ Created ${users.length} users`)

    // Seed Posts
    console.log('📝 Seeding posts...')
    const posts = await Promise.all([
      prisma.post.upsert({
        where: { id: 1 },
        update: {},
        create: {
          title: 'Welcome to Fuel Station Monitor',
          content: 'This is the initial setup post for the fuel station monitoring system.',
          published: true,
          authorId: users[0].id,
        },
      }),
      prisma.post.upsert({
        where: { id: 2 },
        update: {},
        create: {
          title: 'System Configuration Guide',
          content: 'How to configure your fuel station monitoring system for optimal performance.',
          published: true,
          authorId: users[1].id,
        },
      }),
      prisma.post.upsert({
        where: { id: 3 },
        update: {},
        create: {
          title: 'Daily Operations Manual',
          content: 'Step-by-step guide for daily operations and monitoring procedures.',
          published: false,
          authorId: users[2].id,
        },
      }),
    ])

    console.log(`✅ Created ${posts.length} posts`)

    // Seed Nozzles
    console.log('⛽ Seeding nozzles...')
    const nozzles = await Promise.all([
      prisma.nozzle.upsert({
        where: { name: 'Nozzle-1-Premium' },
        update: {},
        create: {
          name: 'Nozzle-1-Premium',
          sold: 1250.75,
          percentage: 87.5,
          status: true,
        },
      }),
      prisma.nozzle.upsert({
        where: { name: 'Nozzle-2-Regular' },
        update: {},
        create: {
          name: 'Nozzle-2-Regular',
          sold: 2100.50,
          percentage: 92.3,
          status: true,
        },
      }),
      prisma.nozzle.upsert({
        where: { name: 'Nozzle-3-Diesel' },
        update: {},
        create: {
          name: 'Nozzle-3-Diesel',
          sold: 890.25,
          percentage: 78.1,
          status: false,
        },
      }),
      prisma.nozzle.upsert({
        where: { name: 'Nozzle-4-Premium' },
        update: {},
        create: {
          name: 'Nozzle-4-Premium',
          sold: 1567.80,
          percentage: 89.7,
          status: true,
        },
      }),
      prisma.nozzle.upsert({
        where: { name: 'Nozzle-5-Regular' },
        update: {},
        create: {
          name: 'Nozzle-5-Regular',
          sold: 1945.60,
          percentage: 95.2,
          status: true,
        },
      }),
      prisma.nozzle.upsert({
        where: { name: 'Nozzle-6-Diesel' },
        update: {},
        create: {
          name: 'Nozzle-6-Diesel',
          sold: 756.40,
          percentage: 68.9,
          status: true,
        },
      }),
    ])

    console.log(`✅ Created ${nozzles.length} nozzles`)

    // Create system cache table entry for external API token (optional)
    console.log('🔧 Seeding system cache...')
    await prisma.systemCache.upsert({
      where: { key: 'system_initialized' },
      update: {},
      create: {
        key: 'system_initialized',
        value: new Date().toISOString(),
        expires_at: null, // Never expires
      },
    })

    console.log('✅ System cache initialized')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`
📊 Summary:
- Users: ${users.length}
- Posts: ${posts.length}  
- Nozzles: ${nozzles.length}
- System entries: 1
`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('🏁 Seeding process finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
