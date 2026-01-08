'use client'

import { RequireHost } from '@/components/auth/RequireRole'
import { Bell } from 'lucide-react'
import Avatar from '@/components/dashboard/Avatar'
import StatsCard from '@/components/dashboard/StatsCard'
import QuickActions from '@/components/dashboard/QuickActions'
import ActiveEventCard from '@/components/dashboard/ActiveEventCard'
import UpcomingReservations from '@/components/dashboard/UpcomingReservations'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import CapacityIndicator from '@/components/dashboard/CapacityIndicator'
import { CheckCircle, Users, CalendarCheck, Clock } from 'lucide-react'

export default function HostDashboardPage() {
  return (
    <RequireHost>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                  {/* Menu icon placeholder - could add mobile menu */}
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dashboard Host</h1>
                  <p className="text-sm text-gray-500">EventPro Polanco</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    MG
                  </div>
                  <span className="hidden md:block text-sm font-medium">María González</span>
                </div>
              </div>
            </div>
          </div>
        </header>

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
