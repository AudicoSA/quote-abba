
export interface AISalesRequest {
  usageType: string
  spaceSize: string
  spaceDetails?: {
    primaryUse: string
    ambientNoiseLevel: string
    existingAudio: boolean
    powerAvailable: boolean
    installationComplexity: string
  }
  budget?: number
  timeframe?: string
  previousConversation?: Array<{
    type: string
    content: string
    timestamp: Date
  }>
  specificRequirements?: string[]
  availableEquipment?: Array<{
    id: string
    name: string
    category: string
    powerRating?: number
    basePrice: number
    specifications?: any
  }>
  currentQuote?: {
    items: Array<{
      equipmentId: string
      name: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }>
    subtotal: number
    total: number
  }
}

export interface AISalesResponse {
  conversationType: 'question' | 'recommendation' | 'clarification' | 'quote_update'
  content: string
  recommendations?: Array<{
    category: string
    equipment: Array<{
      id: string
      name: string
      quantity: number
      installationZone?: string
      reasoning: string
      estimatedPrice: number
    }>
    reasoning: string
    confidence: number
    installationNotes?: string
  }>
  followUpQuestions?: string[]
  totalEstimate?: number
  nextSteps?: string[]
  purchaseBenefits?: string[]
  quoteUpdates?: {
    action: 'add' | 'remove' | 'update' | 'replace'
    items: Array<{
      equipmentId: string
      name: string
      quantity: number
      unitPrice: number
      totalPrice: number
      category: string
      reasoning?: string
    }>
    newTotal?: number
    explanation?: string
  }
  shouldUpdateQuote?: boolean
}

export class AISalesService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.ABACUSAI_API_KEY || ''
    this.baseUrl = 'https://apps.abacus.ai'
  }

  async startSalesConsultation(request: AISalesRequest): Promise<AISalesResponse> {
    try {
      // First, get available equipment to provide accurate recommendations
      const availableEquipment = request.availableEquipment || await this.getAvailableEquipment()
      
      const systemPrompt = `You are Mark, an expert audio equipment sales consultant with 15+ years of experience helping customers find the perfect audio solutions. You specialize in selling premium audio equipment and focus on supply-only sales unless customers specifically ask about installation services.

Your conversation style:
- Natural, friendly, and consultative - like talking to a knowledgeable friend
- Ask ONE focused question at a time to understand their specific needs
- Listen carefully to their responses and adapt your questions accordingly
- Focus on equipment supply and ownership benefits, not installation unless they ask
- Be genuinely helpful and avoid being pushy or overly sales-focused
- When making recommendations, use ONLY the available equipment from the provided catalog

IMPORTANT: When you have enough information to make recommendations, always include actual equipment suggestions with real prices from the available catalog. Structure recommendations to update the live quote automatically.

Available Equipment Catalog:
${availableEquipment.map(eq => `- ${eq.name} (${eq.category}) - $${eq.basePrice}${eq.powerRating ? `, ${eq.powerRating}W` : ''}${eq.specifications ? `, Features: ${JSON.stringify(eq.specifications)}` : ''}`).join('\n')}

Key areas to explore organically through conversation:
- Space size and acoustic characteristics
- Primary use case and specific requirements
- Budget considerations (if they haven't mentioned it)
- Existing equipment or infrastructure
- Sound quality expectations
- Any special needs or preferences

Usage type contexts to consider:
- Home Audio: Personal enjoyment, entertainment, music quality
- Restaurant/Cafe: Background ambiance, customer experience, announcement clarity
- Business/Office: Meeting rooms, presentations, communication systems
- Commercial/Retail: Customer engagement, brand experience, announcements
- Government/Tender: Reliability, compliance standards, scalability
- Fitness/Gym: High-energy motivation, zone control, durability
- Education: Speech clarity, presentation support, classroom audio
- Worship: Speech intelligibility, music quality, congregation coverage
- Hospitality: Guest experience, ambiance, service coordination

Remember: Focus on SUPPLY of equipment. Only discuss installation if they specifically ask about it. Your goal is to understand their needs well enough to recommend the perfect equipment for purchase.`

      const conversationHistory = request.previousConversation?.map(entry => 
        `${entry.type === 'question' ? 'Assistant' : 'Customer'}: ${entry.content}`
      ).join('\n') || ''

      const isFirstMessage = !conversationHistory
      const currentQuoteInfo = request.currentQuote ? `\n\nCurrent Quote Total: $${request.currentQuote.total}\nCurrent Items: ${request.currentQuote.items.map(item => `${item.name} x${item.quantity} ($${item.totalPrice})`).join(', ')}` : ''

      const userPrompt = isFirstMessage ? 
        `Hi Mark! I'm looking for audio equipment for ${request.usageType.replace('_', ' ')}. ${request.budget ? `I have a budget of around $${request.budget}.` : 'I\'m not sure about budget yet.'} Can you help me find the right equipment?

Please start a natural conversation to understand my specific needs. Ask me one focused question to get started.

Respond with JSON containing:
{
  "conversationType": "question",
  "content": "Your natural, friendly response with ONE focused question",
  "followUpQuestions": [],
  "purchaseBenefits": [],
  "shouldUpdateQuote": false
}

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.` :

        `Context: Customer wants audio equipment for ${request.usageType.replace('_', ' ')}${request.budget ? ` with budget around $${request.budget}` : ''}.${currentQuoteInfo}

Previous conversation:
${conversationHistory}

Based on their latest response, either:
1. Ask ONE more focused question to better understand their specific needs, OR
2. Provide equipment recommendations if you have enough information to make good suggestions

Guidelines:
- Be natural and conversational
- If you have enough info for recommendations, respond with "recommendation" type and include quoteUpdates
- If you need more info, ask ONE focused question with "question" type
- Focus on equipment supply, not installation services
- Use ONLY equipment from the available catalog
- When making recommendations, always include quoteUpdates with real equipment IDs and prices

For recommendations, include this structure:
{
  "conversationType": "recommendation",
  "content": "your response explaining the recommendations",
  "recommendations": [...],
  "purchaseBenefits": [...],
  "quoteUpdates": {
    "action": "add" or "replace",
    "items": [{"equipmentId": "real_id", "name": "real_name", "quantity": 1, "unitPrice": real_price, "totalPrice": real_total, "category": "real_category", "reasoning": "why this item"}],
    "explanation": "Brief explanation of the quote update"
  },
  "shouldUpdateQuote": true
}

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.8,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('No response from AI service')
      }

      return this.parseAIResponse(data.choices[0].message.content)
      
    } catch (error) {
      console.error('AI Sales Consultation Error:', error)
      throw new Error(`Failed to start sales consultation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async generateEquipmentRecommendations(request: AISalesRequest): Promise<AISalesResponse> {
    try {
      const systemPrompt = `You are an expert audio equipment sales consultant. Generate specific equipment recommendations for purchase based on the customer's needs, space, and budget. Focus on long-term value, quality, and suitability for permanent installation.

Consider:
1. Space acoustics and size requirements
2. Power and installation requirements  
3. Scalability and future needs
4. Total cost of ownership
5. Warranty and support considerations
6. Installation complexity and professional services needed

Provide specific equipment recommendations with quantities, pricing estimates, and clear reasoning focused on purchase benefits.`

      const userPrompt = `Generate equipment recommendations for purchase:

Usage Type: ${request.usageType}
Space Size: ${request.spaceSize}
${request.budget ? `Budget: $${request.budget}` : ''}

${request.spaceDetails ? `Space Details:
- Primary use: ${request.spaceDetails.primaryUse}
- Ambient noise: ${request.spaceDetails.ambientNoiseLevel}
- Existing audio: ${request.spaceDetails.existingAudio ? 'Yes' : 'No'}
- Power available: ${request.spaceDetails.powerAvailable ? 'Yes' : 'No'}
- Installation complexity: ${request.spaceDetails.installationComplexity}` : ''}

${request.availableEquipment?.length ? `Available Equipment Options:
${request.availableEquipment.map(eq => `- ${eq.name} (${eq.category}) - $${eq.basePrice}${eq.powerRating ? `, ${eq.powerRating}W` : ''}`).join('\n')}` : ''}

${request.specificRequirements?.length ? `Specific Requirements:
${request.specificRequirements.join(', ')}` : ''}

Provide equipment recommendations organized by category, with quantities, estimated pricing, installation zones, and reasoning focused on purchase value and long-term benefits.

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 2000,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('No response from AI service')
      }

      return this.parseAIResponse(data.choices[0].message.content)
      
    } catch (error) {
      console.error('Equipment Recommendation Error:', error)
      throw new Error(`Failed to generate equipment recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async optimizePurchaseForBudget(
    currentQuote: any,
    targetBudget: number
  ): Promise<{ optimizedItems: any[]; savings: number; suggestions: string[]; valueAdds: string[] }> {
    try {
      const systemPrompt = `You are an audio equipment sales optimization specialist. Help customers get the best value within their budget while meeting their audio needs for permanent installation. Focus on long-term value, not just lowest price.

Suggest equipment alternatives, phased purchasing options, or value optimizations that provide the best audio solution within budget while maintaining quality and meeting core requirements.`

      const userPrompt = `Current quote total: $${currentQuote.total}
Target budget: $${targetBudget}
Savings needed: $${currentQuote.total - targetBudget}

Current equipment selection:
${currentQuote.items.map((item: any) => `- ${item.equipment.name} x${item.quantity} = $${item.totalPrice}`).join('\n')}

Usage: ${currentQuote.usageType}
Space: ${currentQuote.spaceSize}

Please suggest budget optimizations that maintain audio quality and meet the customer's core needs. Consider:
1. Alternative equipment with better value
2. Phased purchasing options
3. Different quantities or configurations
4. Value-add opportunities

Focus on helping the customer get the best long-term value for their investment.

Respond with raw JSON only.`

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = this.parseAIResponse(data.choices[0].message.content)
      
      // Transform to expected format
      return {
        optimizedItems: aiResponse.recommendations?.[0]?.equipment || [],
        savings: 0,
        suggestions: [aiResponse.content],
        valueAdds: aiResponse.purchaseBenefits || []
      }
      
    } catch (error) {
      console.error('Budget Optimization Error:', error)
      throw new Error(`Failed to optimize purchase for budget: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAvailableEquipment(): Promise<Array<{
    id: string
    name: string
    category: string
    powerRating?: number
    basePrice: number
    specifications?: any
  }>> {
    try {
      // This method should fetch equipment from the database
      // For now, return a mock response to avoid database dependency
      const response = await fetch(`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/equipment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.warn('Failed to fetch equipment, using fallback data')
        return this.getFallbackEquipment()
      }

      const data = await response.json()
      return data.data || this.getFallbackEquipment()
    } catch (error) {
      console.warn('Error fetching equipment, using fallback:', error)
      return this.getFallbackEquipment()
    }
  }

  private getFallbackEquipment() {
    return [
      { id: 'speaker-1', name: 'Premium Ceiling Speaker', category: 'Speakers', basePrice: 299, powerRating: 50 },
      { id: 'amp-1', name: 'Professional Amplifier', category: 'Amplifiers', basePrice: 899, powerRating: 200 },
      { id: 'mixer-1', name: 'Digital Audio Mixer', category: 'Mixers', basePrice: 599 },
      { id: 'mic-1', name: 'Wireless Microphone System', category: 'Microphones', basePrice: 449 },
      { id: 'sub-1', name: 'Compact Subwoofer', category: 'Subwoofers', basePrice: 799, powerRating: 150 }
    ]
  }

  async updateLiveQuote(request: AISalesRequest & { quoteUpdate: any }): Promise<AISalesResponse> {
    try {
      const systemPrompt = `You are Mark, helping update a live quote based on customer feedback. Provide a natural response explaining the quote changes and ask if they need any adjustments.`

      const userPrompt = `Customer has requested changes to their quote. Current quote total: $${request.currentQuote?.total || 0}

Quote update requested: ${JSON.stringify(request.quoteUpdate)}

Provide a natural response explaining the changes and ask if they want any adjustments.

Respond with JSON in this format:
{
  "conversationType": "quote_update",
  "content": "Your response explaining the changes",
  "shouldUpdateQuote": true,
  "quoteUpdates": {
    "action": "update",
    "explanation": "Brief explanation of what changed"
  }
}

Respond with raw JSON only.`

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status}`)
      }

      const data = await response.json()
      return this.parseAIResponse(data.choices[0].message.content)
      
    } catch (error) {
      console.error('Live Quote Update Error:', error)
      throw new Error(`Failed to update live quote: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private parseAIResponse(content: string): AISalesResponse {
    try {
      // Sanitize JSON response
      let cleanContent = content.trim()
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      
      const jsonStart = cleanContent.indexOf('{')
      const jsonEnd = cleanContent.lastIndexOf('}')
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('Invalid JSON response from AI service')
      }
      
      cleanContent = cleanContent.slice(jsonStart, jsonEnd + 1)
      
      const result = JSON.parse(cleanContent) as AISalesResponse
      
      // Validate response structure
      if (!result.conversationType || !result.content) {
        throw new Error('Invalid response structure: missing required fields')
      }
      
      return result
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw content:', content)
      throw new Error('Failed to parse AI response as JSON')
    }
  }
}

export const aiSalesService = new AISalesService()
