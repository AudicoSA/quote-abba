
'use client'

import { motion } from 'framer-motion'
import { 
  Brain, 
  Calculator, 
  FileText, 
  Zap, 
  Target, 
  Clock,
  Shield,
  Palette,
  Users
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    description: 'Advanced AI analyzes your venue and event requirements to suggest optimal equipment configurations.',
    color: 'text-blue-400'
  },
  {
    icon: Calculator,
    title: 'Instant Pricing',
    description: 'Get real-time pricing with automatic calculations including taxes, discounts, and volume pricing.',
    color: 'text-green-400'
  },
  {
    icon: FileText,
    title: 'Professional PDFs',
    description: 'Generate polished, branded quotation documents ready for client presentation.',
    color: 'text-purple-400'
  },
  {
    icon: Target,
    title: 'Budget Optimization',
    description: 'Smart suggestions to meet your budget while maintaining audio quality and event requirements.',
    color: 'text-orange-400'
  },
  {
    icon: Palette,
    title: 'Venue Layout Designer',
    description: 'Interactive tools to design your venue layout and visualize equipment placement.',
    color: 'text-pink-400'
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'Pricing and availability updated in real-time from our cloud-based equipment database.',
    color: 'text-cyan-400'
  },
  {
    icon: Shield,
    title: 'Compatibility Checking',
    description: 'Automatic verification that all equipment works together seamlessly for your event.',
    color: 'text-red-400'
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Track quotes, manage client relationships, and maintain quote history effortlessly.',
    color: 'text-yellow-400'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate comprehensive quotes in under 5 minutes with our optimized quotation engine.',
    color: 'text-indigo-400'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-slate-900/50" />
      
      <div className="container-custom relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need for{' '}
            <span className="gradient-text">Perfect Quotes</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our comprehensive platform combines AI intelligence with professional audio expertise 
            to deliver accurate, optimized equipment quotes for any event or venue.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-effect p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
