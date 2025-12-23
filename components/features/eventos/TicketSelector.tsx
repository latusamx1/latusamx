/**
 * Selector de tickets para evento
 */

'use client'

import { useState } from 'react'
import { Minus, Plus, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TipoTicket {
  id: string
  nombre: string
  descripcion?: string
  precio: number
  disponibles: number
  limite_por_compra?: number
}

interface TicketSelectorProps {
  tickets: TipoTicket[]
  onSelectionChange?: (selection: { ticketId: string; cantidad: number }[]) => void
}

export function TicketSelector({ tickets, onSelectionChange }: TicketSelectorProps) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({})

  const handleIncrement = (ticketId: string, max: number) => {
    const current = cantidades[ticketId] || 0
    const limiteCompra = tickets.find((t) => t.id === ticketId)?.limite_por_compra || 10

    if (current < Math.min(max, limiteCompra)) {
      const newCantidades = {
        ...cantidades,
        [ticketId]: current + 1,
      }
      setCantidades(newCantidades)
      notifyChange(newCantidades)
    }
  }

  const handleDecrement = (ticketId: string) => {
    const current = cantidades[ticketId] || 0
    if (current > 0) {
      const newCantidades = {
        ...cantidades,
        [ticketId]: current - 1,
      }
      setCantidades(newCantidades)
      notifyChange(newCantidades)
    }
  }

  const notifyChange = (newCantidades: Record<string, number>) => {
    if (onSelectionChange) {
      const selection = Object.entries(newCantidades)
        .filter(([_, cantidad]) => cantidad > 0)
        .map(([ticketId, cantidad]) => ({ ticketId, cantidad }))
      onSelectionChange(selection)
    }
  }

  const formatPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(precio)
  }

  const calcularTotal = () => {
    return Object.entries(cantidades).reduce((total, [ticketId, cantidad]) => {
      const ticket = tickets.find((t) => t.id === ticketId)
      return total + (ticket?.precio || 0) * cantidad
    }, 0)
  }

  const totalTickets = Object.values(cantidades).reduce((sum, qty) => sum + qty, 0)

  return (
    <div className="space-y-4">
      {/* Lista de Tickets */}
      <div className="space-y-3">
        {tickets.map((ticket) => {
          const cantidad = cantidades[ticket.id] || 0
          const disponible = ticket.disponibles > 0

          return (
            <Card key={ticket.id} className={!disponible ? 'opacity-50' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-blue-600" />
                      {ticket.nombre}
                    </CardTitle>
                    {ticket.descripcion && (
                      <p className="text-sm text-gray-600 mt-1">{ticket.descripcion}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold text-gray-900">{formatPrecio(ticket.precio)}</p>
                    {disponible ? (
                      <Badge variant="outline" className="mt-1">
                        {ticket.disponibles} disponibles
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="mt-1">
                        Agotado
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              {disponible && (
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecrement(ticket.id)}
                        disabled={cantidad === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{cantidad}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncrement(ticket.id, ticket.disponibles)}
                        disabled={cantidad >= ticket.disponibles}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {cantidad > 0 && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrecio(ticket.precio * cantidad)}
                        </p>
                      </div>
                    )}
                  </div>

                  {ticket.limite_por_compra && (
                    <p className="text-xs text-gray-500 mt-2">
                      Máximo {ticket.limite_por_compra} por compra
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Resumen Total */}
      {totalTickets > 0 && (
        <Card className="bg-gray-50 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de tickets</p>
                <p className="text-lg font-semibold text-gray-900">{totalTickets}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total a pagar</p>
                <p className="text-2xl font-bold text-blue-600">{formatPrecio(calcularTotal())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
