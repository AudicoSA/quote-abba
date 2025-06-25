
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { QuoteDisplay } from '@/components/quote-display'
import { Header } from '@/components/header'

interface QuotePageProps {
  params: {
    id: string
  }
}

export const dynamic = "force-dynamic"

async function getQuote(id: string) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: true,
        installation: true,
        items: {
          include: {
            equipment: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })
    
    return quote
  } catch (error) {
    console.error('Error fetching quote:', error)
    return null
  }
}

export default async function QuotePage({ params }: QuotePageProps) {
  const quote = await getQuote(params.id)
  
  if (!quote) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <main className="container-custom py-8">
        <QuoteDisplay quote={quote} />
      </main>
    </div>
  )
}
