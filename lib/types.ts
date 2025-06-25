
import { Equipment, Category, Quote, QuoteItem, Client, Installation, Pricelist, ContactForm } from '@prisma/client'

// Extended types with relations
export type EquipmentWithCategory = Equipment & {
  category: Category
}

export type QuoteWithDetails = Quote & {
  client: Client
  installation: Installation | null
  items: (QuoteItem & {
    equipment: EquipmentWithCategory
  })[]
}

export type QuoteItemWithEquipment = QuoteItem & {
  equipment: EquipmentWithCategory
}

// Sales-focused form types
export interface UsageSpecification {
  usageType: string
  spaceSize: string
  spaceDetails: {
    primaryUse: string
    ambientNoiseLevel: 'quiet' | 'moderate' | 'loud'
    existingAudio: boolean
    powerAvailable: boolean
    installationComplexity: 'simple' | 'moderate' | 'complex'
  }
  requirements: string[]
}

export interface InstallationRequirements {
  installationType: string
  timeframe: string
  professionalInstallation: boolean
  existingInfrastructure: boolean
  specialRequirements: string[]
}

export interface PurchasePreferences {
  warrantyPeriod: number
  deliveryOption: string
  paymentTerms: string
  installationServices: boolean
}

export interface QuoteBuilderData {
  clientInfo: {
    name: string
    email: string
    phone?: string
    company?: string
  }
  usageDetails: {
    usageType: string
    spaceSize?: string
    budget?: number
    timeframe?: string
  }
  usageSpec: UsageSpecification
  installationReqs?: InstallationRequirements
  purchasePrefs?: PurchasePreferences
  selectedEquipment: SelectedEquipment[]
  aiConversation?: AIConversationEntry[]
  aiRecommendations?: AIRecommendation[]
  liveQuote?: LiveQuote
}

export interface SelectedEquipment {
  equipmentId: string
  quantity: number
  installationZone?: string
  specifications?: any
  customPrice?: number
  warrantyOption?: number
}

export interface AIConversationEntry {
  type: 'question' | 'answer' | 'recommendation' | 'clarification' | 'quote_update'
  content: string
  timestamp: Date
  metadata?: any
}

export interface LiveQuote {
  items: LiveQuoteItem[]
  subtotal: number
  tax: number
  total: number
  lastUpdated: Date
  isUpdating?: boolean
}

export interface LiveQuoteItem {
  equipmentId: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  totalPrice: number
  reasoning?: string
  isNew?: boolean
  isUpdated?: boolean
}

export interface QuoteUpdate {
  action: 'add' | 'remove' | 'update' | 'replace'
  items: LiveQuoteItem[]
  newTotal?: number
  explanation?: string
}

export interface AIRecommendation {
  category: string
  equipment: Array<{
    id: string
    name: string
    quantity: number
    installationZone?: string
    reasoning: string
    estimatedPrice: number
  }>
  reasoning: string
  confidence: number
  alternatives?: EquipmentWithCategory[]
  totalEstimate?: number
  installationNotes?: string
}

export interface QuotePDF {
  quoteNumber: string
  client: Client
  installation?: Installation
  items: QuoteItemWithEquipment[]
  subtotal: number
  tax: number
  total: number
  validUntil?: Date
  warrantyPeriod?: number
  deliveryOptions?: any
  paymentTerms?: any
  installationServices?: boolean
  notes?: string
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Admin Dashboard types
export interface DashboardStats {
  totalQuotes: number
  totalClients: number
  totalRevenue: number
  recentQuotes: Quote[]
  popularEquipment: (Equipment & { usageCount: number })[]
}

// Equipment filter types
export interface EquipmentFilters {
  categoryId?: string
  priceRange?: [number, number]
  powerRange?: [number, number]
  brands?: string[]
  availability?: boolean
  search?: string
}

export type { Equipment, Category, Quote, QuoteItem, Client, Installation, Pricelist, ContactForm }

// Additional exports for pagination
export interface PaginationInput {
  page: number
  limit: number
}
