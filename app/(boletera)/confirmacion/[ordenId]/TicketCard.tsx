'use client'

import { Ticket, Evento } from '@/types'
import { QRCodeSVG } from 'qrcode.react'
import { Calendar, Clock, MapPin, Hash } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface TicketCardProps {
  ticket: Ticket
  evento: Evento
  colorScheme?: 'purple' | 'blue' | 'green' | 'orange'
}

const COLOR_SCHEMES = {
  purple: 'from-purple-600 via-pink-500 to-blue-600',
  blue: 'from-blue-600 to-cyan-500',
  green: 'from-green-600 to-teal-500',
  orange: 'from-orange-600 to-red-500',
}

export function TicketCard({ ticket, evento, colorScheme = 'purple' }: TicketCardProps) {
  const eventoFecha = evento.fecha?.toDate ? evento.fecha.toDate() : new Date(evento.fecha)

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-gray-200 bg-linear-to-r ${COLOR_SCHEMES[colorScheme]} p-4 text-white`}
    >
      {/* Círculos decorativos */}
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/10" />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h4 className="mb-1 text-lg font-bold">{evento.titulo}</h4>
            <p className="text-sm text-white/90">{ticket.tipoTicket}</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            #{ticket.id?.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* Detalles del evento */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-white/70">Fecha</p>
            <p className="text-sm font-semibold">
              {format(eventoFecha, 'dd MMM, yyyy', { locale: es })}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/70">Hora</p>
            <p className="text-sm font-semibold">{evento.horaInicio}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-white/70">Lugar</p>
            <p className="text-sm font-semibold">{evento.venue?.nombre || 'Por confirmar'}</p>
          </div>
        </div>

        {/* Precio */}
        <div className="mb-4">
          <p className="text-xs text-white/70">Precio</p>
          <p className="text-xl font-bold">
            ${ticket.precio.toFixed(2)} <span className="text-sm font-normal">MXN</span>
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-end">
          <div className="rounded bg-white p-2">
            <QRCodeSVG value={ticket.qrCode} size={80} level="H" />
          </div>
        </div>

        {/* Estado del ticket */}
        {ticket.usado && (
          <div className="mt-4 rounded bg-white/20 p-2 text-center backdrop-blur">
            <p className="text-xs font-semibold">TICKET USADO</p>
            {ticket.fechaUso && (
              <p className="text-xs text-white/80">
                {format(ticket.fechaUso, "dd MMM yyyy 'a las' HH:mm", { locale: es })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
