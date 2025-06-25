
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get basic stats
    const [totalQuotes, totalClients, recentQuotes] = await Promise.all([
      prisma.quote.count(),
      prisma.client.count(),
      prisma.quote.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true
        }
      })
    ])

    // Calculate total revenue
    const totalRevenue = await prisma.quote.aggregate({
      _sum: {
        total: true
      },
      where: {
        status: 'accepted'
      }
    })

    // Get popular equipment (most used in quotes)
    const popularEquipmentData = await prisma.quoteItem.groupBy({
      by: ['equipmentId'],
      _count: {
        equipmentId: true
      },
      orderBy: {
        _count: {
          equipmentId: 'desc'
        }
      },
      take: 10
    })

    // Get equipment details for popular items
    const popularEquipment = await Promise.all(
      popularEquipmentData.map(async (item) => {
        const equipment = await prisma.equipment.findUnique({
          where: { id: item.equipmentId },
          include: {
            category: true
          }
        })
        return equipment ? {
          ...equipment,
          usageCount: item._count.equipmentId
        } : null
      })
    )

    const stats = {
      totalQuotes,
      totalClients,
      totalRevenue: totalRevenue._sum.total || 0,
      recentQuotes,
      popularEquipment: popularEquipment.filter(Boolean)
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
