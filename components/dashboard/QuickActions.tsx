import { LucideIcon, Scan, ClipboardCheck, Map, CreditCard } from 'lucide-react'

interface QuickAction {
  icon: LucideIcon
  label: string
  description: string
  gradient: string
  href: string
}

const actions: QuickAction[] = [
  {
    icon: Scan,
    label: 'Escanear Tickets',
    description: 'Validar entrada',
    gradient: 'from-blue-500 to-blue-600',
    href: '/scanner',
  },
  {
    icon: ClipboardCheck,
    label: 'Recepción',
    description: 'Check-in reservas',
    gradient: 'from-purple-500 to-purple-600',
    href: '/recepcion',
  },
  {
    icon: Map,
    label: 'Plano en Vivo',
    description: 'Ver ocupación',
    gradient: 'from-green-500 to-green-600',
    href: '/plano-tiempo-real',
  },
  {
    icon: CreditCard,
    label: 'Caja',
    description: 'Punto de venta',
    gradient: 'from-orange-500 to-orange-600',
    href: '/caja',
  },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.label}
            onClick={() => (window.location.href = action.href)}
            className={`p-6 bg-gradient-to-br ${action.gradient} text-white rounded-lg hover:opacity-90 transition shadow-lg`}
          >
            <Icon className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">{action.label}</p>
            <p className="text-xs opacity-90 mt-1">{action.description}</p>
          </button>
        )
      })}
    </div>
  )
}
