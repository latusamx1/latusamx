'use client'

import { useRouter } from 'next/navigation'
import { RequireCliente } from '@/components/auth/RequireRole'
import { useAuthStore } from '@/lib/stores/authStore'
import { logout } from '@/lib/firebase/auth'
import ClienteHeader from '@/components/dashboard/ClienteHeader'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner'
import TicketsList from '@/components/dashboard/TicketsList'
import ReservationsList from '@/components/dashboard/ReservationsList'
import PointsCard from '@/components/dashboard/PointsCard'
import QuickActionCard from '@/components/dashboard/QuickActionCard'
import { Calendar, Ticket, DollarSign, Award, User, CreditCard, Shield, LogOut, Utensils, Bell } from 'lucide-react'

export default function ClienteDashboardPage() {
  const router = useRouter()
  const { userProfile, reset } = useAuthStore()

  const userName = userProfile?.nombre || 'Usuario'
  const firstName = userName.split(' ')[0] // Obtener solo el primer nombre

  const handleLogout = async () => {
    try {
      await logout()
      reset()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión. Por favor intenta de nuevo.')
    }
  }

  return (
    <RequireCliente>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <ClienteHeader />

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Welcome Banner */}
          <WelcomeBanner userName={firstName} />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Próximos Eventos</span>
                <Ticket className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500 mt-1">Este mes</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Reservas Activas</span>
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500 mt-1">Próximas</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Gasto Total</span>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$0</p>
              <p className="text-xs text-gray-500 mt-1">Este año</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Puntos</span>
                <Award className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-green-600 mt-1">Acumulados</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <QuickActionCard
              icon={Ticket}
              title="Comprar Tickets"
              description="Explora eventos y compra entradas"
              color="blue"
              href="/eventos"
            />
            <QuickActionCard
              icon={Utensils}
              title="Hacer Reserva"
              description="Reserva mesa en nuestros espacios"
              color="purple"
              href="/sucursales"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* My Tickets */}
            <div className="lg:col-span-2">
              <TicketsList />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* My Reservations */}
              <ReservationsList />

              {/* EventPro Points */}
              <PointsCard points={0} />

              {/* Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Configuración</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Editar perfil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Métodos de pago</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Notificaciones</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Privacidad</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-left text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireCliente>
  )
}
