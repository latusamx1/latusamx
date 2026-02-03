'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RequireAdmin } from '@/components/auth/RequireRole'
import EventForm from '@/components/admin/eventos/EventForm'
import { eventosService } from '@/lib/services/eventos.service'
import { getDocuments } from '@/lib/firebase/firestore'
import { Venue } from '@/types'
import { EventoFormData } from '@/lib/validations/evento.schema'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Timestamp } from 'firebase/firestore'
import { FeatureGate } from '@/components/shared/FeatureGate'

export default function NuevoEventoPage() {
  const router = useRouter()
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar venues
  useEffect(() => {
    const loadVenues = async () => {
      try {
        const venuesData = await getDocuments<Venue>('venues', [])
        setVenues(venuesData)
      } catch (error) {
        console.error('Error loading venues:', error)
        toast.error('Error al cargar los lugares')
      } finally {
        setLoading(false)
      }
    }

    loadVenues()
  }, [])

  const handleSubmit = async (data: EventoFormData) => {
    setIsSubmitting(true)
    try {
      // Crear evento en Firestore
      const eventoId = await eventosService.create({
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
        fecha: data.fecha,
        fechaFin: data.fechaFin || undefined,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        venueId: data.venueId,
        imagenPortada: data.imagenPortada,
        imagenPublicId: data.imagenPublicId,
        tiposTickets: data.tiposTickets,
        estado: data.estado,
        destacado: data.destacado,
        tags: data.tags || [],
        precioMinimo: Math.min(...data.tiposTickets.map(t => t.precio)),
      })

      toast.success('Evento creado exitosamente')
      router.push('/admin/eventos')
    } catch (error: any) {
      console.error('Error creating evento:', error)
      toast.error(error.message || 'Error al crear el evento')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/eventos')
  }

  if (loading) {
    return (
      <RequireAdmin>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </RequireAdmin>
    )
  }

  if (venues.length === 0) {
    return (
      <RequireAdmin>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay lugares disponibles</h2>
            <p className="text-gray-600 mb-4">
              Necesitas crear al menos un lugar antes de poder crear eventos.
            </p>
            <Button onClick={() => router.push('/admin/venues')}>
              Ir a Gestión de Venues
            </Button>
          </div>
        </div>
      </RequireAdmin>
    )
  }

  return (
    <RequireAdmin>
      <FeatureGate
        fallbackTitle="Crear Evento - Próximamente"
        fallbackDescription="La funcionalidad para crear nuevos eventos estará disponible muy pronto. Estamos preparando todo para ti."
      >
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin/eventos')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Evento</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Completa la información del evento
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <EventForm
              venues={venues}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel="Crear Evento"
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Help Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h5 className="font-semibold text-blue-900 text-sm mb-1">
                      Consejos para crear eventos exitosos
                    </h5>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Usa un título claro y descriptivo</li>
                      <li>• Incluye todos los detalles importantes en la descripción</li>
                      <li>• Sube una imagen atractiva y de alta calidad</li>
                      <li>• Define precios competitivos</li>
                      <li>• Verifica las fechas y horarios</li>
                      <li>• Guarda como borrador si necesitas revisar</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h5 className="font-semibold text-amber-900 text-sm mb-1">
                      Importante
                    </h5>
                    <p className="text-xs text-amber-800">
                      Revisa cuidadosamente toda la información antes de publicar. Una
                      vez que el evento esté publicado y tenga ventas, algunos campos no
                      podrán modificarse.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </FeatureGate>
    </RequireAdmin>
  )
}
