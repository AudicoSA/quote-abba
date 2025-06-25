
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'

interface StatItemProps {
  end: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

function StatItem({ end, label, prefix = '', suffix = '', duration = 2 }: StatItemProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (inView) {
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        
        setCount(Math.floor(progress * end))
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }
      
      animationFrame = requestAnimationFrame(animate)
      
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [inView, end, duration])

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-2">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-lg text-slate-300 font-medium">
        {label}
      </div>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-blue-900/10" />
      <div className="absolute inset-0 bg-[url('/dots.svg')] bg-center opacity-20" />
      
      <div className="container-custom relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by{' '}
            <span className="gradient-text">Professionals</span>{' '}
            Worldwide
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join thousands of event professionals who rely on our AI-powered quotation system 
            to deliver accurate pricing and optimal equipment recommendations.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <StatItem 
            end={5000}
            suffix="+"
            label="Quotes Generated"
            duration={2.5}
          />
          <StatItem 
            end={1200}
            suffix="+"
            label="Happy Clients"
            duration={2.8}
          />
          <StatItem 
            end={50000}
            suffix="+"
            label="Events Equipped"
            duration={3}
          />
          <StatItem 
            end={99}
            suffix="%"
            label="Client Satisfaction"
            duration={2.2}
          />
        </div>

        {/* Achievement Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <motion.div 
            className="glass-effect p-6 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-blue-400 text-2xl font-bold mb-2">4.9/5</div>
            <div className="text-slate-300">Average Rating</div>
            <div className="text-sm text-slate-400 mt-2">Based on 1,200+ reviews</div>
          </motion.div>
          
          <motion.div 
            className="glass-effect p-6 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-green-400 text-2xl font-bold mb-2">&lt; 5min</div>
            <div className="text-slate-300">Average Quote Time</div>
            <div className="text-sm text-slate-400 mt-2">From requirements to PDF</div>
          </motion.div>
          
          <motion.div 
            className="glass-effect p-6 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="text-purple-400 text-2xl font-bold mb-2">24/7</div>
            <div className="text-slate-300">AI Availability</div>
            <div className="text-sm text-slate-400 mt-2">Always ready to help</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
