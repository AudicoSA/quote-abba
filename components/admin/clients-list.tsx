
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Building,
  FileText,
  Calendar
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { Client } from '@/lib/types'

interface ClientWithStats extends Client {
  quoteCount: number
  totalValue: number
  lastQuoteDate?: Date
}

export function ClientsList() {
  const [clients, setClients] = useState<ClientWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClients()
  }, [searchTerm])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/clients?${params}`)
      if (response.ok) {
        const data = await response.json()
        setClients(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading clients...</p>
          </div>
        ) : clients.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {clients.map((client) => (
              <div key={client.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {client.quoteCount} quotes
                  </Badge>
                </div>

                <h3 className="font-medium text-white mb-2">{client.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-300 truncate">{client.email}</span>
                  </div>
                  
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-300">{client.phone}</span>
                    </div>
                  )}
                  
                  {client.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-300">{client.company}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-slate-400">Total Value</div>
                      <div className="text-blue-400 font-medium">
                        ${client.totalValue.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Member Since</div>
                      <div className="text-white">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {client.lastQuoteDate && (
                    <div className="mt-2 text-xs">
                      <div className="text-slate-400">Last Quote</div>
                      <div className="text-white">
                        {formatDateTime(client.lastQuoteDate)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-3 w-3 mr-1" />
                    Quotes
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">No clients found</p>
            <p className="text-sm text-slate-400">Clients will appear here when quotes are generated</p>
          </div>
        )}
      </div>
    </div>
  )
}
