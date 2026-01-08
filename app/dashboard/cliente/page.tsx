'use client'

import { RequireCliente } from '@/components/auth/RequireRole'
import { Bell, Calendar, Ticket, DollarSign, Award, User, CreditCard, Shield, LogOut, Utensils } from 'lucide-react'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner'
import TicketsList from '@/components/dashboard/TicketsList'
import ReservationsList from '@/components/dashboard/ReservationsList'
import PointsCard from '@/components/dashboard/PointsCard'
import QuickActionCard from '@/components/dashboard/QuickActionCard'

export default function ClienteDashboardPage() {
  return (
    <RequireCliente>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EventPro</h1>
                  <p className="text-sm text-gray-500">Mi Cuenta</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                    JP
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">Juan Pérez</p>
                    <p className="text-xs text-gray-500">juan@ejemplo.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Welcome Banner */}
          <WelcomeBanner userName="Juan" />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Próximos Eventos</span>
                <Ticket className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500 mt-1">Este mes</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Reservas Activas</span>
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-xs text-gray-500 mt-1">Próximas</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Gasto Total</span>
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$8,450</p>
              <p className="text-xs text-gray-500 mt-1">Este año</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Puntos EventPro</span>
                <Award className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">1,250</p>
              <p className="text-xs text-green-600 mt-1">↑ 150 este mes</p>
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
              <PointsCard points={1250} />

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
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg text-left text-red-600">
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
