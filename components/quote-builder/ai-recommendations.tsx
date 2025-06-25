
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Sparkles, Plus, Info } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { AIRecommendation, EquipmentWithCategory } from '@/lib/types'

interface AIRecommendationsProps {
  recommendations: AIRecommendation[]
  equipment: EquipmentWithCategory[]
  onAddEquipment: (equipmentId: string, quantity: number, room?: string) => void
  onClose: () => void
}

export function AIRecommendations({ 
  recommendations, 
  equipment, 
  onAddEquipment, 
  onClose 
}: AIRecommendationsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const getEquipmentDetails = (equipmentId: string) => {
    return equipment.find(eq => eq.id === equipmentId)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400'
    if (confidence >= 0.6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence'
    if (confidence >= 0.6) return 'Medium Confidence'
    return 'Low Confidence'
  }

  return (
    <div className="glass-effect p-6 rounded-2xl border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-white capitalize">
                  {recommendation.category}
                </h4>
                <Badge 
                  variant="outline" 
                  className={`${getConfidenceColor(recommendation.confidence)} border-current`}
                >
                  {getConfidenceLabel(recommendation.confidence)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedCategory(
                  expandedCategory === recommendation.category ? null : recommendation.category
                )}
                className="text-slate-400 hover:text-white"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              {recommendation.reasoning}
            </p>

            {expandedCategory === recommendation.category && (
              <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-400">
                  AI Analysis: This recommendation is based on your venue acoustics, 
                  guest count, event type, and our database of optimal audio configurations 
                  for similar events.
                </p>
              </div>
            )}

            <div className="space-y-2">
              {recommendation.equipment.map((item, equipIndex) => {
                const equipmentDetails = getEquipmentDetails(item.id)
                if (!equipmentDetails) return null

                return (
                  <div 
                    key={equipIndex}
                    className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">
                          {equipmentDetails.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          x{item.quantity}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400">
                        {formatPrice(equipmentDetails.basePrice)} each • {item.reasoning}
                      </div>
                      {item.installationZone && (
                        <div className="text-xs text-blue-400 mt-1">
                          Recommended for: {item.installationZone}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onAddEquipment(item.id, item.quantity, item.installationZone)}
                      className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                )
              })}
            </div>

            {recommendation.alternatives && recommendation.alternatives.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <h5 className="text-sm font-medium text-slate-300 mb-2">
                  Alternative Options:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {recommendation.alternatives.map((alt, altIndex) => (
                    <Button
                      key={altIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => onAddEquipment(alt.id, 1)}
                      className="text-xs"
                    >
                      {alt.name} ({formatPrice(alt.basePrice)})
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-purple-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-white mb-1">
              About These Recommendations
            </h4>
            <p className="text-sm text-slate-300">
              Our AI analyzes your venue acoustics, guest count, event type, and thousands 
              of successful setups to recommend optimal equipment configurations. 
              You can use these as-is or as a starting point for customization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
