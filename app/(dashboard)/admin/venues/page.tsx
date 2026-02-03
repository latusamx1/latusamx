'use client'

import { useState, useEffect, useMemo } from 'react'
import { RequireAdmin } from '@/components/auth/RequireRole'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import StatsCard from '@/components/dashboard/StatsCard'
import VenueForm from '@/components/admin/venues/VenueForm'
import { type VenueFormData } from '@/lib/validations/venue.schema'
import {
  Building2,
  CheckCircle,
  Users,
  Calendar,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
} from 'lucide-react'
import { db } from '@/lib/firebase/config'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  Timestamp,
  where,
  getDocs,
} from 'firebase/firestore'
import { Venue, Evento } from '@/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'

interface VenueWithStats extends Venue {
  eventosEsteMes: number
}

export default function VenuesAdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados
  const [venues, setVenues] = useState<Venue[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [formOpen, setFormOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null)

  // Listener en tiempo real para venues
  useEffect(() => {
    if (!db) return

    const venuesRef = collection(db, 'venues')
    const q = query(venuesRef, orderBy('nombre', 'asc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const venuesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Venue[]
        setVenues(venuesData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching venues:', error)
        toast.error('Error al cargar venues')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Listener para eventos (para contar eventos por venue)
  useEffect(() => {
    if (!db) return

    const eventosRef = collection(db, 'eventos')
    const q = query(eventosRef, orderBy('fecha', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Evento[]
        setEventos(eventosData)
      },
      (error) => {
        console.error('Error fetching eventos:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  // Calcular stats por venue
  const venuesConStats: VenueWithStats[] = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return venues.map((venue) => {
      const eventosVenue = eventos.filter((e) => {
        if (e.venueId !== venue.id) return false
        const fecha = e.fecha instanceof Date ? e.fecha : e.fecha?.toDate?.() || new Date()
        return fecha >= startOfMonth && fecha <= endOfMonth
      })

      return {
        ...venue,
        eventosEsteMes: eventosVenue.length,
      }
    })
  }, [venues, eventos])

  // Filtrar venues
  const venuesFiltrados = useMemo(() => {
    if (!searchTerm) return venuesConStats

    const term = searchTerm.toLowerCase()
    return venuesConStats.filter(
      (v) =>
        v.nombre.toLowerCase().includes(term) ||
        v.direccion.toLowerCase().includes(term) ||
        v.ciudad.toLowerCase().includes(term)
    )
  }, [venuesConStats, searchTerm])

  // Calcular stats totales
  const stats = useMemo(() => {
    const totalVenues = venues.length
    const venuesActivos = venues.filter((v) => v.estadoVenue === 'activo' || !v.estadoVenue).length
    const capacidadTotal = venues.reduce((sum, v) => sum + v.capacidad, 0)
    const eventosEsteMes = venuesConStats.reduce((sum, v) => sum + v.eventosEsteMes, 0)

    return {
      totalVenues,
      venuesActivos,
      capacidadTotal,
      eventosEsteMes,
    }
  }, [venues, venuesConStats])

  // Handlers
  const handleOpenCreate = () => {
    setSelectedVenue(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (venue: Venue) => {
    setSelectedVenue(venue)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedVenue(null)
  }

  const handleSubmit = async (data: VenueFormData) => {
    if (!db) return

    setIsSubmitting(true)

    try {
      if (selectedVenue) {
        // Actualizar
        await updateDoc(doc(db, 'venues', selectedVenue.id), {
          ...data,
          updatedAt: Timestamp.now(),
        })
        toast.success('Venue actualizado correctamente')
      } else {
        // Crear
        await addDoc(collection(db, 'venues'), {
          ...data,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
        toast.success('Venue creado correctamente')
      }

      handleCloseForm()
    } catch (error) {
      console.error('Error saving venue:', error)
      toast.error('Error al guardar el venue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (venue: Venue) => {
    setVenueToDelete(venue)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!db || !venueToDelete) return

    try {
      // Verificar si hay eventos usando este venue
      const eventosRef = collection(db, 'eventos')
      const q = query(eventosRef, where('venueId', '==', venueToDelete.id))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        toast.error(
          `No se puede eliminar: hay ${snapshot.size} evento(s) usando este venue`
        )
        setDeleteDialogOpen(false)
        setVenueToDelete(null)
        return
      }

      await deleteDoc(doc(db, 'venues', venueToDelete.id))
      toast.success('Venue eliminado correctamente')
    } catch (error) {
      console.error('Error deleting venue:', error)
      toast.error('Error al eliminar el venue')
    } finally {
      setDeleteDialogOpen(false)
      setVenueToDelete(null)
    }
  }

  const getEstadoBadge = (estado?: string) => {
    switch (estado) {
      case 'activo':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Activo
          </span>
        )
      case 'inactivo':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
            Inactivo
          </span>
        )
      case 'mantenimiento':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
            Mantenimiento
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Activo
          </span>
        )
    }
  }

  const getGradientClass = (index: number) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600',
    ]
    return gradients[index % gradients.length]
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
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gestión de Venues</h1>
                <p className="text-sm text-gray-500">Administra los locales para eventos</p>
              </div>
            </div>

            <Button onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Venue
            </Button>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Total Venues"
                value={loading ? '...' : stats.totalVenues}
                icon={Building2}
                iconColor="blue"
              />
              <StatsCard
                title="Activos"
                value={loading ? '...' : stats.venuesActivos}
                icon={CheckCircle}
                iconColor="green"
              />
              <StatsCard
                title="Capacidad Total"
                value={loading ? '...' : stats.capacidadTotal.toLocaleString('es-MX')}
                icon={Users}
                iconColor="purple"
              />
              <StatsCard
                title="Eventos este mes"
                value={loading ? '...' : stats.eventosEsteMes}
                icon={Calendar}
                iconColor="amber"
              />
            </div>

            {/* Venues List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-semibold text-gray-900">Venues Registrados</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar venue..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Cargando venues...</p>
                </div>
              ) : venuesFiltrados.length === 0 ? (
                <div className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? 'No se encontraron venues con ese criterio'
                      : 'No hay venues registrados'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleOpenCreate}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear primer venue
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Venue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Ubicación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Capacidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Eventos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {venuesFiltrados.map((venue, index) => (
                        <tr key={venue.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 bg-gradient-to-br ${getGradientClass(index)} rounded-lg flex-shrink-0`}
                              />
                              <div>
                                <p className="font-semibold text-gray-900">{venue.nombre}</p>
                                <p className="text-sm text-gray-500">ID: {venue.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">
                              {venue.ciudad}, {venue.estado}
                            </p>
                            <p className="text-xs text-gray-500">{venue.direccion}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">
                              {venue.capacidad.toLocaleString('es-MX')}
                            </p>
                            <p className="text-xs text-gray-500">personas</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{venue.eventosEsteMes}</p>
                            <p className="text-xs text-gray-500">este mes</p>
                          </td>
                          <td className="px-6 py-4">{getEstadoBadge(venue.estadoVenue)}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenEdit(venue)}
                                className="p-1.5 hover:bg-gray-100 rounded text-blue-600"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(venue)}
                                className="p-1.5 hover:bg-gray-100 rounded text-red-600"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Venue Form Modal */}
      <VenueForm
        venue={selectedVenue}
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar venue?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el venue{' '}
              <strong>{venueToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RequireAdmin>
  )
}
