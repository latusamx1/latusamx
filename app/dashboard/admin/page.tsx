'use client'

import { useState } from 'react'
import { RequireAdmin } from '@/components/auth/RequireRole'
import { useAuthStore } from '@/lib/stores/authStore'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import SalesChart from '@/components/dashboard/SalesChart'
import TopEventsList from '@/components/dashboard/TopEventsList'
import ActivityTable from '@/components/dashboard/ActivityTable'
import { DollarSign, Ticket, CalendarCheck, Users } from 'lucide-react'

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userProfile } = useAuthStore()

  const userName = userProfile?.nombre || 'Usuario'

  return (
    <RequireAdmin>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <DashboardHeader
            title="Dashboard"
            subtitle={`Bienvenido de nuevo, ${userName}`}
            showSearch={true}
            showCreateButton={true}
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Bienvenido de nuevo, {userName}</p>
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
