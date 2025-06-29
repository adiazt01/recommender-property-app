import { PaginationButtons } from '../../core/components/pagination/PaginationButtons'
import { usePropertiesContext } from '../context/PropertiesContext'
import { PropertiesList } from './PropertiesList'

export function PropertiesListContainer() {
    const {
        paginatedItems,
        selectedProperty,
        setSelectedProperty,
        currentPage,
        setCurrentPage,
        totalPages
    } = usePropertiesContext()

    return (
        <>
            <PropertiesList
                properties={paginatedItems}
                selectedProperty={selectedProperty}
                onSelect={setSelectedProperty}
            />
            <PaginationButtons 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    )
}