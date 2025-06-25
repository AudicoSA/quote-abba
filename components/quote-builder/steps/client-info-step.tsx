
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Phone, Building } from 'lucide-react'
import type { QuoteBuilderData } from '@/lib/types'

interface ClientInfoStepProps {
  data: Partial<QuoteBuilderData>
  onUpdate: (data: Partial<QuoteBuilderData>) => void
  onNext: () => void
}

export function ClientInfoStep({ data, onUpdate, onNext }: ClientInfoStepProps) {
  const [formData, setFormData] = useState({
    name: data.clientInfo?.name || '',
    email: data.clientInfo?.email || '',
    phone: data.clientInfo?.phone || '',
    company: data.clientInfo?.company || '',
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    onUpdate({ clientInfo: formData })
  }, [formData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Let's start with your information
        </h3>
        <p className="text-slate-300">
          We'll use this information to personalize your quote and keep you updated.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-white">
            <User className="h-4 w-4" />
            Full Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={`bg-slate-800 border-slate-700 text-white ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && (
            <span className="text-red-400 text-sm">{errors.name}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-white">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            className={`bg-slate-800 border-slate-700 text-white ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <span className="text-red-400 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-white">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="flex items-center gap-2 text-white">
            <Building className="h-4 w-4" />
            Company/Organization
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Enter your company name"
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-8"
        >
          Continue to Usage Selection
        </Button>
      </div>
    </form>
  )
}
