/**
 * Componente cliente para detalle de evento
 * Incluye Hero, Tabs de información, y TicketSelector
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, Music, CheckCircle, AlertCircle, Map } from 'lucide-react'
import { Evento } from '@/types'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { PublicFooter } from '@/components/landing/PublicFooter'
import { TicketSelector } from '@/components/features/eventos/TicketSelector'
import { ShareButton } from '@/components/features/eventos/ShareButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/stores/cartStore'
import { toast } from 'sonner'

interface EventoDetalleProps {
  evento: Evento
}

export function EventoDetalle({ evento }: EventoDetalleProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [activeTab, setActiveTab] = useState('descripcion')

  const formatFecha = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const formatHora = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const handleAddToCart = (selection: { ticketId: string; nombre: string; precio: number; cantidad: number }[]) => {
    selection.forEach((item) => {
      addItem({
        eventoId: evento.id!,
        eventoTitulo: evento.titulo,
        eventoImagen: evento.imagenPortada,
        eventoFecha: evento.fecha,
        tipoTicketId: item.ticketId,
        tipoTicketNombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })
    })

    toast.success('Tickets agregados al carrito', {
      description: `${selection.reduce((sum, item) => sum + item.cantidad, 0)} tickets agregados`,
    })

    // Redirigir al carrito después de un breve delay
    setTimeout(() => {
      router.push('/carrito')
    }, 1500)
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />

      {/* Hero Image */}
      <div className="relative h-96 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 overflow-hidden">
        {evento.imagenPortada ? (
          <>
            <Image
              src={evento.imagenPortada}
              alt={evento.titulo}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-black/20"></div>
        )}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="text-white">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-white/20 backdrop-blur mb-3">
              <Music className="w-4 h-4 mr-1" />
              {evento.categoria}
            </span>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{evento.titulo}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatFecha(evento.fecha)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{formatHora(evento.fecha)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{evento.venue?.nombre || 'Venue por confirmar'}</span>
                  </div>
                </div>
              </div>
              <ShareButton
                url={currentUrl}
                title={evento.titulo}
                description={evento.descripcion}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                <TabsTrigger value="artistas">Line-up</TabsTrigger>
                <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              </TabsList>

              <TabsContent value="descripcion" className="mt-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca del Evento</h2>
                  <div className="prose prose-gray max-w-none text-gray-600">
                    <p className="whitespace-pre-line">{evento.descripcion}</p>
                  </div>
                </div>

                {/* Policies */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Políticas del Evento</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Los boletos son válidos solo para la fecha indicada</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Prohibido el ingreso con alimentos y bebidas</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Estacionamiento disponible con costo adicional</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <p className="text-gray-600">Reembolsos disponibles hasta 48 horas antes del evento</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <p className="text-gray-600">Prohibido fumar dentro del recinto</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="artistas" className="mt-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Line-up de Artistas</h2>
                  {evento.artistas && evento.artistas.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {evento.artistas.map((artista, index) => (
                        <div key={index} className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-2"></div>
                          <p className="font-medium text-gray-900">{artista}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Line-up por confirmar</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ubicacion" className="mt-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubicación</h2>
                  {evento.venue ? (
                    <>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{evento.venue.nombre}</p>
                          <p className="text-gray-600">{evento.venue.direccion}</p>
                          {evento.venue.ciudad && (
                            <p className="text-gray-600">
                              {evento.venue.ciudad}, {evento.venue.estado}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Map Placeholder */}
                      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Map className="w-12 h-12 mx-auto mb-2" />
                          <p>Mapa de ubicación</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">Ubicación por confirmar</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Ticket Selector (Sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              {evento.tiposTickets && evento.tiposTickets.length > 0 ? (
                <TicketSelector tickets={evento.tiposTickets} onAddToCart={handleAddToCart} />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 text-center">
                  <p className="text-gray-500">No hay tickets disponibles en este momento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
