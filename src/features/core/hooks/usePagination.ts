import { useMemo, useState } from "react"
import { DEFAULT_PAGE_SIZE, MIN_PAGE } from "../constants/paginationConstants"

/**
 * Custom React hook for paginating an array of items.
 *
 * @template T The type of items in the array.
 * @param items - The array of items to paginate.
 * @param pageSize - The number of items per page.
 * @returns An object containing:
 *   - `currentPage`: The current page number (1-based).
 *   - `setCurrentPage`: Function to set the current page.
 *   - `totalPages`: The total number of pages.
 *   - `paginatedItems`: The items for the current page.
 *   - `resetPage`: Function to reset the current page to 1.
 *   - `pageSize`: The number of items per page.
 *
 * @example
 * const { currentPage, setCurrentPage, totalPages, paginatedItems } = usePagination(data, 10);
 */
export function usePagination<T>(items: T[] = [], pageSize: number = DEFAULT_PAGE_SIZE) {
    const [currentPage, setCurrentPage] = useState(MIN_PAGE)

    const totalPages = useMemo(
        () => Math.ceil(items.length / pageSize),
        [items.length, pageSize]
    )

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return items.slice(start, start + pageSize)
    }, [items, currentPage, pageSize])

    const resetPage = () => setCurrentPage(1)

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        resetPage,
        pageSize,
    }
}