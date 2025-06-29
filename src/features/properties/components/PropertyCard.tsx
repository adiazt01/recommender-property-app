import type { Property } from "../interface/PropertyInterface"
import placeholder from "../../../assets/placeholder.svg"
import { Bed, MapPin, Ruler } from "lucide-react";

interface PropertyProps {
    property: Property,
    onSelect: (property: Property) => void,
    isSelected: boolean
}

export function PropertyCard({ property, onSelect, isSelected }: PropertyProps) {
    return (
        <article
            className={`card bg-base-100 shadow-sm cursor-pointer transition-all hover:shadow-2xl ${isSelected ? "ring-2 ring-primary" : ""
                }`}
            onClick={() => onSelect(property)}
        >
            <figure className="aspect-video relative">
                <img
                    src={property.image || placeholder}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== placeholder) {
                            target.src = placeholder;
                        }
                    }}
                />
            </figure>
            <section className="card-body">
                <p className="card-title text-xl truncate">{property.title}</p>
                <div className="flex flex-row  gap-3 flex-wrap">
                    <div className="flex flex-row gap-1 text-lg opacity-70">
                        <MapPin />
                        {property.city}
                    </div>
                    <div className="flex flex-row gap-1 text-lg opacity-70">
                        <Bed />
                        {property.bedrooms} amb.
                    </div>
                    <div className="flex flex-row gap-1 text-lg opacity-70">
                        <Ruler />
                        {property.squareMeters} m²
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="badge badge-lg badge-primary">{property.type}</div>
                    <span className="text-2xl font-bold text-success">${property.price.toLocaleString()}</span>
                </div>
            </section>
        </article>
    )
}