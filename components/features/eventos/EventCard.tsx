/**
 * Tarjeta de evento para catálogo público
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface EventCardProps {
  id: string
  titulo: string
  descripcion: string
  fecha: Date
  ubicacion: string
  imagen?: string
  precio_desde: number
  tickets_disponibles: number
  categoria: string
}

export function EventCard({
  id,
  titulo,
  descripcion,
  fecha,
  ubicacion,
  imagen,
  precio_desde,
  tickets_disponibles,
  categoria,
}: EventCardProps) {
  const formatFecha = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(precio)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600">
        {imagen ? (
          <Image src={imagen} alt={titulo} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Ticket className="w-16 h-16 text-white/50" />
          </div>
        )}
        {/* Badge de categoría */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white">
            {categoria}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Título */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{titulo}</h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{descripcion}</p>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            <span>{formatFecha(fecha)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            <span className="line-clamp-1">{ubicacion}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Ticket className="w-4 h-4 mr-2 text-blue-600" />
            <span>{tickets_disponibles} tickets disponibles</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Desde</p>
          <p className="text-xl font-bold text-gray-900">{formatPrecio(precio_desde)}</p>
        </div>
        <Link href={`/eventos/${id}`}>
          <Button>Ver Detalles</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
