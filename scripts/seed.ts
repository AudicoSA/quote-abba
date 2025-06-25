
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.quoteItem.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.installation.deleteMany()
  await prisma.client.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.category.deleteMany()
  await prisma.contactForm.deleteMany()

  // Create categories
  console.log('📂 Creating equipment categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Speakers',
        description: 'Professional active and passive speakers',
        icon: '🔊'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Microphones',
        description: 'Wireless and wired microphone systems',
        icon: '🎤'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Mixers',
        description: 'Audio mixing consoles and interfaces',
        icon: '🎛️'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Amplifiers',
        description: 'Power amplifiers and signal processors',
        icon: '📻'
      }
    })
  ])

  // Create equipment
  console.log('🎵 Creating sample equipment...')
  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        name: 'QSC K12.2 Active Speaker',
        description: 'Professional 12-inch powered speaker with 2000W peak power',
        basePrice: 899,
        categoryId: categories[0].id,
        brand: 'QSC',
        model: 'K12.2',
        powerRating: 1000,
        frequency: '50Hz - 20kHz',
        weight: 18.6,
        dimensions: '35.6 x 55.9 x 33.5 cm',
        connectivity: ['XLR', '1/4" TRS', 'RCA'],
        availability: true,
        minQuantity: 1,
        maxQuantity: 20
      }
    }),
    prisma.equipment.create({
      data: {
        name: 'Shure SM58 Dynamic Microphone',
        description: 'Industry-standard vocal microphone',
        basePrice: 129,
        categoryId: categories[1].id,
        brand: 'Shure',
        model: 'SM58',
        frequency: '50Hz - 15kHz',
        weight: 0.3,
        dimensions: '16.2 x 5.4 x 5.4 cm',
        connectivity: ['XLR'],
        availability: true,
        minQuantity: 1,
        maxQuantity: 50
      }
    }),
    prisma.equipment.create({
      data: {
        name: 'Yamaha MG16XU Mixer',
        description: '16-channel analog mixer with USB and effects',
        basePrice: 399,
        categoryId: categories[2].id,
        brand: 'Yamaha',
        model: 'MG16XU',
        weight: 4.2,
        dimensions: '50.6 x 13.1 x 44.3 cm',
        connectivity: ['XLR', '1/4" TRS', 'USB'],
        availability: true,
        minQuantity: 1,
        maxQuantity: 5
      }
    }),
    prisma.equipment.create({
      data: {
        name: 'Crown XTi 2002 Amplifier',
        description: 'Professional 2-channel power amplifier',
        basePrice: 549,
        categoryId: categories[3].id,
        brand: 'Crown',
        model: 'XTi 2002',
        powerRating: 800,
        weight: 8.6,
        dimensions: '48.3 x 8.9 x 33.7 cm',
        connectivity: ['XLR', '1/4" TRS'],
        availability: true,
        minQuantity: 1,
        maxQuantity: 10
      }
    })
  ])

  // Create sample clients
  console.log('👥 Creating sample clients...')
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@restaurant.com',
        phone: '+1 (555) 123-4567',
        company: 'Downtown Bistro'
      }
    }),
    prisma.client.create({
      data: {
        name: 'Mike Chen',
        email: 'mike.chen@techcorp.com',
        phone: '+1 (555) 234-5678',
        company: 'Tech Corp Solutions'
      }
    })
  ])

  // Create sample installation
  console.log('🏢 Creating sample installation...')
  const installation = await prisma.installation.create({
    data: {
      usageType: 'restaurant_cafe',
      spaceSize: 'medium',
      spaceDetails: {
        primaryUse: 'background music and announcements',
        ambientNoiseLevel: 'moderate',
        existingAudio: false,
        powerAvailable: true,
        installationComplexity: 'moderate'
      },
      installationReqs: {
        installationType: 'professional',
        timeframe: 'within 2 weeks',
        professionalInstallation: true,
        existingInfrastructure: false
      }
    }
  })

  // Create sample quote
  console.log('📋 Creating sample quote...')
  const quote = await prisma.quote.create({
    data: {
      quoteNumber: 'APS-001',
      clientId: clients[0].id,
      installationId: installation.id,
      usageType: 'restaurant_cafe',
      spaceSize: 'medium',
      budget: 5000,
      requirements: {
        primaryUse: 'background music',
        zones: ['dining area', 'bar area']
      },
      subtotal: 2397,
      tax: 191.76,
      total: 2588.76,
      warrantyPeriod: 24,
      status: 'draft',
      validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    }
  })

  // Create quote items
  console.log('📦 Creating quote items...')
  await Promise.all([
    prisma.quoteItem.create({
      data: {
        quoteId: quote.id,
        equipmentId: equipment[0].id,
        quantity: 2,
        unitPrice: equipment[0].basePrice,
        totalPrice: equipment[0].basePrice * 2,
        installationZone: 'dining area'
      }
    }),
    prisma.quoteItem.create({
      data: {
        quoteId: quote.id,
        equipmentId: equipment[2].id,
        quantity: 1,
        unitPrice: equipment[2].basePrice,
        totalPrice: equipment[2].basePrice * 1,
        installationZone: 'bar area'
      }
    })
  ])

  // Create sample contact forms
  console.log('📬 Creating sample contact forms...')
  await Promise.all([
    prisma.contactForm.create({
      data: {
        name: 'Jennifer Walsh',
        email: 'jennifer.walsh@business.com',
        subject: 'Audio System for New Office',
        message: 'We need a complete audio system for our new office space. Can you help us with recommendations?',
        formType: 'quote_request'
      }
    }),
    prisma.contactForm.create({
      data: {
        name: 'David Park',
        email: 'david.park@gym.com',
        subject: 'Gym Audio Installation',
        message: 'Looking for a high-energy sound system for our fitness center.',
        formType: 'quote_request'
      }
    })
  ])

  console.log('✅ Database seeding completed successfully!')
  console.log(`Created ${categories.length} categories`)
  console.log(`Created ${equipment.length} equipment items`)
  console.log(`Created ${clients.length} clients`)
  console.log(`Created 1 installation`)
  console.log(`Created 1 quote with 2 items`)
  console.log(`Created 2 contact forms`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
