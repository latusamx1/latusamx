interface Reservation {
  id: string
  venue: string
  date: string
  time: string
  guests: number
  table: string
  status: 'today' | 'upcoming'
}

interface ReservationsListProps {
  reservations?: Reservation[]
}

const defaultReservations: Reservation[] = [
  {
    id: '1',
    venue: 'EventPro Polanco',
    date: 'Hoy',
    time: '20:00',
    guests: 4,
    table: 'Mesa 12',
    status: 'today',
  },
  {
    id: '2',
    venue: 'EventPro Condesa',
    date: '16 Dic',
    time: '21:30',
    guests: 2,
    table: 'Mesa 5',
    status: 'upcoming',
  },
]

const statusConfig = {
  today: 'bg-purple-600 text-white',
  upcoming: 'bg-green-100 text-green-700',
}

export default function ReservationsList({ reservations = defaultReservations }: ReservationsListProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Mis Reservas</h3>
        <button
          onClick={() => (window.location.href = '/mis-reservas')}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Ver todas
        </button>
      </div>

      <div className="space-y-3">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className={`p-3 border rounded-lg ${
              reservation.status === 'today'
                ? 'border-purple-200 bg-purple-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">{reservation.venue}</span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${statusConfig[reservation.status]}`}>
                {reservation.date}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {reservation.time} • {reservation.guests} personas
            </p>
            <p className="text-xs text-gray-500">{reservation.table}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => (window.location.href = '/sucursales')}
        className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
      >
        + Nueva Reserva
      </button>
    </div>
  )
}
