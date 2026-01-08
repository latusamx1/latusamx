interface Event {
  id: string
  name: string
  ticketsSold: number
  revenue: string
  gradient: string
}

interface TopEventsListProps {
  events?: Event[]
}

const defaultEvents: Event[] = [
  {
    id: '1',
    name: 'Festival de Música',
    ticketsSold: 850,
    revenue: '$42,500',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    id: '2',
    name: 'Tech Conference',
    ticketsSold: 500,
    revenue: '$25,000',
    gradient: 'from-pink-500 to-red-600',
  },
  {
    id: '3',
    name: 'Summer Party',
    ticketsSold: 320,
    revenue: '$16,000',
    gradient: 'from-green-500 to-teal-600',
  },
]

export default function TopEventsList({ events = defaultEvents }: TopEventsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Eventos</h3>
        <p className="text-sm text-gray-500">Por ventas este mes</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${event.gradient} rounded`} />
                <div>
                  <p className="font-medium text-gray-900">{event.name}</p>
                  <p className="text-sm text-gray-500">{event.ticketsSold} tickets vendidos</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">{event.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
