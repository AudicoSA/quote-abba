
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const equipment = await prisma.equipment.update({
      where: { id: params.id },
      data: {
        ...data,
        updatedAt: new Date()
      }
      // Removed category include
    })

    return NextResponse.json({
      success: true,
      data: equipment
    })

  } catch (error) {
    console.error('Update equipment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update equipment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if equipment is used in any quotes
    const quoteItemCount = await prisma.quoteItem.count({
      where: { equipmentId: params.id }
    })

    if (quoteItemCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete equipment that is used in existing quotes. Consider marking it as unavailable instead.' 
        },
        { status: 400 }
      )
    }

    await prisma.equipment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Equipment deleted successfully'
    })

  } catch (error) {
    console.error('Delete equipment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete equipment' },
      { status: 500 }
    )
  }
}
