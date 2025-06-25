
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Plus,
  Filter,
  Download
} from 'lucide-react'
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils'
import { DashboardStats } from './dashboard-stats'
import { QuotesList } from './quotes-list'
import { EquipmentManager } from './equipment-manager'
import { ClientsList } from './clients-list'
import type { DashboardStats as DashboardStatsType } from '@/lib/types'

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async (type: 'quotes' | 'clients' | 'equipment') => {
    try {
      const response = await fetch(`/api/admin/export/${type}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error(`Failed to export ${type}:`, error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      {stats && <DashboardStats stats={stats} />}

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="glass-effect">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData('quotes')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {stats?.recentQuotes.slice(0, 5).map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Quote #{quote.quoteNumber}</div>
                      <div className="text-sm text-slate-400">
                        {formatDateTime(quote.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-blue-400">
                        {formatPrice(quote.total)}
                      </div>
                      <Badge 
                        variant="secondary"
                        className={quote.status === 'accepted' ? 'bg-green-600' : 
                                  quote.status === 'sent' ? 'bg-blue-600' : 'bg-gray-600'}
                      >
                        {quote.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Equipment */}
            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Popular Equipment
              </h3>
              <div className="space-y-4">
                {stats?.popularEquipment.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-sm text-slate-400">
                        {formatPrice(item.basePrice)}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-600">
                      {item.usageCount} uses
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-effect p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-5 w-5" />
                Add Equipment
              </Button>
              <Button className="h-20 flex-col gap-2 bg-green-600 hover:bg-green-700">
                <FileText className="h-5 w-5" />
                Create Quote
              </Button>
              <Button className="h-20 flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                <Users className="h-5 w-5" />
                Manage Clients
              </Button>
              <Button className="h-20 flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                <BarChart3 className="h-5 w-5" />
                View Reports
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quotes">
          <QuotesList />
        </TabsContent>

        <TabsContent value="equipment">
          <EquipmentManager />
        </TabsContent>

        <TabsContent value="clients">
          <ClientsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
