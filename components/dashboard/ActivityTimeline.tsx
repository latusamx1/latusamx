import { Check, UserCheck, CalendarPlus, AlertCircle } from 'lucide-react'

type ActivityType = 'validation' | 'checkin' | 'reservation' | 'alert'

interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

interface ActivityTimelineProps {
  activities?: Activity[]
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'validation',
    title: 'Ticket validado - VIP #001234',
    description: 'Juan Pérez • Hace 2 minutos',
    timestamp: 'Hace 2 min',
  },
  {
    id: '2',
    type: 'checkin',
    title: 'Check-in realizado - Mesa 12',
    description: 'Reserva de María González • Hace 5 minutos',
    timestamp: 'Hace 5 min',
  },
  {
    id: '3',
    type: 'reservation',
    title: 'Nueva reserva agregada',
    description: 'Carlos López - 4 personas • Hace 12 minutos',
    timestamp: 'Hace 12 min',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Capacidad al 85%',
    description: 'Alerta de aforo • Hace 15 minutos',
    timestamp: 'Hace 15 min',
  },
]

const typeConfig = {
  validation: {
    icon: Check,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  checkin: {
    icon: UserCheck,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  reservation: {
    icon: CalendarPlus,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  alert: {
    icon: AlertCircle,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
}

export default function ActivityTimeline({ activities = defaultActivities }: ActivityTimelineProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type]
          const Icon = config.icon
          const isLast = index === activities.length - 1
          return (
            <div
              key={activity.id}
              className={`flex items-start gap-3 ${!isLast ? 'pb-3 border-b border-gray-200' : ''}`}
            >
              <div
                className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
