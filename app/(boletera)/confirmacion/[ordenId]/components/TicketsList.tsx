'use client'

import { Ticket, Evento } from '@/types'
import { TicketCard } from '../TicketCard'

interface TicketsListProps {
  tickets: Ticket[]
  evento: Evento
}

const COLOR_SCHEMES = ['purple', 'blue', 'green', 'orange'] as const

export function TicketsList({ tickets, evento }: TicketsListProps) {
  return (
    <div className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Tus Tickets</h3>
      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            evento={evento}
            colorScheme={COLOR_SCHEMES[index % COLOR_SCHEMES.length]}
          />
        ))}
      </div>
    </div>
  )
}
