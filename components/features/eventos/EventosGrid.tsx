/**
 * Grid de eventos con evento destacado
 */

'use client'

import { Evento } from '@/types'
import { EventCard } from './EventCard'
import { EventCardFeaturedSkeleton, EventCardSkeleton } from './EventCardSkeleton'

interface EventosGridProps {
  eventos: Evento[]
  loading?: boolean
  featuredEventId?: string
}

export function EventosGrid({ eventos, loading = false, featuredEventId }: EventosGridProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EventCardFeaturedSkeleton />
        {[...Array(5)].map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (eventos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No se encontraron eventos</p>
        <p className="text-gray-400 text-sm mt-2">Intenta cambiar los filtros de búsqueda</p>
      </div>
    )
  }

  // Separar evento destacado
  const featuredEvent = eventos.find((e) => e.id === featuredEventId || e.destacado)
  const regularEvents = eventos.filter((e) => e.id !== featuredEvent?.id)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredEvent && (
        <div className="md:col-span-2 lg:col-span-3">
          <EventCard evento={featuredEvent} featured />
        </div>
      )}

      {regularEvents.map((evento) => (
        <EventCard key={evento.id} evento={evento} />
      ))}
    </div>
  )
}
