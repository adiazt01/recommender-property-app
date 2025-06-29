import type { Property } from "../features/properties/interface/PropertyInterface";

export const RECOMMENDATION_REASON_KEYS = {
    SAME_CITY: "same_city",
    SAME_TYPE: "same_type",
    SIMILAR_PRICE: "similar_price",
    SIMILAR_SIZE: "similar_size",
    COMPATIBLE_BEDROOMS: "compatible_bedrooms",
    COMPATIBLE_PRICE_RANGE: "compatible_price_range",
    SUITABLE_SIZE: "suitable_size",
    SIMILAR_DISTRIBUTION: "similar_distribution",
    INTERESTING_OPTION: "interesting_option",
} as const

export type RecommendationReasonKeys = typeof RECOMMENDATION_REASON_KEYS[keyof typeof RECOMMENDATION_REASON_KEYS]

export type RecommendationReasons = Partial<Record<RecommendationReasonKeys, string | number>>

/**
 * Weights for each recommendation category.
 * These determine how much each attribute contributes to the final recommendation score.
 */
const RECOMMENDATION_WEIGHTS = {
    LOCATION: 0.3,
    TYPE: 0.25,
    PRICE: 0.25,
    SIZE: 0.15,
    ROOMS: 0.05,
} as const

/**
 * Threshold for price similarity.
 */
const PRICE_SIMILARITY_THRESHOLD = 0.7

/**
 * Threshold for size similarity.
 */
const SIZE_SIMILARITY_THRESHOLD = 0.8

/**
 * Threshold for rooms similarity.
 */
const ROOMS_SIMILARITY_THRESHOLD = 0.8


/**
 * Range for price similarity bonus.
 */
const PRICE_BONUS_RANGE = 0.2

/**
 * Bonus added to price similarity if within the defined range.
 */
const PRICE_BONUS = 0.3

/**
 * SmartRecommendationEngine
 * 
 * Property recommendation system based on similarity of key attributes.
 * 
 * How it works:
 * - Receives a list of properties and calculates price and size statistics for normalization.
 * - For a target property, finds the most similar properties based on:
 *   - City (location): Exact match.
 *   - Property type (type): Exact match.
 *   - Price: Normalized similarity, with a bonus if within ±20% range.
 *   - Size: Normalized similarity.
 *   - Bedrooms: Step-based similarity.
 * - Each attribute has a configurable weight in the final score.
 * - Returns an array of recommendations sorted by score, each including:
 *   - Match percentage.
 *   - Recommendation reasons as a key/value object (e.g., { same_city: "Buenos Aires" }).
 *   - Category scores.
 * 
 * @example
 * const properties = [
 *   { id: 1, title: "Property 1", city: "Buenos Aires", type: "Apartment", price: 100000, squareMeters: 50, bedrooms: 2 },
 *   { id: 2, title: "Property 2", city: "Buenos Aires", type: "Apartment", price: 120000, squareMeters: 60, bedrooms: 3 },
 *   // ... more properties
 * ];
 * const engine = new SmartRecommendationEngine(properties);
 * const targetProperty = { id: 3, title: "Target Property", city: "Buenos Aires", type: "Apartment", price: 110000, squareMeters: 55, bedrooms: 2 };
 * const recommendations = engine.getRecommendations(targetProperty);
 */
export class SmartRecommendationEngine {
    private properties: Property[]
    private priceStats: { min: number; max: number; avg: number } = { min: 0, max: 0, avg: 0 }
    private sizeStats: { min: number; max: number; avg: number } = { min: 0, max: 0, avg: 0 }

    /**
     * Create a new SmartRecommendationEngine instance.
     * @param properties Array of properties to use for recommendations.
     */
    constructor(properties: Property[]) {
        this.properties = properties
        this.calculateStats()
    }

    /**
     * Calculate statistics for price and size of properties.
     * This is used to normalize values for similarity calculations.
     * It computes:
     * - Minimum, maximum, and average price.
     * - Minimum, maximum, and average size in square meters.   
     */
    private calculateStats() {
        const prices = this.properties.map((property) => property.price)
        const sizes = this.properties.map((property) => property.squareMeters)

        this.priceStats = {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: prices.reduce((a, b) => a + b, 0) / prices.length,
        }

        this.sizeStats = {
            min: Math.min(...sizes),
            max: Math.max(...sizes),
            avg: sizes.reduce((a, b) => a + b, 0) / sizes.length,
        }
    }

    /**
     * Calculate the similarity between two property prices.
     * 
     * @param price1 The price of the first property.
     * @param price2 The price of the second property.
     * @returns A number representing the similarity between the two prices (0-1).
     */
    private calculatePriceSimilarity(price1: number, price2: number): number {
        const maxDiff = this.priceStats.max - this.priceStats.min

        if (maxDiff === 0) return 1

        const diff = Math.abs(price1 - price2)
        const similarity = Math.max(0, 1 - diff / maxDiff)

        // Bonus if within price bonus range
        const priceRange = price1 * PRICE_BONUS_RANGE
        if (diff <= priceRange) {
            return Math.min(1, similarity + PRICE_BONUS)
        }

        return similarity
    }

    // 📏 Calcular similitud de tamaño (0-1)
    private calculateSizeSimilarity(size1: number, size2: number): number {
        const maxDiff = this.sizeStats.max - this.sizeStats.min
        if (maxDiff === 0) return 1

        const diff = Math.abs(size1 - size2)
        return Math.max(0, 1 - diff / maxDiff)
    }

    // 🏠 Calcular similitud de .bedrooms (0-1)
    private calculateRoomsSimilarity(rooms1: number, rooms2: number): number {
        const diff = Math.abs(rooms1 - rooms2)

        // Perfecto match
        if (diff === 0) return 1

        // Muy similar (±1 ambiente)
        if (diff === 1) return 0.8

        // Similar (±2 .bedrooms)
        if (diff === 2) return 0.6

        // Diferente pero aceptable
        if (diff <= 3) return 0.4

        // Muy diferente
        return 0.2
    }

    // 🧮 Motor principal de recomendaciones
    public getRecommendations(targetProperty: Property, maxResults = 3): RecommendationResult[] {
        const candidates = this.properties.filter((p) => p.id !== targetProperty.id)

        const recommendations = candidates.map((candidate) => {
            // 1. Location similarity
            const locationScore = candidate.city === targetProperty.city ? 1 : 0

            // 2. Type similarity
            const typeScore = candidate.type === targetProperty.type ? 1 : 0

            // 3. Price similarity
            const priceScore = this.calculatePriceSimilarity(targetProperty.price, candidate.price)

            // 4. Size similarity
            const sizeScore = this.calculateSizeSimilarity(targetProperty.squareMeters, candidate.squareMeters)

            // 5. Bedrooms similarity
            const roomsScore = this.calculateRoomsSimilarity(targetProperty.bedrooms, candidate.bedrooms)

            // Use weights from constants
            const weights = RECOMMENDATION_WEIGHTS

            // Final score
            const finalScore =
                locationScore * weights.LOCATION +
                typeScore * weights.TYPE +
                priceScore * weights.PRICE +
                sizeScore * weights.SIZE +
                roomsScore * weights.ROOMS

            // Reasons as key/value object using constants
            const reasons: RecommendationReasons = {}

            if (locationScore === 1) {
                reasons[RECOMMENDATION_REASON_KEYS.SAME_CITY] = candidate.city
            }

            if (typeScore === 1) {
                reasons[RECOMMENDATION_REASON_KEYS.SAME_TYPE] = candidate.type
            }

            if (priceScore > PRICE_SIMILARITY_THRESHOLD) {
                reasons[RECOMMENDATION_REASON_KEYS.SIMILAR_PRICE] = candidate.price
            }

            if (sizeScore > SIZE_SIMILARITY_THRESHOLD) {
                reasons[RECOMMENDATION_REASON_KEYS.SIMILAR_SIZE] = candidate.squareMeters
            }

            if (roomsScore >= ROOMS_SIMILARITY_THRESHOLD) {
                reasons[RECOMMENDATION_REASON_KEYS.COMPATIBLE_BEDROOMS] = candidate.bedrooms
            }

            // If no specific reasons, add the best feature
            if (Object.keys(reasons).length === 0) {
                const scores = { locationScore, typeScore, priceScore, sizeScore, roomsScore } as const
                type ScoreKey = keyof typeof scores
                const bestFeature = (Object.keys(scores) as ScoreKey[]).reduce((a, b) =>
                    scores[a] > scores[b] ? a : b
                )

                switch (bestFeature) {
                    case "priceScore":
                        reasons[RECOMMENDATION_REASON_KEYS.COMPATIBLE_PRICE_RANGE] = candidate.price
                        break
                    case "sizeScore":
                        reasons[RECOMMENDATION_REASON_KEYS.SUITABLE_SIZE] = candidate.squareMeters
                        break
                    case "roomsScore":
                        reasons[RECOMMENDATION_REASON_KEYS.SIMILAR_DISTRIBUTION] = candidate.bedrooms
                        break
                    default:
                        reasons[RECOMMENDATION_REASON_KEYS.INTERESTING_OPTION] = ""
                }
            }

            return {
                property: candidate,
                score: finalScore,
                matchPercentage: Math.round(finalScore * 100),
                reasons,
                categoryScores: {
                    location: Math.round(locationScore * 100),
                    type: Math.round(typeScore * 100),
                    price: Math.round(priceScore * 100),
                    size: Math.round(sizeScore * 100),
                    rooms: Math.round(roomsScore * 100),
                },
            }
        })

        // Ordenar por score y retornar top resultados
        return recommendations.sort((a, b) => b.score - a.score).slice(0, maxResults)
    }

    // 📊 Obtener estadísticas del mercado
    public getMarketStats(targetProperty: Property) {
        const sameCity = this.properties.filter((p) => p.city === targetProperty.city)
        const sameType = this.properties.filter((p) => p.type === targetProperty.type)

        return {
            totalProperties: this.properties.length,
            cityStats: {
                count: sameCity.length,
                avgPrice: Math.round(sameCity.reduce((sum, p) => sum + p.price, 0) / sameCity.length),
                pricePosition:
                    targetProperty.price > sameCity.reduce((sum, p) => sum + p.price, 0) / sameCity.length ? "above" : "below",
            },
            typeStats: {
                count: sameType.length,
                avgPrice: Math.round(sameType.reduce((sum, p) => sum + p.price, 0) / sameType.length),
            },
        }
    }
}

// Remove duplicated RECOMMENDATION_WEIGHTS and threshold constants below this line

// Define las keys posibles para las razones

interface RecommendationResult {
    property: Property
    score: number
    matchPercentage: number
    reasons: RecommendationReasons
    categoryScores: {
        location: number
        type: number
        price: number
        size: number
        rooms: number
    }
}