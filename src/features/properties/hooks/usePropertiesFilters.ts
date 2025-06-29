import { useMemo, useState } from "react"
import type { Property } from "../interface/PropertyInterface"

interface UsePropertyFiltersProps {
    properties: Property[]
}

export function usePropertyFilters(
    {
        properties = []
    }: UsePropertyFiltersProps
) {
    const [searchTerm, setSearchTerm] = useState("")
    const [cityFilter, setCityFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

    const filteredProperties = useMemo(() => {
        return properties.filter((property) => {
            const matchesSearch =
                property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.city.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCity = cityFilter === "all" || property.city === cityFilter
            const matchesType = typeFilter === "all" || property.type === typeFilter
            return matchesSearch && matchesCity && matchesType
        })
    }, [properties, searchTerm, cityFilter, typeFilter])

    const cities = useMemo(() => {
        return Array.from(new Set(properties.map((p) => p.city))).sort()
    }, [properties])

    const types = useMemo(() => {
        return Array.from(new Set(properties.map((p) => p.type))).sort()
    }, [properties])

    const clearFilters = () => {
        setSearchTerm("")
        setCityFilter("all")
        setTypeFilter("all")
        setSelectedProperty(null)
    }

    return {
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
    }
}