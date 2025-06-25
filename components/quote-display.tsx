
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Mail, 
  Printer, 
  Share2, 
  Calendar,
  MapPin,
  User,
  Building,
  Phone,
  Clock,
  Users,
  FileText,
  DollarSign,
  Shield
} from 'lucide-react'
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils'
import { COMPANY_INFO } from '@/lib/constants'
import type { QuoteWithDetails } from '@/lib/types'

interface QuoteDisplayProps {
  quote: QuoteWithDetails
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPDF = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/quotes/${quote.id}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `quote-${quote.quoteNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const printQuote = () => {
    window.print()
  }

  const shareQuote = async () => {
    const url = `${window.location.origin}/quotes/${quote.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote ${quote.quoteNumber}`,
          text: `Audio equipment quote for ${quote.client.name}`,
          url: url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url)
      alert('Quote link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start no-print">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Quote #{quote.quoteNumber}
          </h1>
          <p className="text-slate-300">
            Generated on {formatDateTime(quote.createdAt)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
          
          <Button
            onClick={printQuote}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          
          <Button
            onClick={shareQuote}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Quote Document */}
      <div className="glass-effect p-8 rounded-2xl bg-white text-slate-900 print:shadow-none print:bg-white">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AP</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {COMPANY_INFO.name}
                </h1>
                <p className="text-slate-600">{COMPANY_INFO.tagline}</p>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {COMPANY_INFO.contact.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {COMPANY_INFO.contact.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {COMPANY_INFO.contact.address}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              QUOTATION
            </div>
            <div className="space-y-1 text-sm">
              <div><strong>Quote #:</strong> {quote.quoteNumber}</div>
              <div><strong>Date:</strong> {formatDate(quote.createdAt)}</div>
              {quote.validUntil && (
                <div><strong>Valid Until:</strong> {formatDate(quote.validUntil)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Client and Event Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Client Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Client Information
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {quote.client.name}</div>
              <div><strong>Email:</strong> {quote.client.email}</div>
              {quote.client.phone && (
                <div><strong>Phone:</strong> {quote.client.phone}</div>
              )}
              {quote.client.company && (
                <div><strong>Company:</strong> {quote.client.company}</div>
              )}
            </div>
          </div>

          {/* Usage Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Usage Details
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>Type:</strong> {quote.usageType.replace('_', ' ')}</div>
              {quote.spaceSize && (
                <div><strong>Space Size:</strong> {quote.spaceSize}</div>
              )}
              {quote.budget && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span><strong>Budget:</strong> ${quote.budget.toLocaleString()}</span>
                </div>
              )}
              {quote.warrantyPeriod && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span><strong>Warranty:</strong> {quote.warrantyPeriod} months</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Installation Information */}
        {quote.installation && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Installation Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div><strong>Usage Type:</strong> {quote.installation.usageType.replace('_', ' ')}</div>
              <div><strong>Space Size:</strong> {quote.installation.spaceSize}</div>
              <div><strong>Location:</strong> {quote.installation.location || 'TBD'}</div>
            </div>
          </div>
        )}

        {/* Equipment List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Equipment Details
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-3 text-left">Item</th>
                  <th className="border border-slate-300 p-3 text-left">Category</th>
                  <th className="border border-slate-300 p-3 text-center">Qty</th>
                  <th className="border border-slate-300 p-3 text-right">Unit Price</th>
                  <th className="border border-slate-300 p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="border border-slate-300 p-3">
                      <div>
                        <div className="font-medium">{item.equipment.name}</div>
                        {item.equipment.description && (
                          <div className="text-sm text-slate-600 mt-1">
                            {item.equipment.description}
                          </div>
                        )}
                        {item.installationZone && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {item.installationZone}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-300 p-3">
                      {item.equipment.category.name}
                    </td>
                    <td className="border border-slate-300 p-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-slate-300 p-3 text-right">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="border border-slate-300 p-3 text-right font-medium">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quote Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatPrice(quote.tax)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Notes</h3>
            <div className="bg-slate-50 p-4 rounded-lg text-sm">
              {quote.notes}
            </div>
          </div>
        )}

        {/* Terms and Footer */}
        <div className="border-t border-slate-200 pt-6 mt-8">
          <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-600">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Terms & Conditions</h4>
              <ul className="space-y-1 text-xs">
                <li>• Quote valid for {quote.validUntil ? Math.ceil((new Date(quote.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30} days from issue date</li>
                <li>• Prices exclude delivery and setup unless specified</li>
                <li>• Equipment subject to availability at time of booking</li>
                <li>• 50% deposit required to confirm booking</li>
                <li>• Technical support included during event hours</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Next Steps</h4>
              <div className="text-xs space-y-1">
                <p>1. Review equipment list and pricing</p>
                <p>2. Contact us with any questions or modifications</p>
                <p>3. Confirm booking with signed agreement</p>
                <p>4. Schedule delivery and setup</p>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Ready to proceed?</strong> Contact us at {COMPANY_INFO.contact.email} 
                  or {COMPANY_INFO.contact.phone} to confirm your booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
