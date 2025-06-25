
'use client'

import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Calendar,
  Globe,
  Headphones
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO } from '@/lib/constants'

export function ContactInfo() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      content: COMPANY_INFO.contact.email,
      description: 'Send us an email and we\'ll respond within 24 hours',
      action: 'mailto:' + COMPANY_INFO.contact.email,
      actionText: 'Send Email',
      color: 'text-blue-400'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: COMPANY_INFO.contact.phone,
      description: 'Speak with our audio experts directly',
      action: 'tel:' + COMPANY_INFO.contact.phone.replace(/\D/g, ''),
      actionText: 'Call Now',
      color: 'text-green-400'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: COMPANY_INFO.contact.address,
      description: 'Come see our showroom and equipment demos',
      action: `https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.contact.address)}`,
      actionText: 'Get Directions',
      color: 'text-purple-400'
    }
  ]

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ]

  return (
    <div className="space-y-8">
      {/* Contact Methods */}
      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <div key={index} className="glass-effect p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-slate-800 ${method.color}`}>
                <method.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-lg text-slate-300 mb-2">
                  {method.content}
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  {method.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-current text-current hover:bg-current hover:text-slate-900"
                >
                  <a href={method.action} target="_blank" rel="noopener noreferrer">
                    {method.actionText}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Business Hours */}
      <div className="glass-effect p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-400" />
          Business Hours
        </h3>
        <div className="space-y-3">
          {businessHours.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-slate-300">{schedule.day}</span>
              <span className="text-white font-medium">{schedule.hours}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
          <p className="text-sm text-blue-300">
            <Headphones className="h-4 w-4 inline mr-2" />
            24/7 Emergency support available for ongoing events
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-effect p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            asChild 
            className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
          >
            <a href="/quote-builder" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start a Quote Request
            </a>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="w-full justify-start"
          >
            <a href="/equipment" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Browse Equipment Catalog
            </a>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="w-full justify-start"
          >
            <a 
              href={`mailto:${COMPANY_INFO.contact.email}?subject=Custom Equipment Consultation`}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Request Consultation
            </a>
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="glass-effect p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-4">Why Choose Audico?</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-300">
              <strong className="text-white">AI-Powered Recommendations:</strong> Get optimal equipment 
              configurations tailored to your specific venue and event requirements.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-300">
              <strong className="text-white">Professional Grade Equipment:</strong> Access to industry-leading 
              audio equipment from top manufacturers.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-300">
              <strong className="text-white">Expert Support:</strong> Our certified audio engineers provide 
              technical support throughout your event.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-slate-300">
              <strong className="text-white">Instant Quotes:</strong> Professional quotes generated 
              in minutes, not days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
