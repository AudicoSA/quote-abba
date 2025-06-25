
import { QuoteBuilderWizard } from '@/components/quote-builder/quote-builder-wizard'
import { Header } from '@/components/header'
import { FormErrorBoundary } from '@/components/form-error-boundary'

export default function QuoteBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <main className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Build Your Quote
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Use our AI-powered system to create professional audio equipment quotes tailored to your event requirements.
          </p>
        </div>
        <FormErrorBoundary>
          <QuoteBuilderWizard />
        </FormErrorBoundary>
      </main>
    </div>
  )
}
