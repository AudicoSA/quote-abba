
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Building, ShoppingCart, Briefcase, MapPin, DollarSign } from 'lucide-react'
import { USAGE_TYPES, BUDGET_RANGES } from '@/lib/constants'
import type { QuoteBuilderData } from '@/lib/types'

interface UsageTypeStepProps {
  data: Partial<QuoteBuilderData>
  onUpdate: (data: Partial<QuoteBuilderData>) => void
  onNext: () => void
}

const USAGE_ICONS = {
  home_audio: Home,
  restaurant_cafe: Building,
  business_office: Briefcase,
  commercial_retail: ShoppingCart,
  tender_government: MapPin,
  fitness_gym: Building,
  education: Building,
  worship: Building,
  hospitality: Building,
  other: Building,
} as const

export function UsageTypeStep({ data, onUpdate, onNext }: UsageTypeStepProps) {
  const [formData, setFormData] = useState({
    usageType: data.usageDetails?.usageType || '',
    budget: data.usageDetails?.budget || undefined,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    onUpdate({
      usageDetails: formData
    })
  }, [formData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.usageType) {
      newErrors.usageType = 'Usage type is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const selectedUsageType = USAGE_TYPES.find(type => type.value === formData.usageType)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          What type of audio system do you need?
        </h3>
        <p className="text-slate-300">
          Tell us about your space and how you plan to use the audio equipment.
        </p>
      </div>

      {/* Usage Type Selection */}
      <div className="space-y-4">
        <Label className="text-white text-lg font-medium">
          Select Your Usage Type *
        </Label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USAGE_TYPES.map((type) => {
            const Icon = USAGE_ICONS[type.value as keyof typeof USAGE_ICONS] || Building
            const isSelected = formData.usageType === type.value
            
            return (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'bg-blue-600/20 border-blue-400 ring-2 ring-blue-400' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => handleInputChange('usageType', type.value)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <CardTitle className={`text-sm ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                      {type.label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-slate-400 text-xs">
                    {type.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {errors.usageType && (
          <span className="text-red-400 text-sm">{errors.usageType}</span>
        )}
      </div>

      {/* Budget Range (Optional) */}
      <div className="space-y-2 max-w-md">
        <Label htmlFor="budget" className="flex items-center gap-2 text-white">
          <DollarSign className="h-4 w-4" />
          Budget Range (Optional)
        </Label>
        <p className="text-slate-400 text-sm mb-3">
          This helps our AI provide better recommendations, but you can leave it blank if you're not sure.
        </p>
        <Select 
          value={formData.budget?.toString() || ''} 
          onValueChange={(value) => handleInputChange('budget', value ? parseFloat(value) : undefined)}
        >
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Select budget range" />
          </SelectTrigger>
          <SelectContent>
            {BUDGET_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Usage Type Info */}
      {selectedUsageType && (
        <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">Selected: {selectedUsageType.label}</h4>
          <p className="text-slate-300 text-sm">{selectedUsageType.description}</p>
        </div>
      )}

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-8"
        >
          Continue to AI Consultation
        </Button>
      </div>
    </form>
  )
}
