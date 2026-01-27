'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { RequireAdmin } from '@/components/auth/RequireRole'
import EventForm from '@/components/admin/eventos/EventForm'
import { eventosService } from '@/lib/services/eventos.service'
import { getDocuments } from '@/lib/firebase/firestore'
import { Evento, Venue } from '@/types'
import { EventoFormData } from '@/lib/validations/evento.schema'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function EditarEventoPage() {
  const router = useRouter()
  const params = useParams()
  const eventoId = params.id as string

  const [evento, setEvento] = useState<Evento | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar evento y venues
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar evento
        const eventoData = await eventosService.getById(eventoId)
        if (!eventoData) {
          toast.error('Evento no encontrado')
          router.push('/admin/eventos')
          return
        }
        setEvento(eventoData)

        // Cargar venues
        const venuesData = await getDocuments<Venue>('venues', [])
        setVenues(venuesData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Error al cargar los datos')
        router.push('/admin/eventos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [eventoId, router])

  const handleSubmit = async (data: EventoFormData) => {
    setIsSubmitting(true)
    try {
      // Actualizar evento en Firestore
      await eventosService.update(eventoId, {
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

      toast.success('Evento actualizado exitosamente')
      router.push('/admin/eventos')
    } catch (error: any) {
      console.error('Error updating evento:', error)
      toast.error(error.message || 'Error al actualizar el evento')
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
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando evento...</p>
          </div>
        </div>
      </RequireAdmin>
    )
  }

  if (!evento) {
    return (
      <RequireAdmin>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Evento no encontrado</h2>
            <p className="text-gray-600 mb-4">
              El evento que buscas no existe o fue eliminado.
            </p>
            <Button onClick={() => router.push('/admin/eventos')}>
              Volver a Eventos
            </Button>
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
              Necesitas tener al menos un lugar disponible para editar eventos.
            </p>
            <Button onClick={() => router.push('/admin/venues/nuevo')}>
              Crear Lugar
            </Button>
          </div>
        </div>
      </RequireAdmin>
    )
  }

  return (
    <RequireAdmin>
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
                <h1 className="text-2xl font-bold text-gray-900">Editar Evento</h1>
                <p className="text-sm text-gray-600 mt-1">{evento.titulo}</p>
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
              evento={evento}
              venues={venues}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitLabel="Guardar Cambios"
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Help Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
              {/* Estado del Evento */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Estado del Evento</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Creado</span>
                    <span className="text-gray-900">
                      {evento.createdAt
                        ? new Date(
                            evento.createdAt.seconds * 1000
                          ).toLocaleDateString('es-MX')
                        : 'N/A'}
                    </span>
                  </div>
                  {evento.updatedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Última actualización</span>
                      <span className="text-gray-900">
                        {new Date(evento.updatedAt.seconds * 1000).toLocaleDateString(
                          'es-MX'
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Consejos */}
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
                      Editando evento
                    </h5>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Revisa cuidadosamente los cambios</li>
                      <li>• Si el evento tiene ventas, algunos cambios pueden afectar a los compradores</li>
                      <li>• Actualiza la imagen si es necesario</li>
                      <li>• Verifica que las fechas sean correctas</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Advertencia */}
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
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
                      Si modificas la cantidad de tickets disponibles y ya hay ventas,
                      asegúrate de que los nuevos valores sean coherentes con las ventas
                      existentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAdmin>
  )
}
