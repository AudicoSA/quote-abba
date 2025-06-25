
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ClientInfoStep } from './steps/client-info-step'
import { UsageTypeStep } from './steps/usage-type-step'
import { AIConsultationStep } from './steps/ai-consultation-step'
import { EquipmentSelectionStep } from './steps/equipment-selection-step'
import { PurchaseReviewStep } from './steps/purchase-review-step'
import type { QuoteBuilderData } from '@/lib/types'

const steps = [
  { id: 'client', title: 'Client Information', component: ClientInfoStep },
  { id: 'usage', title: 'Usage Type', component: UsageTypeStep },
  { id: 'consultation', title: 'AI Consultation', component: AIConsultationStep },
  { id: 'equipment', title: 'Equipment Selection', component: EquipmentSelectionStep },
  { id: 'review', title: 'Purchase Review', component: PurchaseReviewStep },
]

export function QuoteBuilderWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [quoteData, setQuoteData] = useState<Partial<QuoteBuilderData>>({})
  const [isLoading, setIsLoading] = useState(false)

  const CurrentStepComponent = steps[currentStep].component
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateQuoteData = (stepData: Partial<QuoteBuilderData>) => {
    try {
      setQuoteData(prev => ({ ...prev, ...stepData }))
    } catch (error) {
      console.error('Error updating quote data:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="glass-effect p-6 rounded-2xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            {steps[currentStep].title}
          </h2>
          <span className="text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 ${
                index <= currentStep ? 'text-blue-400' : 'text-slate-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentStep ? 'bg-blue-600 text-white' :
                index === currentStep ? 'bg-blue-500 text-white' :
                'bg-slate-700 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <span className="hidden sm:block text-sm">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-effect p-8 rounded-2xl mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              data={quoteData}
              onUpdate={updateQuoteData}
              onNext={handleNext}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isLoading}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        {currentStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
