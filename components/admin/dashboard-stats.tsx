
'use client'

import { motion } from 'framer-motion'
import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp,
  Calendar,
  Package
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { DashboardStats as DashboardStatsType } from '@/lib/types'

interface DashboardStatsProps {
  stats: DashboardStatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
      change: '+12.5%',
      changeColor: 'text-green-400'
    },
    {
      title: 'Total Quotes',
      value: stats.totalQuotes.toLocaleString(),
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
      change: '+8.2%',
      changeColor: 'text-blue-400'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients.toLocaleString(),
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
      change: '+15.3%',
      changeColor: 'text-purple-400'
    },
    {
      title: 'This Month',
      value: stats.recentQuotes.filter(quote => {
        const quoteDate = new Date(quote.createdAt)
        const now = new Date()
        return quoteDate.getMonth() === now.getMonth() && 
               quoteDate.getFullYear() === now.getFullYear()
      }).length.toString(),
      icon: Calendar,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/20',
      change: '+23.1%',
      changeColor: 'text-orange-400'
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="glass-effect p-6 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className={`text-sm font-medium ${stat.changeColor} flex items-center gap-1`}>
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-slate-400">
              {stat.title}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
