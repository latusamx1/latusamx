'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Minus, Calendar, Clock } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CartItem as CartItemType } from '@/lib/stores/cartStore'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (quantity: number) => void
  onRemove: (itemName: string) => void
  formatPrice: (price: number) => string
}

export default function CartItem({ item, onUpdateQuantity, onRemove, formatPrice }: CartItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
            <h3 className="font-semibold text-gray-900 mb-1">{item.eventoTitulo}</h3>
            <p className="text-sm text-gray-600 mb-1">{item.tipoTicketNombre}</p>
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
                  className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                  onClick={() => onUpdateQuantity(item.cantidad - 1)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1.5 border-x border-gray-300 font-medium">
                  {item.cantidad}
                </span>
                <button
                  className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                  onClick={() => onUpdateQuantity(item.cantidad + 1)}
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
