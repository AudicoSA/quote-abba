
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Calendar,
  DollarSign,
  User,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatDateTime, getStatusColor } from '@/lib/utils'
import type { QuoteWithDetails } from '@/lib/types'

export function QuotesList() {
  const [quotes, setQuotes] = useState<QuoteWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchQuotes()
  }, [searchTerm, statusFilter, dateFilter])

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (dateFilter !== 'all') params.append('dateFilter', dateFilter)

      const response = await fetch(`/api/admin/quotes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setQuotes(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuoteStatus = async (quoteId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      if (response.ok) {
        fetchQuotes() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update quote status:', error)
    }
  }

  const downloadQuotePDF = async (quoteId: string, quoteNumber: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `quote-${quoteNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download PDF:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setDateFilter('all')
            }}
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading quotes...</p>
          </div>
        ) : quotes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-white font-medium">Quote #</th>
                  <th className="text-left p-4 text-white font-medium">Client</th>
                  <th className="text-left p-4 text-white font-medium">Event</th>
                  <th className="text-left p-4 text-white font-medium">Total</th>
                  <th className="text-left p-4 text-white font-medium">Status</th>
                  <th className="text-left p-4 text-white font-medium">Date</th>
                  <th className="text-left p-4 text-white font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote, index) => (
                  <tr 
                    key={quote.id} 
                    className={`border-b border-slate-700 hover:bg-slate-800/25 ${
                      index % 2 === 0 ? 'bg-slate-800/10' : 'bg-transparent'
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-medium text-white">#{quote.quoteNumber}</div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">{quote.client.name}</div>
                        <div className="text-sm text-slate-400">{quote.client.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-white">{quote.usageType.replace('_', ' ')}</div>
                        {quote.spaceSize && (
                          <div className="text-sm text-slate-400">{quote.spaceSize}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-blue-400">
                        {formatPrice(quote.total)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Select
                        value={quote.status}
                        onValueChange={(status) => updateQuoteStatus(quote.id, status)}
                      >
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-300">
                        {formatDateTime(quote.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Link href={`/quotes/${quote.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadQuotePDF(quote.id, quote.quoteNumber)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">No quotes found</p>
            <p className="text-sm text-slate-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
