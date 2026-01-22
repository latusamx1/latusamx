'use client'

import { Evento, Orden } from '@/types'
import { Calendar, MapPin, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'

interface EventCardProps {
  evento: Evento
  ticketsVendidos: number
  ingresos: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, currentState: string) => void
}

const gradients = [
  'from-purple-600 via-pink-500 to-blue-600',
  'from-pink-500 to-red-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-yellow-600',
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-500',
]

const statusConfig = {
  publicado: { label: 'Activo', className: 'bg-green-100 text-green-800' },
  borrador: { label: 'Borrador', className: 'bg-gray-100 text-gray-800' },
  pausado: { label: 'Pausado', className: 'bg-amber-100 text-amber-800' },
  cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
  finalizado: { label: 'Finalizado', className: 'bg-blue-100 text-blue-800' },
}

export default function EventCard({
  evento,
  ticketsVendidos,
  ingresos,
  onEdit,
  onDelete,
  onToggleStatus,
}: EventCardProps) {
  const totalCapacidad = evento.tiposTickets?.reduce((sum, t) => sum + t.cantidad, 0) || 0
  const progress = totalCapacidad > 0 ? (ticketsVendidos / totalCapacidad) * 100 : 0
  const isSoldOut = ticketsVendidos >= totalCapacidad && totalCapacidad > 0

  // Obtener fecha como Date
  const fecha = evento.fecha instanceof Date
    ? evento.fecha
    : evento.fecha?.toDate
    ? evento.fecha.toDate()
    : new Date()

  const fechaFormateada = fecha.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const estado = evento.estado || evento.status || 'borrador'
  const statusInfo = statusConfig[estado as keyof typeof statusConfig] || statusConfig.borrador

  // Gradient aleatorio basado en ID
  const gradientIndex = evento.id ? evento.id.charCodeAt(0) % gradients.length : 0
  const gradient = gradients[gradientIndex]

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen/Gradient */}
      <div className={`h-48 bg-gradient-to-br ${gradient} relative`}>
        {isSoldOut && (
          <span className="absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
            Sold Out
          </span>
        )}
        {!isSoldOut && (
          <span className={`absolute top-3 right-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Título */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{evento.titulo}</h3>

        {/* Fecha y Lugar */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{fechaFormateada}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{evento.venue?.nombre || 'Sin ubicación'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Vendidos</p>
            <p className="font-bold text-gray-900">
              {ticketsVendidos} / {totalCapacidad}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Ingresos</p>
            <p className="font-bold text-green-600">
              ${ingresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                progress >= 100 ? 'bg-green-600' : progress >= 75 ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/admin/eventos/${evento.id}`}
            className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 h-9 px-3"
          >
            Ver
          </Link>
          <button
            onClick={() => onEdit(evento.id || '')}
            className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-3"
          >
            Editar
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 h-9 w-9"
            onClick={() => {
              // TODO: Implementar menú desplegable
              const action = confirm('¿Eliminar evento?')
              if (action) onDelete(evento.id || '')
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
