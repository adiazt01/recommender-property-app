/**
 * Weights for each recommendation category.
 * These determine how much each attribute contributes to the final recommendation score.
 */
export const RECOMMENDATION_WEIGHTS = {
    LOCATION: 0.3,
    TYPE: 0.25,
    PRICE: 0.25,
    SIZE: 0.15,
    ROOMS: 0.05,
} as const

/**
 * Threshold for price similarity.
 */
export const PRICE_SIMILARITY_THRESHOLD = 0.7

/**
 * Threshold for size similarity.
 */
export const SIZE_SIMILARITY_THRESHOLD = 0.8

/**
 * Threshold for rooms similarity.
 */
export const ROOMS_SIMILARITY_THRESHOLD = 0.8


/**
 * Range for price similarity bonus.
 */
export const PRICE_BONUS_RANGE = 0.2

/**
 * Bonus added to price similarity if within the defined range.
 */
export const PRICE_BONUS = 0.3