'use client'

import { useState } from 'react'
import { RequireAdmin } from '@/components/auth/RequireRole'
import { Menu, Search, Plus } from 'lucide-react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import StatsCard from '@/components/dashboard/StatsCard'
import NotificationBell from '@/components/dashboard/NotificationBell'
import SalesChart from '@/components/dashboard/SalesChart'
import TopEventsList from '@/components/dashboard/TopEventsList'
import ActivityTable from '@/components/dashboard/ActivityTable'
import { DollarSign, Ticket, CalendarCheck, Users } from 'lucide-react'

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <RequireAdmin>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Buscar eventos, reservas..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <NotificationBell count={3} />
              <button className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Bienvenido de nuevo, Juan</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Ventas"
                value="$45,250"
                icon={DollarSign}
                iconColor="blue"
                trend={{ value: '+12%', direction: 'up', label: 'vs mes anterior' }}
              />
              <StatsCard
                title="Eventos Activos"
                value="24"
                icon={Ticket}
                iconColor="purple"
                subtitle="8 este mes"
              />
              <StatsCard
                title="Reservas Hoy"
                value="156"
                icon={CalendarCheck}
                iconColor="green"
                trend={{ value: '-5%', direction: 'down', label: 'vs ayer' }}
              />
              <StatsCard
                title="Clientes"
                value="2,543"
                icon={Users}
                iconColor="amber"
                trend={{ value: '+23%', direction: 'up', label: 'este mes' }}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SalesChart />
              <TopEventsList />
            </div>

            {/* Recent Activity */}
            <ActivityTable />
          </main>
        </div>
      </div>
    </RequireAdmin>
  )
}
