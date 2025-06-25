
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  CreditCard, 
  FileText, 
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react'
import { WARRANTY_PERIODS, DELIVERY_OPTIONS, PAYMENT_TERMS, INSTALLATION_TYPES } from '@/lib/constants'
import type { QuoteBuilderData } from '@/lib/types'

interface PurchaseReviewStepProps {
  data: Partial<QuoteBuilderData>
  onUpdate: (data: Partial<QuoteBuilderData>) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function PurchaseReviewStep({ data, onUpdate, isLoading, setIsLoading }: PurchaseReviewStepProps) {
  const [purchasePrefs, setPurchasePrefs] = useState({
    warrantyPeriod: data.purchasePrefs?.warrantyPeriod || 12,
    deliveryOption: data.purchasePrefs?.deliveryOption || 'standard',
    paymentTerms: data.purchasePrefs?.paymentTerms || 'full_upfront',
    installationServices: data.purchasePrefs?.installationServices || false,
  })

  const [quoteGenerated, setQuoteGenerated] = useState(false)
  const [quoteData, setQuoteData] = useState<any>(null)

  useEffect(() => {
    onUpdate({
      purchasePrefs: purchasePrefs
    })
  }, [purchasePrefs])

  const calculateTotals = () => {
    const equipmentTotal = (data.selectedEquipment || []).reduce((total, item) => {
      return total + (item.customPrice || 0) * item.quantity
    }, 0)

    const selectedDelivery = DELIVERY_OPTIONS.find(d => d.value === purchasePrefs.deliveryOption)
    const deliveryCost = selectedDelivery?.cost || 0

    const selectedPayment = PAYMENT_TERMS.find(p => p.value === purchasePrefs.paymentTerms)
    const discount = (selectedPayment?.discount || 0) * equipmentTotal

    const subtotal = equipmentTotal + deliveryCost - discount
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax

    return {
      equipmentTotal,
      deliveryCost,
      discount,
      subtotal,
      tax,
      total
    }
  }

  const generateQuote = async () => {
    setIsLoading(true)
    
    try {
      // Simulate quote generation API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const totals = calculateTotals()
      const quoteNumber = `APS-${Date.now().toString().slice(-6)}`
      
      const quote = {
        quoteNumber,
        client: data.clientInfo,
        usageType: data.usageDetails?.usageType,
        spaceSize: data.usageDetails?.spaceSize,
        items: data.selectedEquipment || [],
        ...totals,
        warrantyPeriod: purchasePrefs.warrantyPeriod,
        deliveryOption: purchasePrefs.deliveryOption,
        paymentTerms: purchasePrefs.paymentTerms,
        installationServices: purchasePrefs.installationServices,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        createdAt: new Date(),
      }

      setQuoteData(quote)
      setQuoteGenerated(true)
      
    } catch (error) {
      console.error('Failed to generate quote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totals = calculateTotals()
  const selectedWarranty = WARRANTY_PERIODS.find(w => w.value === purchasePrefs.warrantyPeriod)
  const selectedDelivery = DELIVERY_OPTIONS.find(d => d.value === purchasePrefs.deliveryOption)
  const selectedPayment = PAYMENT_TERMS.find(p => p.value === purchasePrefs.paymentTerms)

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Purchase Review & Quote Generation
        </h3>
        <p className="text-slate-300">
          Review your equipment selection and configure purchase options to generate your quote.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Purchase Configuration */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-blue-400" />
                Warranty Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={purchasePrefs.warrantyPeriod.toString()} 
                onValueChange={(value) => setPurchasePrefs(prev => ({ ...prev, warrantyPeriod: parseInt(value) }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WARRANTY_PERIODS.map((period) => (
                    <SelectItem key={period.value} value={period.value.toString()}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Truck className="h-5 w-5 text-blue-400" />
                Delivery & Installation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={purchasePrefs.deliveryOption} 
                onValueChange={(value) => setPurchasePrefs(prev => ({ ...prev, deliveryOption: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{option.label}</span>
                        {option.cost > 0 && (
                          <span className="text-slate-400 ml-2">+${option.cost}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5 text-blue-400" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={purchasePrefs.paymentTerms} 
                onValueChange={(value) => setPurchasePrefs(prev => ({ ...prev, paymentTerms: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS.map((term) => (
                    <SelectItem key={term.value} value={term.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{term.label}</span>
                        {term.discount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {(term.discount * 100).toFixed(0)}% off
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5 text-blue-400" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Equipment Items */}
              <div className="space-y-3">
                {(data.selectedEquipment || []).map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Equipment Item {index + 1}</p>
                      <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                      {item.installationZone && (
                        <p className="text-slate-400 text-xs">Zone: {item.installationZone}</p>
                      )}
                    </div>
                    <p className="text-white font-medium">
                      ${((item.customPrice || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-600" />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Equipment Total</span>
                  <span>${totals.equipmentTotal.toLocaleString()}</span>
                </div>
                
                {totals.deliveryCost > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Delivery</span>
                    <span>${totals.deliveryCost.toLocaleString()}</span>
                  </div>
                )}
                
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Payment Discount</span>
                    <span>-${totals.discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-slate-300">
                  <span>Tax (8%)</span>
                  <span>${totals.tax.toLocaleString()}</span>
                </div>
                
                <Separator className="bg-slate-600" />
                
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>${totals.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Purchase Benefits */}
              <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mt-4">
                <h4 className="text-blue-400 font-medium mb-2">Your Purchase Includes:</h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    {selectedWarranty?.label} warranty coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Free technical support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Installation guides and documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    45-day quote validity
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {!quoteGenerated ? (
            <Button
              onClick={generateQuote}
              disabled={isLoading || !data.selectedEquipment?.length}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating Quote...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Purchase Quote
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400 font-medium mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Quote Generated Successfully!
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Quote #{quoteData?.quoteNumber} has been created and is valid until{' '}
                  {quoteData?.validUntil?.toLocaleDateString()}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900">
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Purchase Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
