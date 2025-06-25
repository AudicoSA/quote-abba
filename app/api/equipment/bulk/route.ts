
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { equipmentIds } = await request.json()

    if (!Array.isArray(equipmentIds) || equipmentIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Equipment IDs array is required' },
        { status: 400 }
      )
    }

    const equipment = await prisma.equipment.findMany({
      where: {
        id: { in: equipmentIds }
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      success: true,
      data: equipment
    })

  } catch (error) {
    console.error('Bulk equipment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment details' },
      { status: 500 }
    )
  }
}
