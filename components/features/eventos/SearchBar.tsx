/**
 * SearchBar con debounce para búsqueda de eventos
 */

'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  onSearch,
  placeholder = 'Buscar eventos, artistas, lugares...',
  debounceMs = 500
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, onSearch])

  return (
    <div className="flex-1 flex items-center gap-2 px-3 bg-white">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 py-2 text-gray-900 placeholder-gray-400 focus:outline-none"
      />
    </div>
  )
}
