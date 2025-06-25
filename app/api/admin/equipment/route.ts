
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const categoryId = searchParams.get('categoryId')

    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filter by category text field instead of categoryId
    if (categoryId) {
      whereClause.category = categoryId
    }

    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where: whereClause,
        // Removed category include and just count quoteItems
        select: {
          id: true,
          name: true,
          description: true,
          specifications: true,
          basePrice: true,
          category: true, // This is now just a text field
          brand: true,
          model: true,
          powerRating: true,
          frequency: true,
          weight: true,
          dimensions: true,
          connectivity: true,
          imageUrl: true,
          availability: true,
          minQuantity: true,
          maxQuantity: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { quoteItems: true }
          }
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.equipment.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: equipment,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Admin equipment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const equipment = await prisma.equipment.create({
      data: {
        name: data.name,
        description: data.description,
        specifications: data.specifications || {},
        basePrice: data.basePrice,
        category: data.category, // Changed from categoryId to category (text field)
        brand: data.brand,
        model: data.model,
        powerRating: data.powerRating,
        frequency: data.frequency,
        weight: data.weight,
        dimensions: data.dimensions,
        connectivity: data.connectivity || [],
        imageUrl: data.imageUrl,
        availability: data.availability ?? true,
        minQuantity: data.minQuantity || 1,
        maxQuantity: data.maxQuantity
      }
      // Removed category include
    })

    return NextResponse.json({
      success: true,
      data: equipment
    })

  } catch (error) {
    console.error('Create equipment API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create equipment' },
      { status: 500 }
    )
  }
}
