import { Metadata } from 'next'
import { RequireCliente } from '@/components/auth/RequireRole'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export const metadata: Metadata = {
  title: 'Mi Dashboard | Sistema',
  description: 'Tu panel personal',
}

export default function ClienteDashboardPage() {
  return (
    <RequireCliente>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Dashboard</h1>
            <p className="text-gray-600 mb-8">Bienvenido a tu panel personal</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cards */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Mis Tickets</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-green-700 mt-2">Próximos eventos</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Mis Reservas</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-blue-700 mt-2">Próximas reservas</p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Accesos Rápidos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-semibold text-gray-900">Eventos</p>
                <p className="text-sm text-gray-600">Ver catálogo</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-semibold text-gray-900">Reservar Mesa</p>
                <p className="text-sm text-gray-600">Hacer reserva</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-semibold text-gray-900">Mis Tickets</p>
                <p className="text-sm text-gray-600">Ver tickets</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="font-semibold text-gray-900">Mis Reservas</p>
                <p className="text-sm text-gray-600">Ver reservas</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Tip del día</h3>
            <p className="text-blue-800">
              ¿Sabías que puedes transferir tus tickets a otros usuarios? Ve a "Mis Tickets" para más
              opciones.
            </p>
          </div>
          </div>
        </div>
        </div>
      </div>
    </RequireCliente>
  )
}
