
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20" />
      <div className="absolute inset-0 bg-[url('/circuit.svg')] bg-center opacity-10" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/10 rounded-full animation-float" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full animation-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-400/10 rounded-full animation-float" style={{ animationDelay: '4s' }} />
      
      <div className="container-custom relative">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-blue-400 font-medium uppercase tracking-wider">
              Ready to Get Started?
            </span>
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Transform Your{' '}
            <span className="gradient-text">Quotation Process</span>{' '}
            Today
          </h2>
          
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of audio professionals who have streamlined their workflow 
            with our AI-powered quotation system. Generate accurate quotes in minutes, 
            not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 group"
            >
              <Link href="/quote-builder" className="flex items-center gap-2">
                Start Your First Quote
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-slate-400 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6"
            >
              <Link href="/equipment">
                Browse Equipment
              </Link>
            </Button>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <motion.div 
              className="glass-effect p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-blue-400 text-2xl font-bold mb-2">Free</div>
              <div className="text-white font-medium mb-2">No Setup Costs</div>
              <div className="text-sm text-slate-400">Start generating quotes immediately with no upfront investment</div>
            </motion.div>
            
            <motion.div 
              className="glass-effect p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-green-400 text-2xl font-bold mb-2">5min</div>
              <div className="text-white font-medium mb-2">Quick Setup</div>
              <div className="text-sm text-slate-400">Get your first professional quote generated in under 5 minutes</div>
            </motion.div>
            
            <motion.div 
              className="glass-effect p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-purple-400 text-2xl font-bold mb-2">24/7</div>
              <div className="text-white font-medium mb-2">Always Available</div>
              <div className="text-sm text-slate-400">AI-powered system works around the clock for your business</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
