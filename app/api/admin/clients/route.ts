
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where: whereClause,
        include: {
          quotes: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.client.count({ where: whereClause })
    ])

    // Transform data to include stats
    const clientsWithStats = clients.map(client => ({
      ...client,
      quoteCount: client.quotes.length,
      totalValue: client.quotes
        .filter(quote => quote.status === 'accepted')
        .reduce((sum, quote) => sum + quote.total, 0),
      lastQuoteDate: client.quotes[0]?.createdAt
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: clientsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Admin clients API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
