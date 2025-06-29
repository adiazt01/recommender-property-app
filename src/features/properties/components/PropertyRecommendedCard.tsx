import type { RecommendationResult } from "@core/interface/recommendationResultInterface"

interface PropertyRecommendedProps {
    propertyRecommended: RecommendationResult
}

export function PropertyRecommendedCard({
    propertyRecommended
}: PropertyRecommendedProps) {
    const { categoryScores, matchPercentage, property, reasons } = propertyRecommended
    return (
        <article className="card card-border shadow-sm">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <p className="card-title">{property.title}</p>
                    <div className="ml-2 flex flex-col items-end gap-1">
                        <div className="badge badge-primary">{matchPercentage}%</div>
                    </div>
                </div>

                {/* Breakdown de scores */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                        <span>📍 Ubicación:</span>
                        <span className="font-mono">{categoryScores.location}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>🏠 Tipo:</span>
                        <span className="font-mono">{categoryScores.type}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>💰 Precio:</span>
                        <span className="font-mono">{categoryScores.price}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>📐 Tamaño:</span>
                        <span className="font-mono">{categoryScores.size}%</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-base-300">
                    <span className="font-bold text-success">
                        {property.price != null ? `$${property.price.toLocaleString()}` : "N/D"}
                    </span>
                    <div className="flex gap-2 text-xs opacity-70">
                        <span>{property.bedrooms} amb.</span>
                        <span>{property.squareMeters} m²</span>
                    </div>
                </div>
            </div>
        </article>
    )
}