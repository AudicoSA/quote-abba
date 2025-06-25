
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ShoppingCart, 
  TrendingUp, 
  Zap, 
  Plus, 
  Minus, 
  DollarSign,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react'
import { LiveQuote, LiveQuoteItem, QuoteUpdate } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'

interface LiveQuoteProps {
  quote: LiveQuote | null
  onQuoteUpdate?: (update: QuoteUpdate) => void
  isUpdating?: boolean
  className?: string
}

export function LiveQuoteComponent({ quote, onQuoteUpdate, isUpdating, className }: LiveQuoteProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const [recentlyUpdated, setRecentlyUpdated] = useState<string[]>([])

  useEffect(() => {
    if (quote?.lastUpdated) {
      setAnimationKey(prev => prev + 1)
      
      // Track recently updated items
      const newItems = quote.items.filter(item => item.isNew || item.isUpdated).map(item => item.equipmentId)
      setRecentlyUpdated(newItems)
      
      // Clear the indicators after 3 seconds
      setTimeout(() => {
        setRecentlyUpdated([])
      }, 3000)
    }
  }, [quote?.lastUpdated])

  const updateQuantity = (equipmentId: string, change: number) => {
    if (!quote || !onQuoteUpdate) return

    const item = quote.items.find(i => i.equipmentId === equipmentId)
    if (!item) return

    const newQuantity = Math.max(0, item.quantity + change)
    
    if (newQuantity === 0) {
      // Remove item
      onQuoteUpdate({
        action: 'remove',
        items: [item],
        explanation: `Removed ${item.name} from quote`
      })
    } else {
      // Update quantity
      const updatedItem: LiveQuoteItem = {
        ...item,
        quantity: newQuantity,
        totalPrice: item.unitPrice * newQuantity,
        isUpdated: true
      }
      
      onQuoteUpdate({
        action: 'update',
        items: [updatedItem],
        explanation: `Updated quantity of ${item.name} to ${newQuantity}`
      })
    }
  }

  if (!quote || quote.items.length === 0) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <ShoppingCart className="h-5 w-5 text-blue-400" />
            Live Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">
              Your quote will appear here as Mark makes recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <ShoppingCart className="h-5 w-5 text-blue-400" />
          Live Quote
          {isUpdating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-4 w-4 text-yellow-400" />
            </motion.div>
          )}
        </CardTitle>
        <p className="text-xs text-slate-400">
          Last updated: {quote.lastUpdated.toLocaleTimeString()}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ScrollArea className="h-80">
          <AnimatePresence mode="popLayout">
            {quote.items.map((item, index) => (
              <motion.div
                key={`${item.equipmentId}-${animationKey}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  backgroundColor: recentlyUpdated.includes(item.equipmentId) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-4 p-3 rounded-lg border border-slate-700 relative overflow-hidden"
              >
                {/* New/Updated indicator */}
                {(item.isNew || item.isUpdated) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute top-2 right-2"
                  >
                    <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                      {item.isNew ? 'NEW' : 'UPDATED'}
                    </Badge>
                  </motion.div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-16">
                    <h4 className="font-medium text-white text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.category}</p>
                    {item.reasoning && (
                      <p className="text-xs text-blue-300 mt-1 italic">
                        "{item.reasoning}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0 border-slate-600 hover:bg-slate-700"
                      onClick={() => updateQuantity(item.equipmentId, -1)}
                      disabled={isUpdating}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-white font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 w-6 p-0 border-slate-600 hover:bg-slate-700"
                      onClick={() => updateQuantity(item.equipmentId, 1)}
                      disabled={isUpdating}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      ${item.unitPrice.toLocaleString()} each
                    </p>
                    <motion.p 
                      key={item.totalPrice}
                      initial={{ scale: 1.1, color: '#60a5fa' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="font-semibold text-white"
                    >
                      ${item.totalPrice.toLocaleString()}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        <Separator className="bg-slate-700" />

        {/* Quote Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Subtotal</span>
            <motion.span 
              key={quote.subtotal}
              initial={{ scale: 1.1, color: '#60a5fa' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-white font-medium"
            >
              ${quote.subtotal.toLocaleString()}
            </motion.span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Tax (Est.)</span>
            <motion.span 
              key={quote.tax}
              initial={{ scale: 1.1, color: '#60a5fa' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-white font-medium"
            >
              ${quote.tax.toLocaleString()}
            </motion.span>
          </div>
          
          <Separator className="bg-slate-700" />
          
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold">Total</span>
            <motion.div
              key={quote.total}
              initial={{ scale: 1.2, color: '#10b981' }}
              animate={{ scale: 1, color: '#10b981' }}
              className="flex items-center gap-1"
            >
              <DollarSign className="h-4 w-4" />
              <span className="text-xl font-bold">
                {quote.total.toLocaleString()}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Value Indicators */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="text-center p-2 rounded bg-slate-700/50">
            <TrendingUp className="h-4 w-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-slate-300">Professional Grade</p>
          </div>
          <div className="text-center p-2 rounded bg-slate-700/50">
            <Zap className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-xs text-slate-300">Instant Setup</p>
          </div>
        </div>

        {/* Quote Status */}
        <div className="flex items-center gap-2 p-2 rounded bg-green-900/20 border border-green-400/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <p className="text-xs text-green-300">
            Quote updates automatically as you chat with Mark
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
