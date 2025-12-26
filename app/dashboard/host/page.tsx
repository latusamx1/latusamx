import { Metadata } from 'next'
import { RequireHost } from '@/components/auth/RequireRole'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export const metadata: Metadata = {
  title: 'Dashboard Host | Sistema',
  description: 'Panel operativo de recepción',
}

export default function HostDashboardPage() {
  return (
    <RequireHost>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Host</h1>
            <p className="text-gray-600 mb-8">Herramientas operativas para recepción</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KPI Cards */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Reservas Hoy</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-blue-700 mt-2">Pendientes de check-in</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Tickets Hoy</h3>
                <p className="text-3xl font-bold text-purple-600">0</p>
                <p className="text-sm text-purple-700 mt-2">Para validar</p>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Herramientas Rápidas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Scanner QR</p>
                  <p className="text-sm text-gray-600">Validar tickets</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Check-in</p>
                  <p className="text-sm text-gray-600">Reservas</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Plano Mesas</p>
                  <p className="text-sm text-gray-600">Estado actual</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Lista Espera</p>
                  <p className="text-sm text-gray-600">Gestionar cola</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Buscar</p>
                  <p className="text-sm text-gray-600">Tickets/Reservas</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Control Aforo</p>
                  <p className="text-sm text-gray-600">Ver estadísticas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </RequireHost>
  )
}
