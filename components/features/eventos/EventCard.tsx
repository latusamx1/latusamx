/**
 * Tarjeta de evento para catálogo público
 * Soporta modo featured (destacado) basado en designs/screens/eventos.html
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Evento } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StockBadge } from './StockIndicator'

interface EventCardProps {
  evento: Evento
  featured?: boolean
}

export function EventCard({ evento, featured = false }: EventCardProps) {
  const formatFecha = (timestamp: any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
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

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const precioDesde = Math.min(...(evento.tiposTickets?.map((t) => t.precio) || [0]))
  const totalDisponibles = evento.tiposTickets?.reduce((sum, t) => sum + t.disponibles, 0) || 0
  const totalTickets = evento.tiposTickets?.reduce((sum, t) => sum + t.cantidad, 0) || 0
  const totalVendidos = totalTickets - totalDisponibles

  if (featured) {
    // Card destacado (horizontal grande)
    return (
      <Link href={`/eventos/${evento.id}`}>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-1/2 h-64 md:h-auto">
              {evento.imagenPortada ? (
                <Image
                  src={evento.imagenPortada}
                  alt={evento.titulo}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  DESTACADO
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <StockBadge disponibles={totalDisponibles} total={totalTickets} />
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge className="mb-2">{evento.categoria}</Badge>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{evento.titulo}</h3>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {formatFecha(evento.fecha)} • {formatHora(evento.fecha)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{evento.venue?.nombre || 'Por confirmar'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {totalVendidos}/{totalTickets} tickets vendidos
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{evento.descripcion}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Desde</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrecio(precioDesde)}</p>
                </div>
                <Button className="px-6 py-3">Comprar Tickets</Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Card regular (vertical)
  return (
    <Link href={`/eventos/${evento.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
        <div className="relative h-48">
          {evento.imagenPortada ? (
            <Image
              src={evento.imagenPortada}
              alt={evento.titulo}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          )}
          <div className="absolute top-3 right-3">
            <StockBadge disponibles={totalDisponibles} total={totalTickets} />
          </div>
        </div>
        <div className="p-4">
          <Badge className="mb-2">{evento.categoria}</Badge>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{evento.titulo}</h3>
          <div className="space-y-1 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span className="line-clamp-1">{formatFecha(evento.fecha)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{evento.venue?.nombre || 'Por confirmar'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Desde</p>
              <p className="text-lg font-bold text-gray-900">{formatPrecio(precioDesde)}</p>
            </div>
            <Button size="sm">Ver más</Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
