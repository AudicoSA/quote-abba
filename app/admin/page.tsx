
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { Header } from '@/components/header'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <main className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Manage equipment catalog, view quotes, and analyze business performance.
          </p>
        </div>
        <AdminDashboard />
      </main>
    </div>
  )
}
