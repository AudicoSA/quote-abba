
'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, MessageCircle, Bot, User, Send, Quote, MessageSquare } from 'lucide-react'
import { aiSalesService } from '@/lib/ai-service'
import { LiveQuoteComponent } from '@/components/quote-builder/live-quote'
import type { QuoteBuilderData, AIConversationEntry, LiveQuote, QuoteUpdate, LiveQuoteItem } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface AIConsultationStepProps {
  data: Partial<QuoteBuilderData>
  onUpdate: (data: Partial<QuoteBuilderData>) => void
  onNext: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function AIConsultationStep({ data, onUpdate, onNext, isLoading, setIsLoading }: AIConsultationStepProps) {
  const [conversation, setConversation] = useState<AIConversationEntry[]>(data.aiConversation || [])
  const [currentMessage, setCurrentMessage] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const [canProceed, setCanProceed] = useState(false)
  const [liveQuote, setLiveQuote] = useState<LiveQuote | null>(data.liveQuote || null)
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [isQuoteUpdating, setIsQuoteUpdating] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    onUpdate({
      aiConversation: conversation,
      liveQuote: liveQuote || undefined
    })
  }, [conversation, liveQuote])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversation])

  // Server-Sent Events for real-time updates
  useEffect(() => {
    if (!hasStarted) return

    const eventSource = new EventSource(`/api/quote-events?sessionId=${sessionId}`)
    
    eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data)
        
        switch (eventData.type) {
          case 'quote_update':
            handleServerQuoteUpdate(eventData.data)
            break
          case 'ai_response':
            handleServerAIResponse(eventData.data)
            break
        }
      } catch (error) {
        console.error('Error parsing SSE event:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error)
    }

    return () => {
      eventSource.close()
    }
  }, [hasStarted, sessionId])

  const handleServerQuoteUpdate = (quoteData: any) => {
    setIsQuoteUpdating(false)
    if (quoteData) {
      setLiveQuote(quoteData)
    }
  }

  const handleServerAIResponse = (responseData: any) => {
    setIsLoading(false)
    // Handle AI response if needed
  }

  const updateLiveQuoteFromAI = (aiResponse: any) => {
    if (aiResponse.shouldUpdateQuote && aiResponse.quoteUpdates) {
      setIsQuoteUpdating(true)
      
      const currentItems = liveQuote?.items || []
      let newItems: LiveQuoteItem[] = []

      switch (aiResponse.quoteUpdates.action) {
        case 'add':
          newItems = [...currentItems, ...aiResponse.quoteUpdates.items.map((item: any) => ({
            ...item,
            isNew: true
          }))]
          break
        case 'replace':
          newItems = aiResponse.quoteUpdates.items.map((item: any) => ({
            ...item,
            isNew: true
          }))
          break
        case 'update':
          newItems = currentItems.map(existing => {
            const update = aiResponse.quoteUpdates.items.find((item: any) => item.equipmentId === existing.equipmentId)
            return update ? { ...existing, ...update, isUpdated: true } : existing
          })
          break
        case 'remove':
          const removeIds = aiResponse.quoteUpdates.items.map((item: any) => item.equipmentId)
          newItems = currentItems.filter(item => !removeIds.includes(item.equipmentId))
          break
      }

      const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0)
      const tax = subtotal * 0.08 // 8% tax estimate
      const total = subtotal + tax

      const updatedQuote: LiveQuote = {
        items: newItems,
        subtotal,
        tax,
        total,
        lastUpdated: new Date(),
        isUpdating: false
      }

      setLiveQuote(updatedQuote)
      
      // Broadcast update via SSE
      fetch('/api/quote-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          event: {
            type: 'quote_update',
            data: updatedQuote
          }
        })
      }).catch(console.error)
      
      setTimeout(() => setIsQuoteUpdating(false), 1000)
    }
  }

  const handleQuoteUpdate = (update: QuoteUpdate) => {
    if (!liveQuote) return
    
    setIsQuoteUpdating(true)
    
    let newItems = [...liveQuote.items]
    
    switch (update.action) {
      case 'add':
        newItems.push(...update.items)
        break
      case 'remove':
        const removeIds = update.items.map(item => item.equipmentId)
        newItems = newItems.filter(item => !removeIds.includes(item.equipmentId))
        break
      case 'update':
        newItems = newItems.map(existing => {
          const updateItem = update.items.find(item => item.equipmentId === existing.equipmentId)
          return updateItem ? { ...existing, ...updateItem, isUpdated: true } : existing
        })
        break
    }
    
    const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const tax = subtotal * 0.08
    const total = subtotal + tax
    
    const updatedQuote: LiveQuote = {
      items: newItems,
      subtotal,
      tax,
      total,
      lastUpdated: new Date(),
      isUpdating: false
    }
    
    setLiveQuote(updatedQuote)
    setTimeout(() => setIsQuoteUpdating(false), 500)
  }

  const startConsultation = async () => {
    if (!data.usageDetails?.usageType) return

    setIsLoading(true)
    setHasStarted(true)

    try {
      const response = await aiSalesService.startSalesConsultation({
        usageType: data.usageDetails.usageType,
        spaceSize: '',
        budget: data.usageDetails.budget,
        previousConversation: conversation,
        currentQuote: liveQuote ? {
          items: liveQuote.items.map(item => ({
            equipmentId: item.equipmentId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          })),
          subtotal: liveQuote.subtotal,
          total: liveQuote.total
        } : undefined
      })

      const newEntry: AIConversationEntry = {
        type: 'question',
        content: response.content,
        timestamp: new Date(),
        metadata: response
      }

      setConversation(prev => [...prev, newEntry])
      updateLiveQuoteFromAI(response)

      if (response.recommendations && response.recommendations.length > 0) {
        setCanProceed(true)
        onUpdate({
          aiRecommendations: response.recommendations
        })
      }

    } catch (error) {
      console.error('Failed to start consultation:', error)
      const errorEntry: AIConversationEntry = {
        type: 'question',
        content: "I apologize, but I'm having trouble connecting right now. Let me ask you a few questions to better understand your audio needs: What is the primary purpose of your audio system? Will it be used mainly for background music, announcements, presentations, or entertainment?",
        timestamp: new Date(),
      }
      setConversation(prev => [...prev, errorEntry])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userEntry: AIConversationEntry = {
      type: 'answer',
      content: currentMessage,
      timestamp: new Date(),
    }

    setConversation(prev => [...prev, userEntry])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await aiSalesService.startSalesConsultation({
        usageType: data.usageDetails?.usageType || '',
        spaceSize: '',
        budget: data.usageDetails?.budget,
        previousConversation: [...conversation, userEntry],
        currentQuote: liveQuote ? {
          items: liveQuote.items.map(item => ({
            equipmentId: item.equipmentId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          })),
          subtotal: liveQuote.subtotal,
          total: liveQuote.total
        } : undefined
      })

      const aiEntry: AIConversationEntry = {
        type: response.conversationType,
        content: response.content,
        timestamp: new Date(),
        metadata: response
      }

      setConversation(prev => [...prev, aiEntry])
      updateLiveQuoteFromAI(response)

      if (response.recommendations && response.recommendations.length > 0) {
        setCanProceed(true)
        onUpdate({
          aiRecommendations: response.recommendations
        })
      }

    } catch (error) {
      console.error('Failed to send message:', error)
      const errorEntry: AIConversationEntry = {
        type: 'question',
        content: "I apologize for the interruption. Could you tell me more about your specific audio requirements?",
        timestamp: new Date(),
      }
      setConversation(prev => [...prev, errorEntry])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          AI Audio Consultation & Live Quote
        </h3>
        <p className="text-slate-300">
          Chat with Mark on the left and watch your personalized quote build in real-time on the right.
        </p>
      </div>

      {!hasStarted ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <Bot className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-4">
              Ready to chat with Mark about your audio needs?
            </h4>
            <p className="text-slate-300 mb-6">
              Mark will ask you about your space and recommend equipment while building your live quote automatically.
            </p>
            <Button
              onClick={startConsultation}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting to Mark...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chat & Live Quote
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile: Tabs Layout */}
          <div className="block lg:hidden">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat with Mark
                </TabsTrigger>
                <TabsTrigger value="quote" className="flex items-center gap-2">
                  <Quote className="h-4 w-4" />
                  Live Quote {liveQuote && `($${liveQuote.total.toLocaleString()})`}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="mt-4">
                {/* Chat Interface */}
                <div className="space-y-4">
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <ScrollArea className="h-96" ref={scrollAreaRef}>
                        <div className="space-y-4 pr-4">
                          {conversation.map((entry, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className={`flex gap-3 ${
                                entry.type === 'answer' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              {entry.type !== 'answer' && (
                                <div className="flex-shrink-0">
                                  <Bot className="h-8 w-8 text-blue-400 bg-blue-400/20 rounded-full p-1" />
                                </div>
                              )}
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  entry.type === 'answer'
                                    ? 'bg-blue-600 text-white ml-auto'
                                    : 'bg-slate-700 text-slate-100'
                                }`}
                              >
                                <p className="text-sm">{entry.content}</p>
                                {entry.metadata?.purchaseBenefits && (
                                  <div className="mt-3 pt-3 border-t border-slate-600">
                                    <p className="text-xs font-medium mb-2">Benefits of ownership:</p>
                                    <ul className="text-xs space-y-1">
                                      {entry.metadata.purchaseBenefits.map((benefit: string, i: number) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="text-green-400">•</span>
                                          {benefit}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              {entry.type === 'answer' && (
                                <div className="flex-shrink-0">
                                  <User className="h-8 w-8 text-slate-400 bg-slate-400/20 rounded-full p-1" />
                                </div>
                              )}
                            </motion.div>
                          ))}
                          {isLoading && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex gap-3 justify-start"
                            >
                              <Bot className="h-8 w-8 text-blue-400 bg-blue-400/20 rounded-full p-1" />
                              <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm">Mark is thinking...</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response..."
                      disabled={isLoading}
                      className="flex-1 bg-slate-800 border-slate-700 text-white"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !currentMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="quote" className="mt-4">
                <LiveQuoteComponent
                  quote={liveQuote}
                  onQuoteUpdate={handleQuoteUpdate}
                  isUpdating={isQuoteUpdating}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop: Split Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Left: Chat Interface */}
            <div className="space-y-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <ScrollArea className="h-96" ref={scrollAreaRef}>
                    <div className="space-y-4 pr-4">
                      <AnimatePresence initial={false}>
                        {conversation.map((entry, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`flex gap-3 ${
                              entry.type === 'answer' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {entry.type !== 'answer' && (
                              <div className="flex-shrink-0">
                                <Bot className="h-8 w-8 text-blue-400 bg-blue-400/20 rounded-full p-1" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                entry.type === 'answer'
                                  ? 'bg-blue-600 text-white ml-auto'
                                  : 'bg-slate-700 text-slate-100'
                              }`}
                            >
                              <p className="text-sm">{entry.content}</p>
                              {entry.metadata?.purchaseBenefits && (
                                <div className="mt-3 pt-3 border-t border-slate-600">
                                  <p className="text-xs font-medium mb-2">Benefits of ownership:</p>
                                  <ul className="text-xs space-y-1">
                                    {entry.metadata.purchaseBenefits.map((benefit: string, i: number) => (
                                      <li key={i} className="flex items-start gap-1">
                                        <span className="text-green-400">•</span>
                                        {benefit}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            {entry.type === 'answer' && (
                              <div className="flex-shrink-0">
                                <User className="h-8 w-8 text-slate-400 bg-slate-400/20 rounded-full p-1" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                        {isLoading && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex gap-3 justify-start"
                          >
                            <Bot className="h-8 w-8 text-blue-400 bg-blue-400/20 rounded-full p-1" />
                            <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm">Mark is analyzing and updating your quote...</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  disabled={isLoading}
                  className="flex-1 bg-slate-800 border-slate-700 text-white"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right: Live Quote */}
            <div>
              <LiveQuoteComponent
                quote={liveQuote}
                onQuoteUpdate={handleQuoteUpdate}
                isUpdating={isQuoteUpdating}
              />
            </div>
          </div>

          {canProceed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/20 border border-green-400/30 rounded-lg p-4"
            >
              <p className="text-green-400 text-sm font-medium mb-2">
                ✓ Consultation Complete
              </p>
              <p className="text-slate-300 text-sm">
                Great! Mark has provided personalized recommendations and built your quote. Review the equipment and proceed when ready.
              </p>
            </motion.div>
          )}
        </>
      )}

      <div className="flex justify-end pt-6">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-blue-600 hover:bg-blue-700 px-8 disabled:opacity-50"
        >
          Continue to Equipment Selection
        </Button>
      </div>
    </div>
  )
}
