
export const USAGE_TYPES = [
  { value: 'home_audio', label: 'Home Audio System', description: 'Residential audio systems for home entertainment' },
  { value: 'restaurant_cafe', label: 'Restaurant/Cafe Sound', description: 'Background music and announcement systems' },
  { value: 'business_office', label: 'Business/Office Audio', description: 'Conference rooms and office communication systems' },
  { value: 'commercial_retail', label: 'Commercial/Retail Space', description: 'Customer-facing audio for retail environments' },
  { value: 'tender_government', label: 'Tender/Government Project', description: 'Large-scale installations for public sector' },
  { value: 'fitness_gym', label: 'Fitness/Gym Audio', description: 'High-energy sound systems for fitness facilities' },
  { value: 'education', label: 'Educational Institution', description: 'Classroom and auditorium audio systems' },
  { value: 'worship', label: 'Places of Worship', description: 'Sound systems for religious venues' },
  { value: 'hospitality', label: 'Hotels/Hospitality', description: 'Lobby, restaurant, and guest area audio' },
  { value: 'other', label: 'Other/Custom', description: 'Custom audio solutions for specialized needs' }
] as const

export const SPACE_SIZES = [
  { value: 'small', label: 'Small (Up to 500 sq ft)', area: 'up-to-500', description: 'Small rooms, offices, or intimate spaces' },
  { value: 'medium', label: 'Medium (500-2000 sq ft)', area: '500-2000', description: 'Medium-sized venues, restaurants, retail stores' },
  { value: 'large', label: 'Large (2000-5000 sq ft)', area: '2000-5000', description: 'Large spaces, warehouses, gyms' },
  { value: 'extra_large', label: 'Extra Large (5000+ sq ft)', area: '5000+', description: 'Very large venues, auditoriums, stadiums' }
] as const

export const INSTALLATION_ZONES = [
  { value: 'main_area', label: 'Main Area' },
  { value: 'reception', label: 'Reception/Lobby' },
  { value: 'dining', label: 'Dining Area' },
  { value: 'conference', label: 'Conference Room' },
  { value: 'outdoor', label: 'Outdoor Area' },
  { value: 'kitchen', label: 'Kitchen/Service Area' },
  { value: 'office', label: 'Office Space' },
  { value: 'storage', label: 'Storage/Back of House' },
  { value: 'bathroom', label: 'Restroom Area' },
  { value: 'other', label: 'Other Zone' }
] as const

export const EQUIPMENT_CATEGORIES = [
  { value: 'speakers', label: 'Speakers', icon: '🔊' },
  { value: 'microphones', label: 'Microphones', icon: '🎤' },
  { value: 'mixers', label: 'Mixers', icon: '🎛️' },
  { value: 'amplifiers', label: 'Amplifiers', icon: '📻' },
  { value: 'cables', label: 'Cables & Accessories', icon: '🔌' },
  { value: 'lighting', label: 'Lighting', icon: '💡' },
  { value: 'dj-equipment', label: 'DJ Equipment', icon: '🎧' },
  { value: 'recording', label: 'Recording Equipment', icon: '🎙️' },
  { value: 'power', label: 'Power & Distribution', icon: '⚡' },
  { value: 'staging', label: 'Staging & Stands', icon: '🎪' }
] as const

export const BUDGET_RANGES = [
  { value: '0-2500', label: 'Under $2,500' },
  { value: '2500-7500', label: '$2,500 - $7,500' },
  { value: '7500-15000', label: '$7,500 - $15,000' },
  { value: '15000-35000', label: '$15,000 - $35,000' },
  { value: '35000-75000', label: '$35,000 - $75,000' },
  { value: '75000+', label: '$75,000+' }
] as const

export const WARRANTY_PERIODS = [
  { value: 12, label: '1 Year Standard' },
  { value: 24, label: '2 Years Extended' },
  { value: 36, label: '3 Years Premium' },
  { value: 60, label: '5 Years Enterprise' }
] as const

export const DELIVERY_OPTIONS = [
  { value: 'standard', label: 'Standard Delivery (5-7 business days)', cost: 0 },
  { value: 'express', label: 'Express Delivery (2-3 business days)', cost: 150 },
  { value: 'next_day', label: 'Next Day Delivery', cost: 300 },
  { value: 'installation', label: 'Delivery + Professional Installation', cost: 500 }
] as const

export const PAYMENT_TERMS = [
  { value: 'full_upfront', label: 'Full Payment Upfront', discount: 0.05 },
  { value: '50_50', label: '50% Upfront, 50% on Delivery', discount: 0.02 },
  { value: '30_60_10', label: '30% Upfront, 60% on Delivery, 10% Net 30', discount: 0 },
  { value: 'net_30', label: 'Net 30 (Approved Customers Only)', discount: 0 }
] as const

export const INSTALLATION_TYPES = [
  { value: 'diy', label: 'DIY Installation (Instructions Provided)' },
  { value: 'basic', label: 'Basic Professional Installation' },
  { value: 'advanced', label: 'Advanced Installation with Tuning' },
  { value: 'full_service', label: 'Full Service Design & Installation' }
] as const

export const QUOTE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'sent', label: 'Sent', color: 'blue' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'purchased', label: 'Purchased', color: 'emerald' },
  { value: 'installed', label: 'Installed', color: 'purple' },
  { value: 'expired', label: 'Expired', color: 'yellow' }
] as const

export const DEFAULT_TAX_RATE = 0.08 // 8%

export const COMPANY_INFO = {
  name: 'Audico Solutions',
  tagline: 'Premium Audio Equipment Sales & Installation',
  description: 'We sell and install premium audio equipment for businesses, homes, and institutions. Our AI-powered consultation service helps you find the perfect audio solution for your space and needs.',
  contact: {
    email: 'sales@audico.com',
    phone: '+1 (555) 123-4567',
    address: '123 Sound Street, Audio City, AC 12345'
  },
  social: {
    website: 'https://audico.com',
    linkedin: 'https://linkedin.com/company/audico',
    instagram: 'https://instagram.com/audicoequipment'
  },
  services: {
    consultation: 'Free AI-powered consultation',
    installation: 'Professional installation services',
    warranty: 'Extended warranty options',
    support: '24/7 technical support'
  }
} as const

export const CURRENCY = 'USD'
export const CURRENCY_SYMBOL = '$'

export const QUOTE_VALIDITY_DAYS = 45
export const MAX_QUOTE_ITEMS = 100
export const MIN_ORDER_VALUE = 500
