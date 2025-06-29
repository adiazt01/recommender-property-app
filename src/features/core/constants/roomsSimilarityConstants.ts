
/**
 * Constants representing similarity scores for comparing the number of rooms between properties.
 *
 * - `ROOMS_SIMILARITY_EXACT`: Similarity score when the number of rooms is exactly the same.
 * - `ROOMS_SIMILARITY_ONE_DIFF`: Similarity score when the number of rooms differs by one.
 * - `ROOMS_SIMILARITY_TWO_DIFF`: Similarity score when the number of rooms differs by two.
 * - `ROOMS_SIMILARITY_THREE_DIFF`: Similarity score when the number of rooms differs by three.
 * - `ROOMS_SIMILARITY_OTHER`: Similarity score for all other differences in the number of rooms.
 */

export const ROOMS_SIMILARITY_EXACT = 1

export const ROOMS_SIMILARITY_ONE_DIFF = 0.8

export const ROOMS_SIMILARITY_TWO_DIFF = 0.6

export const ROOMS_SIMILARITY_THREE_DIFF = 0.4

export const ROOMS_SIMILARITY_OTHER = 0.2