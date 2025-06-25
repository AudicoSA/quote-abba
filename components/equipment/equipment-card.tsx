
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Info, 
  Zap, 
  Weight, 
  Ruler, 
  Volume2,
  Check
} from 'lucide-react'
import { formatPrice, getEquipmentPowerColor } from '@/lib/utils'
import type { EquipmentWithCategory } from '@/lib/types'

interface EquipmentCardProps {
  equipment: EquipmentWithCategory
  onAdd: (quantity: number, installationZone?: string) => void
  selectedQuantity?: number
  installationZones?: string[]
}

export function EquipmentCard({ 
  equipment, 
  onAdd, 
  selectedQuantity = 0,
  installationZones = []
}: EquipmentCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedInstallationZone, setSelectedInstallationZone] = useState<string>('')
  const [showDetails, setShowDetails] = useState(false)

  const handleAdd = () => {
    onAdd(quantity, selectedInstallationZone || undefined)
    setQuantity(1)
    setSelectedInstallationZone('')
  }

  const specifications = equipment.specifications as Record<string, any> || {}

  return (
    <div className="glass-effect p-4 rounded-xl hover:bg-white/10 transition-all duration-300 group">
      {/* Equipment Image */}
      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden bg-slate-800">
        {equipment.imageUrl ? (
          <Image
            src={equipment.imageUrl}
            alt={equipment.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Volume2 className="h-12 w-12 text-slate-600" />
          </div>
        )}
        
        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-blue-600/80 text-white"
        >
          {equipment.category.name}
        </Badge>

        {/* Availability Badge */}
        <Badge 
          variant={equipment.availability ? "default" : "destructive"}
          className="absolute top-2 right-2"
        >
          {equipment.availability ? 'Available' : 'Out of Stock'}
        </Badge>
      </div>

      {/* Equipment Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
            {equipment.name}
          </h3>
          {equipment.brand && equipment.model && (
            <p className="text-sm text-slate-400">
              {equipment.brand} - {equipment.model}
            </p>
          )}
        </div>

        {equipment.description && (
          <p className="text-sm text-slate-300 line-clamp-2">
            {equipment.description}
          </p>
        )}

        {/* Key Specifications */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {equipment.powerRating && (
            <div className="flex items-center gap-1">
              <Zap className={`h-3 w-3 ${getEquipmentPowerColor(equipment.powerRating)}`} />
              <span className="text-slate-400">{equipment.powerRating}W</span>
            </div>
          )}
          {equipment.weight && (
            <div className="flex items-center gap-1">
              <Weight className="h-3 w-3 text-slate-400" />
              <span className="text-slate-400">{equipment.weight}kg</span>
            </div>
          )}
          {equipment.frequency && (
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3 text-slate-400" />
              <span className="text-slate-400">{equipment.frequency}</span>
            </div>
          )}
          {equipment.dimensions && (
            <div className="flex items-center gap-1">
              <Ruler className="h-3 w-3 text-slate-400" />
              <span className="text-slate-400">{equipment.dimensions}</span>
            </div>
          )}
        </div>

        {/* Connectivity */}
        {equipment.connectivity.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {equipment.connectivity.slice(0, 3).map((conn, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {conn}
              </Badge>
            ))}
            {equipment.connectivity.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{equipment.connectivity.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-blue-400">
              {formatPrice(equipment.basePrice)}
            </div>
            <div className="text-xs text-slate-400">per unit</div>
          </div>
          
          {selectedQuantity > 0 && (
            <Badge variant="secondary" className="bg-green-600">
              <Check className="h-3 w-3 mr-1" />
              {selectedQuantity} selected
            </Badge>
          )}
        </div>

        {/* Details Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-slate-400 hover:text-white"
        >
          <Info className="h-4 w-4 mr-2" />
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>

        {/* Expanded Details */}
        {showDetails && (
          <div className="bg-slate-800/50 p-3 rounded-lg space-y-2">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-slate-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-white">{value}</span>
              </div>
            ))}
            
            {equipment.minQuantity > 1 && (
              <div className="text-xs text-yellow-400">
                Minimum order: {equipment.minQuantity} units
              </div>
            )}
            
            {equipment.maxQuantity && (
              <div className="text-xs text-slate-400">
                Maximum order: {equipment.maxQuantity} units
              </div>
            )}
          </div>
        )}

        {/* Add to Quote Section */}
        {equipment.availability && (
          <div className="space-y-3 pt-3 border-t border-slate-700">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Quantity</label>
                <Input
                  type="number"
                  min={equipment.minQuantity || 1}
                  max={equipment.maxQuantity || 100}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="h-8 text-sm bg-slate-800 border-slate-700"
                />
              </div>
              
              {installationZones.length > 0 && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Zone</label>
                  <Select value={selectedInstallationZone} onValueChange={setSelectedInstallationZone}>
                    <SelectTrigger className="h-8 text-sm bg-slate-800 border-slate-700">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any zone</SelectItem>
                      {installationZones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleAdd}
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Add to Quote
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
