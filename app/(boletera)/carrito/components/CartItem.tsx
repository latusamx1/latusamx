'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Minus, Calendar, Clock, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CartItem as CartItemType } from '@/lib/stores/cartStore'
import { useStockValidation } from '@/lib/hooks/useStockValidation'
import { Badge } from '@/components/ui/badge'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (quantity: number) => void
  onRemove: (itemName: string) => void
  formatPrice: (price: number) => string
}

export default function CartItem({ item, onUpdateQuantity, onRemove, formatPrice }: CartItemProps) {
  // Validar stock en tiempo real
  const { disponible, cantidadDisponible, mensaje, loading } = useStockValidation({
    eventoId: item.eventoId,
    tipoTicketId: item.tipoTicketId,
    cantidadSolicitada: item.cantidad,
    enabled: true
  })

  const stockInsuficiente = !loading && !disponible

  return (
    <Card className={`hover:shadow-md transition-shadow ${stockInsuficiente ? 'border-red-300 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Event Image */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex-shrink-0 overflow-hidden">
            {item.eventoImagen ? (
              <Image
                src={item.eventoImagen}
                alt={item.eventoTitulo}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : null}
          </div>

          {/* Ticket Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-gray-900">{item.eventoTitulo}</h3>
              {stockInsuficiente && (
                <Badge variant="destructive" className="ml-2">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Stock insuficiente
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">{item.tipoTicketNombre}</p>

            {/* Advertencia de stock */}
            {stockInsuficiente && (
              <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {mensaje || `Solo hay ${cantidadDisponible} disponibles`}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4" />
              <span>
                {item.eventoFecha && format(new Date(item.eventoFecha.seconds * 1000), "d MMMM, yyyy", { locale: es })}
              </span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>
                {item.eventoFecha && format(new Date(item.eventoFecha.seconds * 1000), "h:mm a", { locale: es })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  className="px-3 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onUpdateQuantity(item.cantidad - 1)}
                  disabled={loading}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1.5 border-x border-gray-300 font-medium">
                  {item.cantidad}
                  {!loading && cantidadDisponible > 0 && (
                    <span className="text-xs text-gray-500 ml-1">
                      / {cantidadDisponible}
                    </span>
                  )}
                </span>
                <button
                  className="px-3 py-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onUpdateQuantity(item.cantidad + 1)}
                  disabled={loading || item.cantidad >= cantidadDisponible}
                  title={
                    item.cantidad >= cantidadDisponible
                      ? `Máximo ${cantidadDisponible} disponibles`
                      : ''
                  }
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatPrice(item.precio)} x {item.cantidad}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(item.precio * item.cantidad)}
                </p>
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.eventoTitulo)}
            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
