import { PropertyCard } from './PropertyCard'

interface PropertiesListProps {
    properties: any[]
    selectedProperty: any
    onSelect: (property: any) => void
}

export function PropertiesList({ properties, selectedProperty, onSelect }: PropertiesListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {properties.map((property) => (
                <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={onSelect}
                    isSelected={selectedProperty?.id === property.id}
                />
            ))}
            {properties.length === 0 && (
                <div className="card bg-base-100 shadow-xl col-span-full">
                    <div className="card-body text-center">
                        <p className="opacity-70">
                            No se encontraron propiedades que coincidan con los filtros seleccionados.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}