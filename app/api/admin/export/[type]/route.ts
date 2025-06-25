
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params

    let csvContent = ''
    let filename = ''

    switch (type) {
      case 'quotes':
        const quotes = await prisma.quote.findMany({
          include: {
            client: true,
            installation: true
          },
          orderBy: { createdAt: 'desc' }
        })

        csvContent = 'Quote Number,Client Name,Client Email,Usage Type,Space Size,Total,Status,Created Date\n'
        quotes.forEach(quote => {
          csvContent += `"${quote.quoteNumber}","${quote.client.name}","${quote.client.email}","${quote.usageType}","${quote.spaceSize || ''}","${quote.total}","${quote.status}","${quote.createdAt.toISOString()}"\n`
        })
        filename = 'quotes-export.csv'
        break

      case 'clients':
        const clients = await prisma.client.findMany({
          include: {
            quotes: true
          },
          orderBy: { createdAt: 'desc' }
        })

        csvContent = 'Name,Email,Phone,Company,Quote Count,Total Value,Created Date\n'
        clients.forEach(client => {
          const totalValue = client.quotes
            .filter(quote => quote.status === 'accepted')
            .reduce((sum, quote) => sum + quote.total, 0)
          
          csvContent += `"${client.name}","${client.email}","${client.phone || ''}","${client.company || ''}","${client.quotes.length}","${totalValue}","${client.createdAt.toISOString()}"\n`
        })
        filename = 'clients-export.csv'
        break

      case 'equipment':
        const equipment = await prisma.equipment.findMany({
          include: {
            category: true,
            _count: {
              select: { quoteItems: true }
            }
          },
          orderBy: { name: 'asc' }
        })

        csvContent = 'Name,Category,Brand,Model,Base Price,Power Rating,Availability,Usage Count,Created Date\n'
        equipment.forEach(item => {
          csvContent += `"${item.name}","${item.category.name}","${item.brand || ''}","${item.model || ''}","${item.basePrice}","${item.powerRating || ''}","${item.availability}","${item._count.quoteItems}","${item.createdAt.toISOString()}"\n`
        })
        filename = 'equipment-export.csv'
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export type' },
          { status: 400 }
        )
    }

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
