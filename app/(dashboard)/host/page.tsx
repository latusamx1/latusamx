'use client'

import { useState } from 'react'
import { RequireHost } from '@/components/auth/RequireRole'
import { useAuthStore } from '@/lib/stores/authStore'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import { CheckCircle, Users, CalendarCheck, Clock, Scan, ClipboardCheck, LayoutGrid, ListOrdered, Search as SearchIcon, BarChart3 } from 'lucide-react'

export default function HostDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userProfile } = useAuthStore()

  const userName = userProfile?.nombre || 'Usuario'

  const quickActions = [
    { icon: Scan, label: 'Scanner QR', description: 'Validar tickets', href: '/host/scanner' },
    { icon: ClipboardCheck, label: 'Check-in', description: 'Reservas', href: '/host/checkin' },
    { icon: LayoutGrid, label: 'Plano Mesas', description: 'Estado actual', href: '/host/plano' },
    { icon: ListOrdered, label: 'Lista Espera', description: 'Gestionar cola', href: '/host/lista-espera' },
    { icon: SearchIcon, label: 'Buscar', description: 'Tickets/Reservas', href: '/host/buscar' },
    { icon: BarChart3, label: 'Control Aforo', description: 'Ver estadísticas', href: '/host/aforo' },
  ]

  return (
    <RequireHost>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <DashboardHeader
            title="Dashboard Host"
            subtitle={`Bienvenido de nuevo, ${userName}`}
            showSearch={false}
            showCreateButton={false}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Host</h1>
              <p className="text-gray-600 mt-1">Herramientas operativas para recepción</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Tickets Validados"
                value="0"
                icon={CheckCircle}
                iconColor="green"
                subtitle="↑ 0 en última hora"
              />
              <StatsCard
                title="Aforo Actual"
                value="0 / 0"
                icon={Users}
                iconColor="blue"
                subtitle="Capacidad disponible"
              />
              <StatsCard
                title="Reservas Hoy"
                value="0"
                icon={CalendarCheck}
                iconColor="purple"
                subtitle="0 confirmadas"
              />
              <StatsCard
                title="Lista de Espera"
                value="0"
                icon={Clock}
                iconColor="amber"
                subtitle="Tiempo promedio: 0 min"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Herramientas Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <a
                      key={action.label}
                      href={action.href}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{action.label}</p>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Módulo Host en Desarrollo</h3>
                <p className="text-gray-600 mb-4">
                  Las herramientas de recepción, validación de tickets y gestión de reservas estarán disponibles próximamente.
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Clock className="w-4 h-4" />
                  Próximamente disponible
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RequireHost>
  )
}
