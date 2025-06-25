
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, ShoppingCart, Search, Filter } from 'lucide-react'
import { EquipmentCard } from '@/components/equipment/equipment-card'
import { AIRecommendations } from '@/components/quote-builder/ai-recommendations'
import { SelectedEquipmentList } from '@/components/quote-builder/selected-equipment-list'
import type { QuoteBuilderData, EquipmentWithCategory, SelectedEquipment } from '@/lib/types'

interface EquipmentSelectionStepProps {
  data: Partial<QuoteBuilderData>
  onUpdate: (data: Partial<QuoteBuilderData>) => void
  onNext: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function EquipmentSelectionStep({ 
  data, 
  onUpdate, 
  onNext, 
  isLoading, 
  setIsLoading 
}: EquipmentSelectionStepProps) {
  const [equipment, setEquipment] = useState<EquipmentWithCategory[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<SelectedEquipment[]>(
    data.selectedEquipment || []
  )
  const [aiRecommendations, setAiRecommendations] = useState(data.aiRecommendations || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAIRecommendations, setShowAIRecommendations] = useState(true)

  useEffect(() => {
    fetchEquipment()
  }, [])

  useEffect(() => {
    onUpdate({ 
      selectedEquipment,
      aiRecommendations 
    })
  }, [selectedEquipment, aiRecommendations])

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment')
      if (response.ok) {
        const data = await response.json()
        setEquipment(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
    }
  }

  const generateAIRecommendations = async () => {
    if (!data.usageDetails?.usageType) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/equipment-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usageType: data.usageDetails.usageType,
          spaceSize: data.usageDetails.spaceSize,
          budget: data.usageDetails.budget,
          usageSpec: data.usageSpec,
          aiConversation: data.aiConversation,
          availableEquipment: equipment,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAiRecommendations(result.data?.recommendations || [])
      }
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addEquipment = (equipmentId: string, quantity: number = 1, installationZone?: string) => {
    const existingIndex = selectedEquipment.findIndex(item => 
      item.equipmentId === equipmentId && item.installationZone === installationZone
    )

    if (existingIndex >= 0) {
      const updated = [...selectedEquipment]
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      }
      setSelectedEquipment(updated)
    } else {
      setSelectedEquipment(prev => [...prev, {
        equipmentId,
        quantity,
        installationZone
      }])
    }
  }

  const removeEquipment = (equipmentId: string, installationZone?: string) => {
    setSelectedEquipment(prev => 
      prev.filter(item => !(item.equipmentId === equipmentId && item.installationZone === installationZone))
    )
  }

  const updateEquipmentQuantity = (equipmentId: string, quantity: number, installationZone?: string) => {
    if (quantity <= 0) {
      removeEquipment(equipmentId, installationZone)
      return
    }

    setSelectedEquipment(prev => 
      prev.map(item => 
        item.equipmentId === equipmentId && item.installationZone === installationZone
          ? { ...item, quantity }
          : item
      )
    )
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      item.category.id === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = equipment.reduce((acc, item) => {
    if (!acc.find(cat => cat.id === item.category.id)) {
      acc.push(item.category)
    }
    return acc
  }, [] as Array<{ id: string; name: string }>)

  const totalItems = selectedEquipment.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Select Your Audio Equipment
        </h3>
        <p className="text-slate-300">
          Choose from our catalog or let AI recommend the perfect equipment for your space and needs.
        </p>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations.length === 0 && !isLoading && (
        <div className="text-center">
          <Button
            onClick={generateAIRecommendations}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Get AI Recommendations
          </Button>
        </div>
      )}

      {aiRecommendations.length > 0 && showAIRecommendations && (
        <AIRecommendations
          recommendations={aiRecommendations}
          equipment={equipment}
          onAddEquipment={addEquipment}
          onClose={() => setShowAIRecommendations(false)}
        />
      )}

      {/* Equipment Browser */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Filters and Search */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-effect p-4 rounded-xl">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search & Filter
            </h4>
            
            <div className="space-y-4">
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {totalItems > 0 && (
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Selected Items:</span>
                    <Badge variant="secondary" className="bg-blue-600">
                      {totalItems}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Equipment Summary */}
          {selectedEquipment.length > 0 && (
            <SelectedEquipmentList
              selectedEquipment={selectedEquipment}
              equipment={equipment}
              onUpdateQuantity={updateEquipmentQuantity}
              onRemove={removeEquipment}
            />
          )}
        </div>

        {/* Equipment Grid */}
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredEquipment.map(item => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onAdd={(quantity, installationZone) => addEquipment(item.id, quantity, installationZone)}
                selectedQuantity={
                  selectedEquipment
                    .filter(selected => selected.equipmentId === item.id)
                    .reduce((sum, selected) => sum + selected.quantity, 0)
                }
                installationZones={data.usageSpec?.requirements || []}
              />
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No equipment found matching your criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <div className="text-slate-300">
          {selectedEquipment.length > 0 && (
            <span>{selectedEquipment.length} item(s) selected</span>
          )}
        </div>
        
        <Button
          onClick={onNext}
          disabled={selectedEquipment.length === 0}
          className="bg-blue-600 hover:bg-blue-700 px-8 flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Review Purchase
        </Button>
      </div>
    </div>
  )
}
