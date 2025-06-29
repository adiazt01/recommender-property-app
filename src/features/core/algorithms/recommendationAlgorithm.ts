import { PRICE_BONUS, PRICE_BONUS_RANGE, PRICE_SIMILARITY_THRESHOLD, RECOMMENDATION_WEIGHTS, ROOMS_SIMILARITY_THRESHOLD, SIZE_SIMILARITY_THRESHOLD } from "@core/constants/recommendationWeightConstants"
import { ROOMS_SIMILARITY_EXACT, ROOMS_SIMILARITY_ONE_DIFF, ROOMS_SIMILARITY_OTHER, ROOMS_SIMILARITY_THREE_DIFF, ROOMS_SIMILARITY_TWO_DIFF } from "@core/constants/roomsSimilarityConstants"
import type { RecommendationResult } from "@core/interface/recommendationResultInterface"
import type { RecommendationReasons } from "@core/types/recommendationTypes"
import type { Property } from "@properties/interface/PropertyInterface"
import { RECOMMENDATION_REASON_KEYS } from "utils/recomendation.util"

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

        const priceRange = price1 * PRICE_BONUS_RANGE
        if (diff <= priceRange) {
            return Math.min(1, similarity + PRICE_BONUS)
        }

        return similarity
    }

    /**
     * Calculate the similarity between two property sizes.
     * 
     * @param size1 The size of the first property in square meters.
     * @param size2 The size of the second property in square meters.
     * @returns A number representing the similarity between the two sizes (0-1).
     */
    private calculateSizeSimilarity(size1: number, size2: number): number {
        const maxDiff = this.sizeStats.max - this.sizeStats.min
        if (maxDiff === 0) return 1

        const diff = Math.abs(size1 - size2)
        return Math.max(0, 1 - diff / maxDiff)
    }

    /** Calculate the similarity between the number of bedrooms in two properties.
     * @param rooms1 The number of bedrooms in the first property.
     * @param rooms2 The number of bedrooms in the second property.
     * @returns A number representing the similarity between the two properties' bedrooms (0-1).
     */
    private calculateRoomsSimilarity(rooms1: number, rooms2: number): number {
        const diff = Math.abs(rooms1 - rooms2)

        if (diff === 0) return ROOMS_SIMILARITY_EXACT

        if (diff === 1) return ROOMS_SIMILARITY_ONE_DIFF

        if (diff === 2) return ROOMS_SIMILARITY_TWO_DIFF

        if (diff <= 3) return ROOMS_SIMILARITY_THREE_DIFF

        return ROOMS_SIMILARITY_OTHER
    }

    /**
     * Get property recommendations based on similarity to a target property.
     * @param targetProperty The property to find recommendations for.
     * @param maxResults The maximum number of recommendations to return.
     * @returns An array of recommendation results.
     */
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

            // Final score
            const finalScore =
                locationScore * RECOMMENDATION_WEIGHTS.LOCATION +
                typeScore * RECOMMENDATION_WEIGHTS.TYPE +
                priceScore * RECOMMENDATION_WEIGHTS.PRICE +
                sizeScore * RECOMMENDATION_WEIGHTS.SIZE +
                roomsScore * RECOMMENDATION_WEIGHTS.ROOMS

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