
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package,
  DollarSign,
  Zap
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { EquipmentWithCategory } from '@/lib/types'

export function EquipmentManager() {
  const [equipment, setEquipment] = useState<EquipmentWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEquipment()
  }, [searchTerm])

  const fetchEquipment = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/equipment?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEquipment(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteEquipment = async (equipmentId: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return

    try {
      const response = await fetch(`/api/admin/equipment/${equipmentId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchEquipment() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete equipment:', error)
    }
  }

  const toggleAvailability = async (equipmentId: string, availability: boolean) => {
    try {
      const response = await fetch(`/api/admin/equipment/${equipmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: !availability }),
      })
      
      if (response.ok) {
        fetchEquipment() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update equipment availability:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      {/* Equipment Grid */}
      <div className="glass-effect rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading equipment...</p>
          </div>
        ) : equipment.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {equipment.map((item) => (
              <div key={item.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.category.name}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEquipment(item.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-medium text-white mb-2">{item.name}</h3>
                
                {item.description && (
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price:</span>
                    <span className="text-blue-400 font-medium">
                      {formatPrice(item.basePrice)}
                    </span>
                  </div>
                  
                  {item.powerRating && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Power:</span>
                      <span className="text-white">{item.powerRating}W</span>
                    </div>
                  )}
                  
                  {item.brand && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Brand:</span>
                      <span className="text-white">{item.brand}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                  <Button
                    variant={item.availability ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleAvailability(item.id, item.availability)}
                    className="text-xs"
                  >
                    {item.availability ? 'Disable' : 'Enable'}
                  </Button>
                  
                  <Badge 
                    variant={item.availability ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {item.availability ? 'Available' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">No equipment found</p>
            <p className="text-sm text-slate-400">Start by adding some audio equipment to your catalog</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add First Equipment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
