
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900/80 border-t border-slate-800">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/audico-logo.png"
                  alt="Audico"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold gradient-text">Audico Solutions</span>
            </Link>
            <p className="text-slate-300 mb-6 max-w-md">
              Professional audio equipment quotations powered by AI. Get accurate pricing 
              and expert recommendations for any event or venue in minutes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>quotes@audico.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>123 Sound Street, Audio City, AC 12345</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/quote-builder" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Build Quote
              </Link>
              <Link href="/equipment" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Equipment Catalog
              </Link>
              <Link href="/contact" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Contact Us
              </Link>
              <Link href="/admin" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Admin Dashboard
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <div className="space-y-3">
              <Link href="#" className="block text-slate-300 hover:text-blue-400 transition-colors">
                About Audico
              </Link>
              <Link href="#" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Our Technology
              </Link>
              <Link href="#" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Success Stories
              </Link>
              <Link href="#" className="block text-slate-300 hover:text-blue-400 transition-colors">
                Partner Program
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} Audico Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-slate-400 text-sm">Made with AI-powered intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
