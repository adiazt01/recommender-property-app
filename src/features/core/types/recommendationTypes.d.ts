export type RecommendationReasonKeys = typeof RECOMMENDATION_REASON_KEYS[keyof typeof RECOMMENDATION_REASON_KEYS]

export type RecommendationReasons = Partial<Record<RecommendationReasonKeys, string | number>>