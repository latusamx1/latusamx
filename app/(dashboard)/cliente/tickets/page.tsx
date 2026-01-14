'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { useTickets } from './hooks/useTickets'
import { Ticket } from '@/types'

// Componentes
import { TicketTabs } from './components/TicketTabs'
import { TicketItemCard } from './components/TicketItemCard'
import { EmptyTickets } from './components/EmptyTickets'
import { TicketDetailModal } from './components/TicketDetailModal'
import { Loader2 } from 'lucide-react'

export default function MisTicketsPage() {
  const { user } = useAuthStore()
  const { tickets, loading, filter, setFilter, counts } = useTickets(user?.uid || null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  // Estado de carga
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Cargando tus tickets...</p>
        </div>
      </div>
    )
  }

  const selectedTicketEvento = tickets.find((t) => t.id === selectedTicket?.id)?.evento

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Tickets</h1>
        <p className="mt-2 text-gray-600">Administra todos tus tickets de eventos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-2xl">🎫</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{counts.todos}</p>
          <p className="text-xs text-gray-500">Tickets</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">Próximos</span>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{counts.proximos}</p>
          <p className="text-xs text-gray-500">Eventos</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">Pasados</span>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-2xl font-bold text-gray-600">{counts.pasados}</p>
          <p className="text-xs text-gray-500">Eventos</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">Usados</span>
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{counts.usados}</p>
          <p className="text-xs text-gray-500">Tickets</p>
        </div>
      </div>

      {/* Tabs y Lista */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="p-6 pb-0">
          <TicketTabs activeFilter={filter} onFilterChange={setFilter} counts={counts} />
        </div>

        <div className="p-6">
          {tickets.length === 0 ? (
            <EmptyTickets filter={filter} />
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <TicketItemCard
                  key={ticket.id}
                  ticket={ticket}
                  evento={ticket.evento}
                  onViewDetails={setSelectedTicket}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      <TicketDetailModal
        ticket={selectedTicket}
        evento={selectedTicketEvento || null}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  )
}
