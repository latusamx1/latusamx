'use client'

import { Ticket, Evento } from '@/types'
import { Calendar, MapPin, Clock, QrCode } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TicketItemCardProps {
  ticket: Ticket
  evento?: Evento
  onViewDetails: (ticket: Ticket) => void
}

export function TicketItemCard({ ticket, evento, onViewDetails }: TicketItemCardProps) {
  if (!evento) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Cargando información del evento...</p>
      </div>
    )
  }

  const fechaEvento = evento.fecha?.toDate ? evento.fecha.toDate() : new Date(evento.fecha)
  const esPasado = fechaEvento < new Date()
  const esUsado = ticket.usado

  const getEstadoBadge = () => {
    if (esUsado) {
      return (
        <Badge className="bg-gray-500">
          <span className="mr-1">✓</span>
          Usado
        </Badge>
      )
    }
    if (esPasado) {
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-600">
          Pasado
        </Badge>
      )
    }
    return (
      <Badge className="bg-blue-600">
        <span className="mr-1">📅</span>
        Próximo
      </Badge>
    )
  }

  const colorBorde = esUsado ? 'border-gray-300' : esPasado ? 'border-gray-200' : 'border-blue-200'
  const bgColor = esUsado ? 'bg-gray-50' : esPasado ? 'bg-white' : 'bg-blue-50'

  return (
    <div className={`rounded-lg border-2 ${colorBorde} ${bgColor} p-4 transition hover:shadow-md`}>
      <div className="flex items-start gap-4">
        {/* Imagen del evento */}
        <div
          className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
          style={{
            backgroundImage: evento.imagen ? `url(${evento.imagen})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Info del ticket */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900">{evento.titulo}</h3>
              <p className="text-sm text-gray-600">{ticket.tipoTicket}</p>
            </div>
            {getEstadoBadge()}
          </div>

          <div className="mb-3 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(fechaEvento, "EEEE, dd 'de' MMMM yyyy", { locale: es })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{evento.horaInicio}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{evento.venue?.nombre || 'Por confirmar'}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onViewDetails(ticket)} disabled={esUsado}>
              <QrCode className="mr-2 h-4 w-4" />
              Ver QR
            </Button>
            {!esPasado && !esUsado && (
              <Button size="sm" variant="outline">
                Detalles
              </Button>
            )}
          </div>

          {/* Info de uso */}
          {esUsado && ticket.fechaUso && (
            <p className="mt-2 text-xs text-gray-500">
              Usado el {format(ticket.fechaUso, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
            </p>
          )}
        </div>

        {/* Precio */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-gray-900">${ticket.precio.toFixed(2)}</p>
          <p className="text-xs text-gray-500">MXN</p>
        </div>
      </div>
    </div>
  )
}
