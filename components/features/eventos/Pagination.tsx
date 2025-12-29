/**
 * Pagination component con Firestore cursor support
 */

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Mostrar primera página
      pages.push(1)

      // Calcular rango
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar si estamos cerca del inicio
      if (currentPage <= 3) {
        end = 4
      }

      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3
      }

      // Agregar ellipsis izquierda si es necesario
      if (start > 2) {
        pages.push('...')
      }

      // Agregar páginas del medio
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Agregar ellipsis derecha si es necesario
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Mostrar última página
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage || currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {renderPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={index}
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => onPageChange(page)}
            className="min-w-[2.5rem]"
          >
            {page}
          </Button>
        ) : (
          <span key={index} className="px-3 text-gray-500">
            {page}
          </span>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  )
}
