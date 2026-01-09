'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RequireHost } from '@/components/auth/RequireRole'
import { useAuthStore } from '@/lib/stores/authStore'
import HostHeader from '@/components/dashboard/HostHeader'
import QuickActions from '@/components/dashboard/QuickActions'
import ActiveEventCard from '@/components/dashboard/ActiveEventCard'
import UpcomingReservations from '@/components/dashboard/UpcomingReservations'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import CapacityIndicator from '@/components/dashboard/CapacityIndicator'
import { CheckCircle, Users, CalendarCheck, Clock } from 'lucide-react'

export default function HostDashboardPage() {
  const router = useRouter()
  const { userProfile, isLoading, isInitialized } = useAuthStore()

  // Redirección si no hay usuario autenticado
  useEffect(() => {
    if (isInitialized && !isLoading && !userProfile) {
      router.push('/login')
    }
  }, [isInitialized, isLoading, userProfile, router])

  // Mostrar loading mientras se carga
  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay perfil, no renderizar nada (la redirección ya se activó)
  if (!userProfile) {
    return null
  }

  return (
    <RequireHost>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <HostHeader />

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Quick Actions */}
          <div className="mb-6">
            <QuickActions />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Tickets Validados</span>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">742</p>
              <p className="text-xs text-green-600 mt-1">↑ 12 en última hora</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Aforo Actual</span>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <CapacityIndicator current={850} max={1000} label="" />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Reservas Hoy</span>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-xs text-gray-500 mt-1">18 confirmadas</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Lista de Espera</span>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-orange-600 mt-1">Tiempo promedio: 15 min</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Active Event */}
            <ActiveEventCard />

            {/* Upcoming Reservations */}
            <UpcomingReservations />
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </RequireHost>
  )
}
