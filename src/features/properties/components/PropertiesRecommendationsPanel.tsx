import { useMemo } from "react"
import { usePropertiesContext } from "../context/PropertiesContext"
import { PropertyRecommendedCard } from "./PropertyRecommendedCard"

export function PropertiesRecommendationsPanel() {
  const { selectedProperty, recommendationEngine } = usePropertiesContext()

  const recommendations = useMemo(() => {
    if (!selectedProperty || !recommendationEngine) return []
    return recommendationEngine.getRecommendations(selectedProperty, 3)
  }, [selectedProperty, recommendationEngine])

  const marketStats = useMemo(() => {
    if (!selectedProperty || !recommendationEngine) return null
    return recommendationEngine.getMarketStats(selectedProperty)
  }, [selectedProperty, recommendationEngine])

  if (!selectedProperty || recommendations.length === 0) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">🎯 Recomendaciones Inteligentes</h2>
          <p className="opacity-70">Selecciona una propiedad para ver recomendaciones similares</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="badge badge-primary badge-sm">Smart</div>
              <span>Algoritmo de similitud optimizado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-secondary badge-sm">Weighted</div>
              <span>Scoring ponderado por importancia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-accent badge-sm">Explained</div>
              <span>Recomendaciones explicables</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Panel de recomendaciones */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">🎯 Propiedades Similares</h2>
          <p className="opacity-70 text-sm">Basado en: {selectedProperty.title}</p>

          <div className="space-y-4 mt-4">
            {recommendations.map((rec, index) => (
              <PropertyRecommendedCard
                key={index}
                propertyRecommended={rec}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats del mercado */}
      {marketStats && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📊 Contexto de Mercado</h2>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">En {selectedProperty.city}</div>
                <div className="stat-value text-lg">{marketStats.cityStats.count}</div>
                <div className="stat-desc">propiedades disponibles</div>
              </div>
            </div>
            <div className="text-sm mt-2">
              <p>
                💰 Precio promedio en {selectedProperty.city}:{" "}
                <strong>
                  {marketStats.cityStats.avgPrice != null
                    ? `$${marketStats.cityStats.avgPrice.toLocaleString()}`
                    : "N/D"}
                </strong>
              </p>
              <p className={marketStats.cityStats.pricePosition === "above" ? "text-warning" : "text-success"}>
                Esta propiedad está{" "}
                <strong>{marketStats.cityStats.pricePosition === "above" ? "por encima" : "por debajo"}</strong> del
                promedio
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}