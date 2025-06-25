
'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { EquipmentCard } from './equipment-card'
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react'
import { EQUIPMENT_CATEGORIES } from '@/lib/constants'
import type { EquipmentWithCategory, EquipmentFilters } from '@/lib/types'

export function EquipmentCatalog() {
  const [equipment, setEquipment] = useState<EquipmentWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<EquipmentFilters>({
    search: '',
    categoryId: '',
    availability: true,
    priceRange: undefined,
    brands: [],
  })
  
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [brands, setBrands] = useState<string[]>([])

  useEffect(() => {
    fetchEquipment()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchEquipment()
  }, [filters])

  const fetchEquipment = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId)
      if (filters.availability !== undefined) {
        queryParams.append('availability', filters.availability.toString())
      }
      if (filters.priceRange) {
        queryParams.append('minPrice', filters.priceRange[0].toString())
        queryParams.append('maxPrice', filters.priceRange[1].toString())
      }

      const response = await fetch(`/api/equipment?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setEquipment(data.data || [])
        
        // Extract unique brands
        const uniqueBrands = Array.from(new Set(
          data.data
            ?.filter((item: any) => item.brand)
            .map((item: any) => item.brand as string)
        )) as string[]
        setBrands(uniqueBrands)
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const updateFilters = (newFilters: Partial<EquipmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      availability: true,
      priceRange: undefined,
      brands: [],
    })
  }

  const activeFilterCount = Object.values(filters).filter(value => 
    value !== '' && value !== undefined && value !== true && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search equipment..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Category Filter */}
          <Select 
            value={filters.categoryId || 'all'} 
            onValueChange={(value) => updateFilters({ categoryId: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-full lg:w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Availability Filter */}
          <Select 
            value={filters.availability?.toString() || 'all'} 
            onValueChange={(value) => updateFilters({ 
              availability: value === 'all' ? undefined : value === 'true' 
            })}
          >
            <SelectTrigger className="w-full lg:w-40 bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700">
            <span className="text-sm text-slate-400">Active filters:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{filters.search}"
                </Badge>
              )}
              {filters.categoryId && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {categories.find(c => c.id === filters.categoryId)?.name}
                </Badge>
              )}
              {filters.availability === false && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-400 hover:text-white"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-slate-300">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading equipment...
            </div>
          ) : (
            <span>{equipment.length} items found</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
          </span>
        </div>
      </div>

      {/* Equipment Grid/List */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-effect p-4 rounded-xl animate-pulse">
              <div className="aspect-video bg-slate-700 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
                <div className="h-6 bg-slate-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : equipment.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {equipment.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onAdd={(quantity, room) => {
                console.log('Add to cart:', item.name, quantity, room)
                // This would typically integrate with a cart system
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No equipment found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
