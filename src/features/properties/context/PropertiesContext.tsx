import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { getProperties } from '../../properties/services/propertyService'
import { SmartRecommendationEngine } from '../../../utils/recomendation.util'
import { usePagination } from '../../../features/core/hooks/usePagination'
import { usePropertyFilters } from '../hooks/usePropertiesFilters'
import type { Property } from '../interface/PropertyInterface'

interface PropertiesContextProps {
  properties: Property[]
  filteredProperties: Property[]
  searchTerm: string
  setSearchTerm: (v: string) => void
  cityFilter: string
  setCityFilter: (v: string) => void
  typeFilter: string
  setTypeFilter: (v: string) => void
  cities: string[]
  types: string[]
  selectedProperty: Property | null
  setSelectedProperty: (p: Property | null) => void
  clearFilters: () => void
  currentPage: number
  setCurrentPage: (n: number) => void
  paginatedItems: Property[]
  totalPages: number
  recommendationEngine: SmartRecommendationEngine
}

const PropertiesContext = createContext<PropertiesContextProps | undefined>(undefined)

export function PropertiesProvider({ children }: { children: React.ReactNode }) {
  const [properties] = useState<Property[]>(getProperties())
  const {
    filteredProperties,
    searchTerm,
    setSearchTerm,
    cityFilter,
    setCityFilter,
    typeFilter,
    setTypeFilter,
    cities,
    types,
    selectedProperty,
    setSelectedProperty,
    clearFilters,
  } = usePropertyFilters({ properties })

  const {
    currentPage,
    setCurrentPage,
    resetPage,
    paginatedItems,
    totalPages
  } = usePagination<Property>(filteredProperties)

  useEffect(() => {
    resetPage()
  }, [searchTerm, cityFilter, typeFilter])

  const recommendationEngine = useMemo(() => {
    return new SmartRecommendationEngine(filteredProperties)
  }, [filteredProperties])

  const value = {
    properties,
    filteredProperties,
    searchTerm,
    setSearchTerm,
    cityFilter,
    setCityFilter,
    typeFilter,
    setTypeFilter,
    cities,
    types,
    selectedProperty,
    setSelectedProperty,
    clearFilters,
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalPages,
    recommendationEngine
  }

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  )
}

export function usePropertiesContext() {
  const ctx = useContext(PropertiesContext)

  if (!ctx) throw new Error('usePropertiesContext must be used within a PropertiesProvider')
  
    return ctx
}
