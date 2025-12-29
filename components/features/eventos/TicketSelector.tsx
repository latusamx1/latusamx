/**
 * Selector de tickets para evento
 * Diseño basado en designs/screens/evento-detalle.html
 */

'use client'

import { useState } from 'react'
import { Minus, Plus, CheckCircle, AlertCircle, ShoppingCart, ShieldCheck, Ticket as TicketIcon, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TipoTicket } from '@/types'
import { Badge } from '@/components/ui/badge'

interface TicketSelectorProps {
  tickets: TipoTicket[]
  onAddToCart?: (selection: { ticketId: string; nombre: string; precio: number; cantidad: number }[]) => void
}

export function TicketSelector({ tickets, onAddToCart }: TicketSelectorProps) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({})
  const [codigoDescuento, setCodigoDescuento] = useState('')

  const handleIncrement = (ticketId: string, max: number) => {
    const current = cantidades[ticketId] || 0
    if (current < max) {
      setCantidades({ ...cantidades, [ticketId]: current + 1 })
    }
  }

  const handleDecrement = (ticketId: string) => {
    const current = cantidades[ticketId] || 0
    if (current > 0) {
      setCantidades({ ...cantidades, [ticketId]: current - 1 })
    }
  }

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const calcularSubtotal = () => {
    return Object.entries(cantidades).reduce((total, [ticketId, cantidad]) => {
      const ticket = tickets.find((t) => t.id === ticketId)
      return total + (ticket?.precio || 0) * cantidad
    }, 0)
  }

  const calcularCargoServicio = () => {
    return calcularSubtotal() * 0.1 // 10% cargo por servicio
  }

  const calcularTotal = () => {
    return calcularSubtotal() + calcularCargoServicio()
  }

  const totalTickets = Object.values(cantidades).reduce((sum, qty) => sum + qty, 0)

  const handleAddToCart = () => {
    const selection = Object.entries(cantidades)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([ticketId, cantidad]) => {
        const ticket = tickets.find((t) => t.id === ticketId)!
        return {
          ticketId,
          nombre: ticket.nombre,
          precio: ticket.precio,
          cantidad,
        }
      })

    if (selection.length > 0 && onAddToCart) {
      onAddToCart(selection)
    }
  }

  const getDisponibilidadInfo = (disponibles: number) => {
    if (disponibles === 0) {
      return { icon: <AlertCircle className="w-4 h-4" />, text: 'Agotado', color: 'text-red-600' }
    }
    if (disponibles < 50) {
      return { icon: <AlertCircle className="w-4 h-4" />, text: `${disponibles} disponibles`, color: 'text-amber-600' }
    }
    return { icon: <CheckCircle className="w-4 h-4" />, text: `${disponibles} disponibles`, color: 'text-green-600' }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Selecciona tus Tickets</h3>

      {/* Tickets List */}
      <div className="space-y-3 mb-4">
        {tickets.map((ticket, index) => {
          const cantidad = cantidades[ticket.id] || 0
          const disponibilidad = getDisponibilidadInfo(ticket.disponibles)
          const isPopular = index === 1 // El segundo tipo suele ser VIP/Popular

          return (
            <div
              key={ticket.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                cantidad > 0
                  ? 'border-blue-500 bg-blue-50'
                  : isPopular
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-blue-500'
              }`}
              onClick={() => ticket.disponibles > 0 && handleIncrement(ticket.id, ticket.disponibles)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{ticket.nombre}</h4>
                    {isPopular && (
                      <Badge className="bg-purple-600 text-white">Popular</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{ticket.descripcion || 'Acceso general al evento'}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-gray-900">{formatPrecio(ticket.precio)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={`flex items-center gap-1 ${disponibilidad.color}`}>
                  {disponibilidad.icon}
                  {disponibilidad.text}
                </span>
                {ticket.disponibles > 0 && (
                  <div className="flex items-center border border-gray-300 rounded" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => handleDecrement(ticket.id)}
                      disabled={cantidad === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 font-medium min-w-[3rem] text-center">
                      {cantidad}
                    </span>
                    <button
                      className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => handleIncrement(ticket.id, ticket.disponibles)}
                      disabled={cantidad >= ticket.disponibles}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Discount Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Código de Descuento</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ingresa código"
            value={codigoDescuento}
            onChange={(e) => setCodigoDescuento(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline">Aplicar</Button>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrecio(calcularSubtotal())}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Cargo por servicio</span>
          <span className="font-medium text-gray-900">{formatPrecio(calcularCargoServicio())}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrecio(calcularTotal())}</span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={totalTickets === 0}
        className="w-full h-12"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Agregar al Carrito
      </Button>

      {/* Trust Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Compra 100% segura</span>
          </div>
          <div className="flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-blue-600" />
            <span>Tickets digitales instantáneos</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>Reembolso hasta 48h antes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
