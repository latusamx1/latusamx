import { Metadata } from 'next'
import { RequireAdmin } from '@/components/auth/RequireRole'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export const metadata: Metadata = {
  title: 'Dashboard Admin | Sistema',
  description: 'Panel de administración del sistema',
}

export default function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
            <p className="text-gray-600 mb-8">Bienvenido al panel de administración</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* KPI Cards */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Eventos Activos</h3>
                <p className="text-3xl font-bold text-red-600">0</p>
                <p className="text-sm text-red-700 mt-2">Gestión completa de eventos</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Reservas Hoy</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-blue-700 mt-2">Reservas programadas</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Usuarios</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-green-700 mt-2">Total registrados</p>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Eventos</p>
                  <p className="text-sm text-gray-600">Gestionar eventos</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Reservas</p>
                  <p className="text-sm text-gray-600">Ver reservas</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Usuarios</p>
                  <p className="text-sm text-gray-600">Gestionar usuarios</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-semibold text-gray-900">Reportes</p>
                  <p className="text-sm text-gray-600">Ver estadísticas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </RequireAdmin>
  )
}
