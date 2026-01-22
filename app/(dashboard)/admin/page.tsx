'use client'

import { useState, useEffect } from 'react'
import { RequireAdmin } from '@/components/auth/RequireRole'
import { useAuthStore } from '@/lib/stores/authStore'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import SalesChart from '@/components/dashboard/SalesChart'
import TopEventsList from '@/components/dashboard/TopEventsList'
import ActivityTable from '@/components/dashboard/ActivityTable'
import { DollarSign, Ticket, CalendarCheck, Users } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, limit, getDocs, where, Timestamp, getCountFromServer } from 'firebase/firestore'
import { Orden } from '@/types'

interface DashboardStats {
  totalVentas: number
  ventasTrend: { value: string; direction: 'up' | 'down'; label: string }
  eventosActivos: number
  eventosSubtitle: string
  reservasHoy: number
  reservasTrend?: { value: string; direction: 'up' | 'down'; label: string }
  totalClientes: number
  clientesTrend?: { value: string; direction: 'up' | 'down'; label: string }
}

interface TopEvent {
  id: string
  name: string
  ticketsSold: number
  revenue: string
  gradient: string
}

interface Activity {
  id: string
  type: 'ticket' | 'reservation' | 'event'
  title: string
  description: string
  timestamp: string
  amount?: string
  status: 'Completado' | 'Confirmada' | 'Borrador'
}

const gradients = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-red-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-yellow-600',
  'from-indigo-500 to-purple-600',
]

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userProfile } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [topEvents, setTopEvents] = useState<TopEvent[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const userName = userProfile?.nombre || 'Usuario'

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!db) return

      try {
        setLoading(true)

        // Calcular fechas
        const ahora = new Date()
        const inicioMesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
        const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
        const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0, 23, 59, 59)
        const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())

        // 1. Obtener órdenes del mes actual
        const ordenesRef = collection(db, 'ordenes')
        const ordenesMesQuery = query(
          ordenesRef,
          where('createdAt', '>=', Timestamp.fromDate(inicioMesActual)),
          orderBy('createdAt', 'desc'),
          limit(100)
        )
        const ordenesMesSnapshot = await getDocs(ordenesMesQuery)
        const ordenesMes = ordenesMesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Orden[]

        // 2. Calcular ventas del mes
        const ventasMesActual = ordenesMes
          .filter(o => o.estado === 'pagada')
          .reduce((sum, o) => sum + o.total, 0)

        // 3. Obtener órdenes del mes anterior para tendencia
        const ordenesMesAnteriorQuery = query(
          ordenesRef,
          where('createdAt', '>=', Timestamp.fromDate(inicioMesAnterior)),
          where('createdAt', '<=', Timestamp.fromDate(finMesAnterior))
        )
        const ordenesMesAnteriorSnapshot = await getDocs(ordenesMesAnteriorQuery)
        const ordenesMesAnterior = ordenesMesAnteriorSnapshot.docs.map(doc => doc.data()) as Orden[]
        const ventasMesAnterior = ordenesMesAnterior
          .filter(o => o.estado === 'pagada')
          .reduce((sum, o) => sum + o.total, 0)

        const ventasTrend = calcularTendencia(ventasMesActual, ventasMesAnterior)

        // 4. Obtener eventos activos
        const eventosRef = collection(db, 'eventos')
        const eventosActivosQuery = query(
          eventosRef,
          where('estado', '==', 'publicado'),
          where('fecha', '>=', Timestamp.now())
        )
        const eventosActivosSnapshot = await getDocs(eventosActivosQuery)
        const eventosActivos = eventosActivosSnapshot.size

        // Contar eventos creados este mes
        const eventosEsteMesQuery = query(
          eventosRef,
          where('createdAt', '>=', Timestamp.fromDate(inicioMesActual))
        )
        const eventosEsteMesSnapshot = await getDocs(eventosEsteMesQuery)
        const eventosEsteMes = eventosEsteMesSnapshot.size

        // 5. Obtener reservas de hoy (si existen)
        let reservasHoy = 0
        try {
          const reservasRef = collection(db, 'reservas')
          const reservasHoyQuery = query(
            reservasRef,
            where('fecha', '>=', Timestamp.fromDate(inicioHoy))
          )
          const reservasHoySnapshot = await getDocs(reservasHoyQuery)
          reservasHoy = reservasHoySnapshot.size
        } catch (error) {
          // Si la colección no existe, usamos 0
          reservasHoy = 0
        }

        // 6. Obtener total de clientes (usuarios)
        let totalClientes = 0
        try {
          const usuariosRef = collection(db, 'usuarios')
          const usuariosSnapshot = await getCountFromServer(usuariosRef)
          totalClientes = usuariosSnapshot.data().count
        } catch (error) {
          totalClientes = 0
        }

        // 7. Top Eventos (por tickets vendidos)
        const eventosConVentas = ordenesMes
          .filter(o => o.estado === 'pagada')
          .reduce((acc, orden) => {
            const eventoId = orden.eventoId
            const eventoTitulo = orden.evento?.titulo || 'Evento'
            const ticketsVendidos = orden.items.reduce((sum, item) => sum + item.cantidad, 0)
            const ingresos = orden.total

            if (!acc[eventoId]) {
              acc[eventoId] = {
                id: eventoId,
                name: eventoTitulo,
                ticketsSold: 0,
                revenue: 0
              }
            }

            acc[eventoId].ticketsSold += ticketsVendidos
            acc[eventoId].revenue += ingresos

            return acc
          }, {} as Record<string, { id: string; name: string; ticketsSold: number; revenue: number }>)

        const topEventsData: TopEvent[] = Object.values(eventosConVentas)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3)
          .map((event, index) => ({
            id: event.id,
            name: event.name,
            ticketsSold: event.ticketsSold,
            revenue: `$${event.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            gradient: gradients[index % gradients.length]
          }))

        // 8. Actividades recientes (últimas 3 órdenes)
        const actividadesData: Activity[] = ordenesMes.slice(0, 3).map(orden => {
          const fecha = orden.createdAt instanceof Date
            ? orden.createdAt
            : new Date((orden.createdAt as any).seconds * 1000)

          const minutosTranscurridos = Math.floor((Date.now() - fecha.getTime()) / 60000)
          let timestamp = ''

          if (minutosTranscurridos < 1) {
            timestamp = 'Hace un momento'
          } else if (minutosTranscurridos < 60) {
            timestamp = `Hace ${minutosTranscurridos} min`
          } else if (minutosTranscurridos < 1440) {
            timestamp = `Hace ${Math.floor(minutosTranscurridos / 60)} hora${Math.floor(minutosTranscurridos / 60) > 1 ? 's' : ''}`
          } else {
            timestamp = fecha.toLocaleDateString('es-MX')
          }

          return {
            id: orden.id,
            type: 'ticket' as const,
            title: 'Venta de ticket',
            description: `${orden.evento?.titulo || 'Evento'} - ${orden.items[0]?.nombre || 'Ticket'}`,
            timestamp,
            amount: `$${orden.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            status: orden.estado === 'pagada' ? 'Completado' : 'Borrador'
          }
        })

        // Establecer estados
        setStats({
          totalVentas: ventasMesActual,
          ventasTrend,
          eventosActivos,
          eventosSubtitle: `${eventosEsteMes} este mes`,
          reservasHoy,
          totalClientes,
        })

        setTopEvents(topEventsData.length > 0 ? topEventsData : [
          {
            id: '1',
            name: 'Sin eventos con ventas',
            ticketsSold: 0,
            revenue: '$0.00',
            gradient: 'from-gray-400 to-gray-500'
          }
        ])

        setActivities(actividadesData.length > 0 ? actividadesData : [
          {
            id: '1',
            type: 'event',
            title: 'Sin actividad reciente',
            description: 'No hay transacciones registradas',
            timestamp: 'Ahora',
            status: 'Borrador'
          }
        ])

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const calcularTendencia = (actual: number, anterior: number): { value: string; direction: 'up' | 'down'; label: string } => {
    if (anterior === 0) {
      return { value: '+100%', direction: 'up', label: 'vs mes anterior' }
    }
    const cambio = ((actual - anterior) / anterior) * 100
    return {
      value: `${cambio >= 0 ? '+' : ''}${Math.round(cambio)}%`,
      direction: cambio >= 0 ? 'up' : 'down',
      label: 'vs mes anterior'
    }
  }

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
                value={loading ? 'Cargando...' : `$${stats?.totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}`}
                icon={DollarSign}
                iconColor="blue"
                trend={stats?.ventasTrend}
              />
              <StatsCard
                title="Eventos Activos"
                value={loading ? 'Cargando...' : stats?.eventosActivos || 0}
                icon={Ticket}
                iconColor="purple"
                subtitle={stats?.eventosSubtitle || '0 este mes'}
              />
              <StatsCard
                title="Reservas Hoy"
                value={loading ? 'Cargando...' : stats?.reservasHoy || 0}
                icon={CalendarCheck}
                iconColor="green"
                trend={stats?.reservasTrend}
              />
              <StatsCard
                title="Clientes"
                value={loading ? 'Cargando...' : stats?.totalClientes.toLocaleString('es-MX') || '0'}
                icon={Users}
                iconColor="amber"
                trend={stats?.clientesTrend}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SalesChart />
              <TopEventsList events={topEvents} />
            </div>

            {/* Recent Activity */}
            <ActivityTable activities={activities} />
          </main>
        </div>
      </div>
    </RequireAdmin>
  )
}
