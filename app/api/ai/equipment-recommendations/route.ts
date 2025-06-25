
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { aiSalesService } from '@/lib/ai-service'
import type { AISalesRequest } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    
    const aiRequest: AISalesRequest = {
      usageType: requestData.usageType,
      spaceSize: requestData.spaceSize,
      budget: requestData.budget,
      timeframe: requestData.timeframe,
      spaceDetails: requestData.usageSpec?.spaceDetails,
      previousConversation: requestData.aiConversation || [],
      specificRequirements: requestData.usageSpec?.requirements || [],
      availableEquipment: requestData.availableEquipment || []
    }

    const recommendations = await aiSalesService.generateEquipmentRecommendations(aiRequest)

    return NextResponse.json({
      success: true,
      data: recommendations
    })

  } catch (error) {
    console.error('AI Equipment Recommendations API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate equipment recommendations' 
      },
      { status: 500 }
    )
  }
}
