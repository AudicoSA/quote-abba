
'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Coordinator',
    company: 'Elite Events Co.',
    content: 'Audico Solutions has revolutionized how we handle equipment quotes. The AI recommendations are incredibly accurate, and we can deliver professional quotes to clients in minutes instead of days.',
    rating: 5,
    image: 'https://i.pinimg.com/originals/d6/f9/91/d6f991fa9de5196eeaaa492470a6c8b2.png'
  },
  {
    name: 'Michael Chen',
    role: 'Sound Engineer',
    company: 'Premier Productions',
    content: 'The equipment compatibility checking feature has saved us countless headaches. No more arriving at venues with incompatible gear. The system thinks of everything we need.',
    rating: 5,
    image: 'https://img.freepik.com/premium-photo/professional-male-sound-engineer-mixing-audio-recording-studio-music-production-technology-working-mixer_154092-15371.jpg?w=2000'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Venue Manager',
    company: 'Metropolitan Conference Center',
    content: 'We use Audico for all our client equipment quotes. The venue layout designer helps clients visualize their setup, and the professional PDFs always impress.',
    rating: 5,
    image: 'https://static.vecteezy.com/system/resources/previews/042/717/845/non_2x/confident-hispanic-business-woman-standing-outside-an-office-building-portrait-of-smiling-professional-businesswoman-on-blur-office-building-background-professional-manager-in-suit-photo.jpg'
  },
  {
    name: 'David Thompson',
    role: 'Wedding Planner',
    company: 'Dream Day Weddings',
    content: 'The budget optimization feature is a game-changer. We can offer couples multiple options that fit their budget while ensuring perfect audio for their special day.',
    rating: 5,
    image: 'https://i.pinimg.com/originals/74/a5/91/74a59103a052231d346f4f407cfdb541.jpg'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-800/80" />
      
      <div className="container-custom relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Our{' '}
            <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Hear from event professionals who trust Audico Solutions 
            to deliver exceptional audio equipment quotes and recommendations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="glass-effect p-8 rounded-2xl relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Quote className="h-8 w-8 text-blue-400 mb-4 opacity-60" />
              
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-400 mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['EventPro', 'SoundMasters', 'AudioTech', 'VenueMax', 'ProEvents'].map((company) => (
              <div key={company} className="text-xl font-semibold text-slate-500">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
