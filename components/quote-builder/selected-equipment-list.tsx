
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { SelectedEquipment, EquipmentWithCategory } from '@/lib/types'

interface SelectedEquipmentListProps {
  selectedEquipment: SelectedEquipment[]
  equipment: EquipmentWithCategory[]
  onUpdateQuantity: (equipmentId: string, quantity: number, room?: string) => void
  onRemove: (equipmentId: string, room?: string) => void
}

export function SelectedEquipmentList({
  selectedEquipment,
  equipment,
  onUpdateQuantity,
  onRemove
}: SelectedEquipmentListProps) {
  const getEquipmentDetails = (equipmentId: string) => {
    return equipment.find(eq => eq.id === equipmentId)
  }

  const calculateTotal = () => {
    return selectedEquipment.reduce((total, item) => {
      const details = getEquipmentDetails(item.equipmentId)
      return total + (details?.basePrice || 0) * item.quantity
    }, 0)
  }

  return (
    <div className="glass-effect p-4 rounded-xl">
      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Selected Equipment
      </h4>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {selectedEquipment.map((item, index) => {
          const details = getEquipmentDetails(item.equipmentId)
          if (!details) return null

          const lineTotal = details.basePrice * item.quantity

          return (
            <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate">
                    {details.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatPrice(details.basePrice)} each
                  </div>
                  {item.installationZone && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.installationZone}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.equipmentId, item.installationZone)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Qty:</span>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(
                      item.equipmentId, 
                      parseInt(e.target.value) || 1,
                      item.installationZone
                    )}
                    className="w-16 h-7 text-xs bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="text-sm font-medium text-white">
                  {formatPrice(lineTotal)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedEquipment.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-300">
              Subtotal:
            </span>
            <span className="font-semibold text-blue-400">
              {formatPrice(calculateTotal())}
            </span>
          </div>
        </div>
      )}

      {selectedEquipment.length === 0 && (
        <div className="text-center py-8">
          <ShoppingCart className="h-8 w-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            No equipment selected yet
          </p>
        </div>
      )}
    </div>
  )
}
