
import { Header } from '@/components/header'
import { ContactForm } from '@/components/contact-form'
import { ContactInfo } from '@/components/contact-info'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <main className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Get in touch with our audio experts for custom requirements or questions about our equipment and services.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </main>
    </div>
  )
}
