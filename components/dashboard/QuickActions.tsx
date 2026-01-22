import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Ticket, Users, Settings, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const quickActions = [
  {
    title: 'Crear Evento',
    description: 'Agregar nuevo evento',
    icon: Calendar,
    href: '/admin/eventos/nuevo',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    title: 'Ver Tickets',
    description: 'Gestionar tickets',
    icon: Ticket,
    href: '/admin/tickets',
    color: 'text-green-600 bg-green-100'
  },
  {
    title: 'Usuarios',
    description: 'Administrar usuarios',
    icon: Users,
    href: '/admin/usuarios',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    title: 'Reportes',
    description: 'Ver estadísticas',
    icon: TrendingUp,
    href: '/admin/reportes',
    color: 'text-orange-600 bg-orange-100'
  },
  {
    title: 'Órdenes',
    description: 'Gestionar órdenes',
    icon: FileText,
    href: '/admin/ordenes',
    color: 'text-pink-600 bg-pink-100'
  },
  {
    title: 'Configuración',
    description: 'Ajustes del sistema',
    icon: Settings,
    href: '/admin/configuracion',
    color: 'text-gray-600 bg-gray-100'
  }
]

export function QuickActions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Acceso Rápido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className="h-auto flex flex-col items-start p-4 w-full hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.color} mb-2`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
