
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
                AI-Powered Quotations
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Professional Audio{' '}
              <span className="gradient-text">Equipment Quotes</span>{' '}
              in Minutes
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl lg:max-w-none">
              Get instant, AI-powered equipment recommendations and professional quotes 
              tailored to your venue, event type, and budget. No more waiting for days 
              to receive pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              >
                <Link href="/quote-builder" className="flex items-center gap-2">
                  Start Building Quote
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 text-lg px-8 py-6"
              >
                <Link href="/equipment">
                  Browse Equipment
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-700">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">500+</div>
                <div className="text-sm text-slate-400">Equipment Items</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">24/7</div>
                <div className="text-sm text-slate-400">AI Assistant</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold gradient-text">&lt; 5min</div>
                <div className="text-sm text-slate-400">Quote Generation</div>
              </div>
            </div>
          </motion.div>
          
          {/* Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Floating Cards */}
              <motion.div 
                className="absolute top-4 left-4 glass-effect p-4 rounded-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Zap className="h-8 w-8 text-blue-400 mb-2" />
                <div className="text-sm font-medium">AI Recommendations</div>
                <div className="text-xs text-slate-400">Smart equipment selection</div>
              </motion.div>
              
              <motion.div 
                className="absolute top-20 right-8 glass-effect p-4 rounded-2xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Target className="h-8 w-8 text-purple-400 mb-2" />
                <div className="text-sm font-medium">Budget Optimization</div>
                <div className="text-xs text-slate-400">Best value solutions</div>
              </motion.div>
              
              {/* Main Image */}
              <div className="absolute inset-8 rounded-3xl overflow-hidden glass-effect">
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Image
                    src="https://thumbs.dreamstime.com/z/modern-digital-mixing-console-faders-control-buttons-screen-238503736.jpg"
                    alt="Professional Audio Equipment"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Pulse Effect */}
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animation-pulse-slow" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
