'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EventFiltersProps {
  onSearchChange?: (value: string) => void
  onCategoryChange?: (value: string) => void
  onSortChange?: (value: string) => void
}

export function EventFilters({
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: EventFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Búsqueda */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar eventos..."
          className="pl-10"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Categoría */}
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="musica">Música</SelectItem>
          <SelectItem value="deportes">Deportes</SelectItem>
          <SelectItem value="comedia">Comedia</SelectItem>
          <SelectItem value="teatro">Teatro</SelectItem>
        </SelectContent>
      </Select>

      {/* Ordenar */}
      <Select onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fecha">Fecha</SelectItem>
          <SelectItem value="precio_asc">Precio: Menor a Mayor</SelectItem>
          <SelectItem value="precio_desc">Precio: Mayor a Menor</SelectItem>
          <SelectItem value="popularidad">Popularidad</SelectItem>
        </SelectContent>
      </Select>

      {/* Filtros avanzados */}
      <Button variant="outline" size="icon">
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}
