import type { RecommendationReasons } from "@core/types/recommendationTypes"
import type { Property } from "@properties/interface/PropertyInterface"

export interface RecommendationResult {
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