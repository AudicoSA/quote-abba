
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save contact form submission to database
    const contactForm = await prisma.contactForm.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        formType: data.formType || 'general',
        status: 'new'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contactForm
    })

  } catch (error) {
    console.error('Contact form API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
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
    const formType = searchParams.get('formType')

    const whereClause: any = {}
    if (status && status !== 'all') {
      whereClause.status = status
    }
    if (formType && formType !== 'all') {
      whereClause.formType = formType
    }

    const [forms, total] = await Promise.all([
      prisma.contactForm.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactForm.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: forms,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Get contact forms API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact forms' },
      { status: 500 }
    )
  }
}
