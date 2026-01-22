import { Ticket, CalendarCheck, PlusCircle } from 'lucide-react'

type ActivityType = 'ticket' | 'reservation' | 'event'

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  amount?: string
  status: 'Completado' | 'Confirmada' | 'Borrador'
  cliente?: string
}

interface ActivityTableProps {
  activities?: Activity[]
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'ticket',
    title: 'Venta de ticket',
    description: 'Festival de Música - VIP',
    timestamp: 'Hace 5 min',
    amount: '$150.00',
    status: 'Completado',
  },
  {
    id: '2',
    type: 'reservation',
    title: 'Nueva reserva',
    description: 'Mesa 15 - 4 personas',
    timestamp: 'Hace 15 min',
    status: 'Confirmada',
  },
  {
    id: '3',
    type: 'event',
    title: 'Evento creado',
    description: 'Summer Party 2024',
    timestamp: 'Hace 1 hora',
    status: 'Borrador',
  },
]

const typeConfig = {
  ticket: {
    icon: Ticket,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  reservation: {
    icon: CalendarCheck,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  event: {
    icon: PlusCircle,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
}

const statusConfig = {
  Completado: 'bg-green-100 text-green-800',
  Confirmada: 'bg-blue-100 text-blue-800',
  Borrador: 'bg-amber-100 text-amber-800',
}

export default function ActivityTable({ activities = defaultActivities }: ActivityTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <p className="text-xs sm:text-sm text-gray-500">Últimas transacciones y eventos</p>
        </div>
        <a href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver todas
        </a>
      </div>

      {/* Versión móvil - Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {activities.map((activity) => {
          const config = typeConfig[activity.type]
          const Icon = config.icon
          return (
            <div key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{activity.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{activity.timestamp}</span>
                <div className="flex items-center gap-2">
                  {activity.amount && (
                    <span className="font-medium text-gray-900">{activity.amount}</span>
                  )}
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig[activity.status]}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
              {activity.cliente && (
                <p className="text-xs text-gray-600 mt-2">
                  <span className="font-medium">Cliente:</span> {activity.cliente}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Versión desktop - Tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Evento / Ticket
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cliente
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Monto
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity) => {
              const config = typeConfig[activity.type]
              const Icon = config.icon
              return (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div
                      className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 max-w-md">
                    <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                    <p className="text-sm text-gray-500 wrap-break-word" title={activity.description}>
                      {activity.description}
                    </p>
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <p className="text-sm text-gray-900 font-medium">
                      {activity.cliente || '-'}
                    </p>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.timestamp}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {activity.amount || '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        statusConfig[activity.status]
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
