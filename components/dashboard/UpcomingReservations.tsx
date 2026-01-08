interface Reservation {
  id: string
  time: string
  name: string
  guests: number
  table: string
  status: 'Confirmada' | 'Pendiente'
  color: 'blue' | 'purple' | 'green' | 'orange'
}

interface UpcomingReservationsProps {
  reservations?: Reservation[]
}

const defaultReservations: Reservation[] = [
  {
    id: '1',
    time: '20:00',
    name: 'Juan Pérez',
    guests: 4,
    table: 'Mesa 12',
    status: 'Confirmada',
    color: 'blue',
  },
  {
    id: '2',
    time: '20:30',
    name: 'María González',
    guests: 2,
    table: 'Mesa 5',
    status: 'Pendiente',
    color: 'purple',
  },
  {
    id: '3',
    time: '21:00',
    name: 'Carlos Rodríguez',
    guests: 6,
    table: 'Mesa 8',
    status: 'Confirmada',
    color: 'green',
  },
  {
    id: '4',
    time: '21:30',
    name: 'Ana Martínez',
    guests: 8,
    table: 'Mesa 15',
    status: 'Confirmada',
    color: 'orange',
  },
]

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
}

const statusMap = {
  Confirmada: 'bg-green-100 text-green-700',
  Pendiente: 'bg-yellow-100 text-yellow-700',
}

export default function UpcomingReservations({
  reservations = defaultReservations,
}: UpcomingReservationsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Próximas Reservas</h2>
        <button
          onClick={() => (window.location.href = '/agenda')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Ver todas
        </button>
      </div>

      <div className="space-y-3">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div
              className={`flex flex-col items-center justify-center w-12 h-12 ${
                colorMap[reservation.color]
              } rounded-lg flex-shrink-0`}
            >
              <span className="text-lg font-bold">{reservation.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{reservation.name}</p>
              <p className="text-sm text-gray-500">
                {reservation.guests} personas • {reservation.table}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                statusMap[reservation.status]
              }`}
            >
              {reservation.status}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => (window.location.href = '/recepcion')}
        className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
      >
        Ir a Recepción
      </button>
    </div>
  )
}
