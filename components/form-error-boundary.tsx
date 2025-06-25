
'use client'

import { ErrorBoundary } from './error-boundary'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FormErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

export function FormErrorBoundary({ children, onReset }: FormErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="glass-effect p-8 rounded-2xl text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Form Error
          </h3>
          <p className="text-slate-300 mb-4">
            There was an issue with the form. Please try again.
          </p>
          <Button
            onClick={() => {
              if (onReset) onReset()
              window.location.reload()
            }}
            variant="outline"
          >
            Reset Form
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
