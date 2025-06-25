
import { Header } from '@/components/header'
import { EquipmentCatalog } from '@/components/equipment/equipment-catalog'

export default function EquipmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <main className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Equipment Catalog
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Browse our comprehensive collection of professional audio equipment with detailed specifications and real-time pricing.
          </p>
        </div>
        <EquipmentCatalog />
      </main>
    </div>
  )
}
