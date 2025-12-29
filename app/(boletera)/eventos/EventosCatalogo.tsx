/**
 * Componente cliente para catálogo de eventos
 * Maneja búsqueda, filtros y paginación
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { collection, query, where, orderBy, limit, getDocs, startAfter, QueryDocumentSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { Evento } from '@/types'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { PublicFooter } from '@/components/landing/PublicFooter'
import { SearchBar } from '@/components/features/eventos/SearchBar'
import { CategoryTags } from '@/components/features/eventos/CategoryTags'
import { EventosGrid } from '@/components/features/eventos/EventosGrid'
import { Pagination } from '@/components/features/eventos/Pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ITEMS_PER_PAGE = 9

export function EventosCatalogo() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('fecha')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null)

  // Fetch eventos desde Firestore
  const fetchEventos = useCallback(async (pageNumber: number = 1) => {
    setLoading(true)
    try {
      const eventosRef = collection(db!, 'eventos')
      let q = query(eventosRef, where('status', '==', 'publicado'))

      // Aplicar filtro de categoría
      if (selectedCategory) {
        q = query(q, where('categoria', '==', selectedCategory))
      }

      // Aplicar ordenamiento
      switch (sortBy) {
        case 'fecha':
          q = query(q, orderBy('fecha', 'asc'))
          break
        case 'precio_asc':
          q = query(q, orderBy('precioMinimo', 'asc'))
          break
        case 'precio_desc':
          q = query(q, orderBy('precioMinimo', 'desc'))
          break
        case 'recientes':
          q = query(q, orderBy('createdAt', 'desc'))
          break
        default:
          q = query(q, orderBy('fecha', 'asc'))
      }

      // Paginación
      q = query(q, limit(ITEMS_PER_PAGE))

      if (pageNumber > 1 && lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const snapshot = await getDocs(q)
      const eventosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Evento[]

      // Aplicar filtro de búsqueda en cliente (Firestore no soporta LIKE)
      let filteredEventos = eventosData
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase()
        filteredEventos = eventosData.filter(
          (evento) =>
            evento.titulo.toLowerCase().includes(lowerQuery) ||
            evento.descripcion?.toLowerCase().includes(lowerQuery) ||
            evento.venue?.nombre?.toLowerCase().includes(lowerQuery)
        )
      }

      setEventos(filteredEventos)
      setTotalCount(filteredEventos.length)

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      }
    } catch (error) {
      console.error('Error fetching eventos:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, sortBy, searchQuery, lastDoc])

  useEffect(() => {
    fetchEventos(currentPage)
  }, [selectedCategory, sortBy])

  useEffect(() => {
    // Resetear a página 1 cuando cambia la búsqueda
    if (currentPage !== 1) {
      setCurrentPage(1)
      setLastDoc(null)
    }
    fetchEventos(1)
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setLastDoc(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchEventos(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />

      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">Descubre Eventos Increíbles</h1>
          <p className="text-lg opacity-90 mb-6">
            Encuentra y compra tickets para los mejores eventos en tu ciudad
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl bg-white rounded-lg shadow-lg p-2">
            <div className="flex flex-col md:flex-row gap-2">
              <SearchBar onSearch={handleSearch} />
              <div className="flex gap-2">
                <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                  <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value="concierto">Conciertos</SelectItem>
                    <SelectItem value="festival">Festivales</SelectItem>
                    <SelectItem value="deportivo">Deportes</SelectItem>
                    <SelectItem value="teatro">Teatro</SelectItem>
                    <SelectItem value="conferencia">Conferencias</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Todos los Eventos</h2>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{totalCount} eventos encontrados</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recientes">Más recientes</SelectItem>
                <SelectItem value="fecha">Fecha más próxima</SelectItem>
                <SelectItem value="precio_asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="precio_desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tags */}
        <div className="mb-6">
          <CategoryTags
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Events Grid */}
        <EventosGrid eventos={eventos} loading={loading} />

        {/* Pagination */}
        {!loading && eventos.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasNextPage={currentPage < totalPages}
            hasPrevPage={currentPage > 1}
          />
        )}
      </div>
          
      <PublicFooter />
    </div>
  )
}
