import TicketCard from './TicketCard'

interface Ticket {
  id: string
  eventName: string
  ticketType: string
  quantity: number
  date: string
  time?: string
  venue: string
  status: 'upcoming' | 'past' | 'confirmed'
  gradient: string
}

interface TicketsListProps {
  tickets?: Ticket[]
}

const defaultTickets: Ticket[] = [
  {
    id: '1',
    eventName: 'Festival de Música 2024',
    ticketType: 'VIP Access',
    quantity: 2,
    date: 'Sábado, 15 Dic 2024',
    time: '20:00',
    venue: 'EventPro Polanco',
    status: 'upcoming',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    id: '2',
    eventName: 'Tech Conference 2024',
    ticketType: 'General',
    quantity: 1,
    date: 'Viernes, 25 Oct 2024',
    venue: 'EventPro Santa Fe',
    status: 'past',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: '3',
    eventName: 'Summer Party 2024',
    ticketType: 'Premium',
    quantity: 4,
    date: 'Sábado, 22 Dic 2024',
    time: '19:00',
    venue: 'EventPro Condesa',
    status: 'confirmed',
    gradient: 'from-green-500 to-teal-600',
  },
]

export default function TicketsList({ tickets = defaultTickets }: TicketsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Mis Tickets</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todos
        </button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  )
}
