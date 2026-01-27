'use client'

import { useState, useEffect, useMemo } from 'react'
import { RequireAdmin } from '@/components/auth/RequireRole'
import { useAuthStore } from '@/lib/stores/authStore'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import EventCard from '@/components/eventos/EventCard'
import { Ticket, Activity, TrendingUp, DollarSign, Grid3X3, List, Search } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Evento, Orden } from '@/types'
import { useRouter } from 'next/navigation'

type FilterType = 'all' | 'active' | 'upcoming' | 'past'
type ViewType = 'grid' | 'list'

interface EventoConStats extends Evento {
  ticketsVendidos: number
  ingresos: number
}

export default function EventosAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userProfile } = useAuthStore()
  const router = useRouter()

  // Estados
  const [eventos, setEventos] = useState<Evento[]>([])
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [viewType, setViewType] = useState<ViewType>('grid')

  const userName = userProfile?.nombre || 'Usuario'

  // Listener en tiempo real para eventos
  useEffect(() => {
    if (!db) return

    const eventosRef = collection(db, 'eventos')
    const q = query(eventosRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Evento[]
        setEventos(eventosData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching eventos:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Listener en tiempo real para órdenes (para calcular stats)
  useEffect(() => {
    if (!db) return

    const ordenesRef = collection(db, 'ordenes')
    const q = query(ordenesRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordenesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Orden[]
        setOrdenes(ordenesData)
      },
      (error) => {
        console.error('Error fetching ordenes:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  // Calcular stats por evento
  const eventosConStats: EventoConStats[] = useMemo(() => {
    return eventos.map((evento) => {
      const ordenesEvento = ordenes.filter(
        (o) => o.eventoId === evento.id && o.estado === 'pagada'
      )

      const ticketsVendidos = ordenesEvento.reduce(
        (sum, orden) => sum + orden.items.reduce((s, item) => s + item.cantidad, 0),
        0
      )

      const ingresos = ordenesEvento.reduce((sum, orden) => sum + orden.total, 0)

      return {
        ...evento,
        ticketsVendidos,
        ingresos,
      }
    })
  }, [eventos, ordenes])

  // Filtrar eventos
  const eventosFiltrados = useMemo(() => {
    const now = new Date()
    let filtered = eventosConStats

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.titulo.toLowerCase().includes(term) ||
          e.descripcion?.toLowerCase().includes(term) ||
          e.venue?.nombre?.toLowerCase().includes(term)
      )
    }

    // Filtro por estado/fecha
    if (filterType === 'active') {
      filtered = filtered.filter((e) => {
        const estado = e.estado || e.status
        return estado === 'publicado'
      })
    } else if (filterType === 'upcoming') {
      filtered = filtered.filter((e) => {
        const fecha = e.fecha instanceof Date ? e.fecha : e.fecha?.toDate?.() || new Date()
        return fecha >= now
      })
    } else if (filterType === 'past') {
      filtered = filtered.filter((e) => {
        const fecha = e.fecha instanceof Date ? e.fecha : e.fecha?.toDate?.() || new Date()
        return fecha < now
      })
    }

    return filtered
  }, [eventosConStats, searchTerm, filterType])

  // Calcular stats totales
  const stats = useMemo(() => {
    const totalEventos = eventos.length
    const eventosActivos = eventos.filter((e) => {
      const estado = e.estado || e.status
      return estado === 'publicado'
    }).length

    const totalTicketsVendidos = eventosConStats.reduce((sum, e) => sum + e.ticketsVendidos, 0)
    const totalIngresos = eventosConStats.reduce((sum, e) => sum + e.ingresos, 0)

    return {
      totalEventos,
      eventosActivos,
      totalTicketsVendidos,
      totalIngresos,
    }
  }, [eventos, eventosConStats])

  // Handlers
  const handleEdit = (id: string) => {
    router.push(`/admin/eventos/${id}/editar`)
  }

  const handleDelete = async (id: string) => {
    if (!db) return
    if (!confirm('¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) return

    try {
      await deleteDoc(doc(db, 'eventos', id))
    } catch (error) {
      console.error('Error deleting evento:', error)
      alert('Error al eliminar evento')
    }
  }

  const handleToggleStatus = async (id: string, currentState: string) => {
    if (!db) return
    const newState = currentState === 'publicado' ? 'pausado' : 'publicado'

    try {
      await updateDoc(doc(db, 'eventos', id), {
        estado: newState,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating evento status:', error)
      alert('Error al actualizar estado')
    }
  }

  const handleCreateEvento = () => {
    router.push('/admin/eventos/nuevo')
  }

  return (
    <RequireAdmin>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden md:block flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={handleCreateEvento}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Evento
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
            {/* Page Title & Filters */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestión de Eventos</h1>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Tabs */}
                <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filterType === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterType('active')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filterType === 'active'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Activos
                  </button>
                  <button
                    onClick={() => setFilterType('upcoming')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filterType === 'upcoming'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Próximos
                  </button>
                  <button
                    onClick={() => setFilterType('past')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      filterType === 'past'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pasados
                  </button>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 rounded-md ${
                      viewType === 'grid'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 rounded-md ${
                      viewType === 'list'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Eventos"
                value={loading ? 'Cargando...' : stats.totalEventos}
                icon={Ticket}
                iconColor="blue"
              />
              <StatsCard
                title="Activos"
                value={loading ? 'Cargando...' : stats.eventosActivos}
                icon={Activity}
                iconColor="green"
              />
              <StatsCard
                title="Tickets Vendidos"
                value={loading ? 'Cargando...' : stats.totalTicketsVendidos.toLocaleString('es-MX')}
                icon={TrendingUp}
                iconColor="purple"
              />
              <StatsCard
                title="Ingresos"
                value={
                  loading
                    ? 'Cargando...'
                    : `$${(stats.totalIngresos / 1000).toFixed(1)}K`
                }
                icon={DollarSign}
                iconColor="amber"
              />
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando eventos...</p>
              </div>
            ) : eventosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay eventos que mostrar</p>
                <button
                  onClick={handleCreateEvento}
                  className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4"
                >
                  Crear Primer Evento
                </button>
              </div>
            ) : (
              <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {eventosFiltrados.map((evento) => (
                  <EventCard
                    key={evento.id}
                    evento={evento}
                    ticketsVendidos={evento.ticketsVendidos}
                    ingresos={evento.ingresos}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </RequireAdmin>
  )
}
