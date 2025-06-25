
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['draft', 'sent', 'accepted', 'rejected', 'purchased', 'installed', 'expired']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: { status },
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
      }
    })

    return NextResponse.json({
      success: true,
      data: quote
    })

  } catch (error) {
    console.error('Update quote status API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote status' },
      { status: 500 }
    )
  }
}
