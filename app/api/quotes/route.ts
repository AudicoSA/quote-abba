
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateQuoteNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Create or find client
    let client = await prisma.client.findUnique({
      where: { email: data.clientInfo.email }
    })

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: data.clientInfo.name,
          email: data.clientInfo.email,
          phone: data.clientInfo.phone,
          company: data.clientInfo.company
        }
      })
    }

    // Create installation record if provided
    let installation = null
    if (data.usageSpec) {
      installation = await prisma.installation.create({
        data: {
          usageType: data.usageDetails.usageType,
          spaceSize: data.usageDetails.spaceSize || 'medium',
          spaceDetails: data.usageSpec.spaceDetails,
          installationReqs: data.installationReqs
        }
      })
    }

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        clientId: client.id,
        installationId: installation?.id,
        usageType: data.usageDetails.usageType,
        spaceSize: data.usageDetails.spaceSize,
        budget: data.usageDetails.budget,
        requirements: data.usageSpec,
        aiConversation: data.aiConversation,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        warrantyPeriod: data.purchasePrefs?.warrantyPeriod,
        deliveryOptions: data.purchasePrefs?.deliveryOption,
        paymentTerms: data.purchasePrefs?.paymentTerms,
        validUntil: data.validUntil,
        notes: data.notes,
        status: 'draft'
      }
    })

    // Create quote items
    const quoteItems = await Promise.all(
      data.selectedEquipment.map(async (item: any) => {
        const equipment = await prisma.equipment.findUnique({
          where: { id: item.equipmentId }
        })

        if (!equipment) {
          throw new Error(`Equipment not found: ${item.equipmentId}`)
        }

        return prisma.quoteItem.create({
          data: {
            quoteId: quote.id,
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            unitPrice: item.customPrice || equipment.basePrice,
            totalPrice: (item.customPrice || equipment.basePrice) * item.quantity,
            installationZone: item.installationZone,
            specifications: item.specifications,
            warrantyInfo: item.warrantyOption ? { period: item.warrantyOption } : undefined
          }
        })
      })
    )

    return NextResponse.json({
      success: true,
      data: { ...quote, items: quoteItems }
    })

  } catch (error) {
    console.error('Create quote API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const whereClause: any = {}
    if (status && status !== 'all') {
      whereClause.status = status
    }
    if (clientId) {
      whereClause.clientId = clientId
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where: whereClause,
        include: {
          client: true,
          installation: true,
          items: {
            include: {
              equipment: {
                include: {
                  category: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quote.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Get quotes API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}
