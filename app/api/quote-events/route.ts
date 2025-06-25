
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

interface QuoteEvent {
  type: 'quote_update' | 'ai_response' | 'connection' | 'error'
  data: any
  timestamp: number
}

// In a real application, you'd use Redis or another pub/sub system
// For now, we'll use a simple in-memory event emitter
class QuoteEventManager {
  private clients = new Map<string, ReadableStreamDefaultController<any>>()
  
  addClient(sessionId: string, controller: ReadableStreamDefaultController<any>) {
    this.clients.set(sessionId, controller)
    
    // Send initial connection event
    this.sendToClient(sessionId, {
      type: 'connection',
      data: { status: 'connected', sessionId },
      timestamp: Date.now()
    })
  }
  
  removeClient(sessionId: string) {
    this.clients.delete(sessionId)
  }
  
  sendToClient(sessionId: string, event: QuoteEvent) {
    const controller = this.clients.get(sessionId)
    if (controller) {
      try {
        const eventData = `data: ${JSON.stringify(event)}\n\n`
        controller.enqueue(new TextEncoder().encode(eventData))
      } catch (error) {
        console.error('Error sending event to client:', error)
        this.clients.delete(sessionId)
      }
    }
  }
  
  broadcastQuoteUpdate(sessionId: string, quoteData: any) {
    this.sendToClient(sessionId, {
      type: 'quote_update',
      data: quoteData,
      timestamp: Date.now()
    })
  }
  
  broadcastAIResponse(sessionId: string, response: any) {
    this.sendToClient(sessionId, {
      type: 'ai_response',
      data: response,
      timestamp: Date.now()
    })
  }
}

const eventManager = new QuoteEventManager()

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId') || `session_${Date.now()}`
  
  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Set up SSE headers
      eventManager.addClient(sessionId, controller)
      
      // Keep connection alive with periodic heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'))
        } catch (error) {
          clearInterval(heartbeat)
          eventManager.removeClient(sessionId)
        }
      }, 30000) // Every 30 seconds
      
      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat)
        eventManager.removeClient(sessionId)
        try {
          controller.close()
        } catch (error) {
          // Controller might already be closed
        }
      })
    },
    
    cancel() {
      eventManager.removeClient(sessionId)
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, event } = await request.json()
    
    if (!sessionId || !event) {
      return Response.json({ error: 'Missing sessionId or event data' }, { status: 400 })
    }
    
    // Broadcast the event to the specific session
    switch (event.type) {
      case 'quote_update':
        eventManager.broadcastQuoteUpdate(sessionId, event.data)
        break
      case 'ai_response':
        eventManager.broadcastAIResponse(sessionId, event.data)
        break
      default:
        eventManager.sendToClient(sessionId, {
          type: event.type,
          data: event.data,
          timestamp: Date.now()
        })
    }
    
    return Response.json({ success: true })
  } catch (error) {
    console.error('Error handling SSE event:', error)
    return Response.json({ error: 'Failed to process event' }, { status: 500 })
  }
}
