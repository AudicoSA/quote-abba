
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
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

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: quote
    })

  } catch (error) {
    console.error('Get quote API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const quote = await prisma.quote.update({
      where: { id: params.id },
      data: {
        status: data.status,
        notes: data.notes,
        ...data
      },
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
    console.error('Update quote API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}
