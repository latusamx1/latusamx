import { Calendar, MapPin } from 'lucide-react'

interface EventData {
  name: string
  date: string
  time: string
  venue: string
  entriesPerHour: number
  avgTime: string
}

interface ActiveEventCardProps {
  event?: EventData
}

const defaultEvent: EventData = {
  name: 'Festival de Música 2024',
  date: 'Sábado, 27 Nov 2024',
  time: '19:00 - 02:00',
  venue: 'EventPro Polanco',
  entriesPerHour: 42,
  avgTime: '2.5h',
}

export default function ActiveEventCard({ event = defaultEvent }: ActiveEventCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Evento Activo</h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          En curso
        </span>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-4">
        <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
        <div className="space-y-2 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Entradas/hora</p>
          <p className="text-xl font-bold text-gray-900">{event.entriesPerHour}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Tiempo promedio</p>
          <p className="text-xl font-bold text-gray-900">{event.avgTime}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => (window.location.href = '/scanner')}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
        >
          Ir a Scanner
        </button>
        <button
          onClick={() => (window.location.href = '/plano-tiempo-real')}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
        >
          Ver Plano
        </button>
      </div>
    </div>
  )
}
