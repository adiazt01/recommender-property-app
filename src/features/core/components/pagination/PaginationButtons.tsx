interface PaginationButtonsProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}

export function PaginationButtons({ currentPage, setCurrentPage, totalPages }: PaginationButtonsProps) {
    const buttonsToRender = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="join gap-2">
            {totalPages > 1 && (
                <>
                    {buttonsToRender.map((button) => (
                        <button
                            key={button}
                            className={`join-item btn btn-lg ${currentPage === button ? 'btn-active' : ''}`}
                            onClick={() => setCurrentPage(button)}
                        >
                            {button}
                        </button>
                    ))}
                </>
            )}
        </div>
    )
}