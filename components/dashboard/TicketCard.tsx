import { Calendar, MapPin, CalendarPlus, Share2 } from 'lucide-react'

type TicketStatus = 'upcoming' | 'past' | 'confirmed'

interface Ticket {
  id: string
  eventName: string
  ticketType: string
  quantity: number
  date: string
  time?: string
  venue: string
  status: TicketStatus
  gradient: string
}

interface TicketCardProps {
  ticket: Ticket
}

const statusConfig = {
  upcoming: {
    label: 'Próximo',
    classes: 'bg-blue-600 text-white',
    showActions: true,
  },
  past: {
    label: 'Pasado',
    classes: 'bg-gray-200 text-gray-700',
    showActions: false,
  },
  confirmed: {
    label: 'Confirmado',
    classes: 'bg-green-100 text-green-700',
    showActions: true,
  },
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const config = statusConfig[ticket.status]
  const isHighlighted = ticket.status === 'upcoming'

  return (
    <div
      className={`border rounded-lg p-4 ${
        isHighlighted ? 'border-2 border-blue-200 bg-blue-50' : 'border border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 bg-gradient-to-br ${ticket.gradient} rounded-lg flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900">{ticket.eventName}</h3>
              <p className="text-sm text-gray-600">
                {ticket.ticketType} × {ticket.quantity}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded ${config.classes}`}>
              {config.label}
            </span>
          </div>
          <div
            className={`space-y-1 text-sm mb-3 ${
              ticket.status === 'past' ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {ticket.date}
                {ticket.time && ` • ${ticket.time}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{ticket.venue}</span>
            </div>
          </div>
          {config.showActions ? (
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Ver Tickets
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                <CalendarPlus className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Descargar comprobante
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
