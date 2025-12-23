/**
 * Item individual del carrito de compras
 */

'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CartItemProps {
  id: string
  eventoId: string
  eventoTitulo: string
  eventoFecha: Date
  eventoUbicacion: string
  eventoImagen?: string
  tipoTicket: string
  precioUnitario: number
  cantidad: number
  onUpdateCantidad?: (newCantidad: number) => void
  onRemove?: () => void
  maxDisponible?: number
}

export function CartItem({
  id,
  eventoId,
  eventoTitulo,
  eventoFecha,
  eventoUbicacion,
  eventoImagen,
  tipoTicket,
  precioUnitario,
  cantidad,
  onUpdateCantidad,
  onRemove,
  maxDisponible = 10,
}: CartItemProps) {
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

  const handleIncrement = () => {
    if (cantidad < maxDisponible && onUpdateCantidad) {
      onUpdateCantidad(cantidad + 1)
    }
  }

  const handleDecrement = () => {
    if (cantidad > 1 && onUpdateCantidad) {
      onUpdateCantidad(cantidad - 1)
    }
  }

  const subtotal = precioUnitario * cantidad

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Imagen del Evento */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
            {eventoImagen ? (
              <Image src={eventoImagen} alt={eventoTitulo} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Calendar className="w-8 h-8 text-white/50" />
              </div>
            )}
          </div>

          {/* Info del Evento */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{eventoTitulo}</h3>
                <p className="text-sm font-medium text-blue-600 mt-1">{tipoTicket}</p>
              </div>

              {/* Botón Eliminar - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-gray-400 hover:text-red-600 shrink-0 hidden sm:flex"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Detalles del Evento */}
            <div className="space-y-1 text-xs text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="line-clamp-1">{formatFecha(eventoFecha)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{eventoUbicacion}</span>
              </div>
            </div>

            {/* Controles y Precio */}
            <div className="flex items-center justify-between gap-4">
              {/* Selector de Cantidad */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDecrement}
                  disabled={cantidad <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-semibold w-8 text-center">{cantidad}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleIncrement}
                  disabled={cantidad >= maxDisponible}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Precio */}
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {formatPrecio(precioUnitario)} x {cantidad}
                </p>
                <p className="text-lg font-bold text-gray-900">{formatPrecio(subtotal)}</p>
              </div>
            </div>

            {/* Botón Eliminar - Mobile */}
            <div className="mt-3 sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
