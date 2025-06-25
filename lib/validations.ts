
import { z } from 'zod'

export const clientInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export const eventDetailsSchema = z.object({
  type: z.string().min(1, 'Event type is required'),
  date: z.date().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 hour').max(48, 'Duration cannot exceed 48 hours'),
  guestCount: z.number().min(1, 'Guest count must be at least 1').max(10000, 'Guest count cannot exceed 10,000'),
  budget: z.number().optional(),
})

export const roomConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Room name is required'),
  type: z.string().min(1, 'Room type is required'),
  dimensions: z.object({
    length: z.number().min(1, 'Length must be positive'),
    width: z.number().min(1, 'Width must be positive'),
    height: z.number().min(1, 'Height must be positive'),
  }),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  acoustics: z.object({
    reverberation: z.enum(['low', 'medium', 'high']),
    ambientNoise: z.enum(['quiet', 'moderate', 'loud']),
    soundIsolation: z.boolean(),
  }),
})

export const venueSpecSchema = z.object({
  venueType: z.string().min(1, 'Venue type is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  rooms: z.array(roomConfigSchema).min(1, 'At least one room is required'),
  acoustics: z.object({
    reverberation: z.enum(['low', 'medium', 'high']),
    ambientNoise: z.enum(['quiet', 'moderate', 'loud']),
    soundIsolation: z.boolean(),
  }),
  specialRequirements: z.array(z.string()).default([]),
})

export const selectedEquipmentSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  room: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  customPrice: z.number().optional(),
})

export const quoteBuilderSchema = z.object({
  clientInfo: clientInfoSchema,
  eventDetails: eventDetailsSchema,
  venueSpec: venueSpecSchema,
  selectedEquipment: z.array(selectedEquipmentSchema).default([]),
})

export const equipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  description: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  basePrice: z.number().min(0, 'Price must be non-negative'),
  categoryId: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  model: z.string().optional(),
  powerRating: z.number().optional(),
  frequency: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  connectivity: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  availability: z.boolean().default(true),
  minQuantity: z.number().min(1).default(1),
  maxQuantity: z.number().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
})

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  formType: z.string().default('general'),
})

export const pricelistSchema = z.object({
  name: z.string().min(1, 'Pricelist name is required'),
  description: z.string().optional(),
  version: z.string().default('1.0'),
  isActive: z.boolean().default(true),
  markups: z.record(z.number()).optional(),
  discounts: z.record(z.number()).optional(),
  validFrom: z.date().default(() => new Date()),
  validUntil: z.date().optional(),
})

export const equipmentFiltersSchema = z.object({
  categoryId: z.string().optional(),
  priceRange: z.tuple([z.number(), z.number()]).optional(),
  powerRange: z.tuple([z.number(), z.number()]).optional(),
  brands: z.array(z.string()).optional(),
  availability: z.boolean().optional(),
  search: z.string().optional(),
})

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export type ClientInfoInput = z.infer<typeof clientInfoSchema>
export type EventDetailsInput = z.infer<typeof eventDetailsSchema>
export type RoomConfigInput = z.infer<typeof roomConfigSchema>
export type VenueSpecInput = z.infer<typeof venueSpecSchema>
export type SelectedEquipmentInput = z.infer<typeof selectedEquipmentSchema>
export type QuoteBuilderInput = z.infer<typeof quoteBuilderSchema>
export type EquipmentInput = z.infer<typeof equipmentSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type PricelistInput = z.infer<typeof pricelistSchema>
export type EquipmentFiltersInput = z.infer<typeof equipmentFiltersSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
