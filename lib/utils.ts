
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function generateQuoteNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `QT-${timestamp}-${random}`
}

export function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return subtotal * taxRate
}

export function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`
  } else if (hours === 1) {
    return '1 hour'
  } else if (hours % 1 === 0) {
    return `${hours} hours`
  } else {
    const wholeHours = Math.floor(hours)
    const minutes = Math.round((hours % 1) * 60)
    return `${wholeHours}h ${minutes}m`
  }
}

export function getVenueTypeIcon(venueType: string): string {
  const icons: Record<string, string> = {
    'club': '🎵',
    'restaurant': '🍴',
    'corporate': '🏢',
    'wedding': '💒',
    'conference': '📊',
    'theater': '🎭',
    'outdoor': '🌳',
    'sports': '⚽',
    'retail': '🛍️',
    'default': '🎤'
  }
  return icons[venueType.toLowerCase()] || icons.default
}

export function getEventTypeColor(eventType: string): string {
  const colors: Record<string, string> = {
    'wedding': 'bg-pink-100 text-pink-800',
    'corporate': 'bg-blue-100 text-blue-800',
    'party': 'bg-purple-100 text-purple-800',
    'conference': 'bg-green-100 text-green-800',
    'concert': 'bg-yellow-100 text-yellow-800',
    'default': 'bg-gray-100 text-gray-800'
  }
  return colors[eventType.toLowerCase()] || colors.default
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'draft': 'bg-gray-100 text-gray-800',
    'sent': 'bg-blue-100 text-blue-800',
    'accepted': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'expired': 'bg-yellow-100 text-yellow-800'
  }
  return colors[status.toLowerCase()] || colors.draft
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''))
}

export function getEquipmentPowerColor(powerRating: number): string {
  if (powerRating < 100) return 'text-green-600'
  if (powerRating < 500) return 'text-yellow-600'
  if (powerRating < 1000) return 'text-orange-600'
  return 'text-red-600'
}

export function calculateVenueArea(length: number, width: number): number {
  return length * width
}

export function getRecommendedPowerPerPerson(venueType: string): number {
  const powerMap: Record<string, number> = {
    'club': 15, // watts per person
    'restaurant': 3,
    'corporate': 5,
    'wedding': 8,
    'conference': 4,
    'theater': 6,
    'outdoor': 20,
    'sports': 25
  }
  return powerMap[venueType.toLowerCase()] || 8
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}
