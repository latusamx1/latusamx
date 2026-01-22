interface Event {
  id: string
  name: string
  ticketsSold: number
  revenue: string
  gradient: string
  fecha?: string
  venue?: string
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
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Eventos</h3>
        <p className="text-xs sm:text-sm text-gray-500">Por ventas este mes</p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="flex items-start justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="shrink-0 relative group">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br ${event.gradient} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-base sm:text-lg">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-gray-900 mb-1 wrap-break-word"
                    title={event.name}
                  >
                    {event.name}
                  </p>
                  <div className="flex flex-col gap-1">
                    {event.fecha && (
                      <p className="text-xs text-gray-500">
                        📅 {event.fecha}
                      </p>
                    )}
                    {event.venue && (
                      <p className="text-xs text-gray-500">
                        📍 {event.venue}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{event.ticketsSold}</span> tickets vendidos
                    </p>
                    <p className="text-xs text-gray-500">
                      Promedio: ${(parseFloat(event.revenue.replace(/[$,]/g, '')) / event.ticketsSold).toFixed(2)} por ticket
                    </p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xl font-bold text-green-600 block">{event.revenue}</span>
                <span className="text-xs text-gray-500">ingresos</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
