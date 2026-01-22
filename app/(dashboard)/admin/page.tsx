'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { Orden } from '@/types'
import { KPICard } from '@/components/dashboard/KPICard'
import { EventsChart } from '@/components/dashboard/EventsChart'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { DollarSign, Calendar, Ticket, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalVentas: number
  ventasMesAnterior: number
  eventosActivos: number
  eventosMesAnterior: number
  ticketsVendidos: number
  ticketsMesAnterior: number
  ordenesTotal: number
  ordenesMesAnterior: number
}

interface ChartData {
  mes: string
  eventos: number
  ticketsVendidos: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Orden[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

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

        // 1. Obtener órdenes del mes actual
        const ordenesRef = collection(db, 'ordenes')
        const ordenesQuery = query(
          ordenesRef,
          where('createdAt', '>=', Timestamp.fromDate(inicioMesActual)),
          orderBy('createdAt', 'desc')
        )
        const ordenesSnapshot = await getDocs(ordenesQuery)
        const ordenesMesActual = ordenesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Orden[]

        // 2. Obtener órdenes del mes anterior
        const ordenesMesAnteriorQuery = query(
          ordenesRef,
          where('createdAt', '>=', Timestamp.fromDate(inicioMesAnterior)),
          where('createdAt', '<=', Timestamp.fromDate(finMesAnterior)),
          orderBy('createdAt', 'desc')
        )
        const ordenesMesAnteriorSnapshot = await getDocs(ordenesMesAnteriorQuery)
        const ordenesMesAnteriorData = ordenesMesAnteriorSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Orden[]

        // 3. Calcular estadísticas de órdenes
        const ventasMesActual = ordenesMesActual
          .filter(o => o.estado === 'pagada')
          .reduce((sum, o) => sum + o.total, 0)

        const ventasMesAnterior = ordenesMesAnteriorData
          .filter(o => o.estado === 'pagada')
          .reduce((sum, o) => sum + o.total, 0)

        const ticketsMesActual = ordenesMesActual
          .filter(o => o.estado === 'pagada')
          .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.cantidad, 0), 0)

        const ticketsMesAnterior = ordenesMesAnteriorData
          .filter(o => o.estado === 'pagada')
          .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.cantidad, 0), 0)

        // 4. Obtener eventos activos
        const eventosRef = collection(db, 'eventos')
        const eventosQuery = query(
          eventosRef,
          where('estado', '==', 'publicado'),
          where('fecha', '>=', Timestamp.now())
        )
        const eventosSnapshot = await getDocs(eventosQuery)
        const eventosActivos = eventosSnapshot.size

        // 5. Obtener eventos del mes anterior (para comparación)
        const eventosMesAnteriorQuery = query(
          eventosRef,
          where('estado', '==', 'publicado'),
          where('createdAt', '>=', Timestamp.fromDate(inicioMesAnterior)),
          where('createdAt', '<=', Timestamp.fromDate(finMesAnterior))
        )
        const eventosMesAnteriorSnapshot = await getDocs(eventosMesAnteriorQuery)

        // 6. Preparar datos para gráficas (últimos 6 meses)
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const chartDataTemp: ChartData[] = []

        for (let i = 5; i >= 0; i--) {
          const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
          const mesNombre = meses[fecha.getMonth()]

          // Simplificado: datos mock para demostración
          chartDataTemp.push({
            mes: mesNombre,
            eventos: Math.floor(Math.random() * 10) + 5,
            ticketsVendidos: Math.floor(Math.random() * 500) + 200
          })
        }

        // 7. Establecer estados
        setStats({
          totalVentas: ventasMesActual,
          ventasMesAnterior: ventasMesAnterior,
          eventosActivos: eventosActivos,
          eventosMesAnterior: eventosMesAnteriorSnapshot.size,
          ticketsVendidos: ticketsMesActual,
          ticketsMesAnterior: ticketsMesAnterior,
          ordenesTotal: ordenesMesActual.length,
          ordenesMesAnterior: ordenesMesAnteriorData.length
        })

        setRecentOrders(ordenesMesActual.slice(0, 5))
        setChartData(chartDataTemp)

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calcular tendencias
  const calcularTendencia = (actual: number, anterior: number) => {
    if (anterior === 0) return { value: 100, isPositive: true }
    const cambio = ((actual - anterior) / anterior) * 100
    return {
      value: Math.abs(Math.round(cambio)),
      isPositive: cambio >= 0
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido al panel de administración</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Ventas del Mes"
            value={`$${stats?.totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}`}
            subtitle="Total de ingresos"
            icon={DollarSign}
            trend={stats ? {
              ...calcularTendencia(stats.totalVentas, stats.ventasMesAnterior),
              label: 'vs mes anterior'
            } : undefined}
            loading={loading}
          />

          <KPICard
            title="Eventos Activos"
            value={stats?.eventosActivos || 0}
            subtitle="Eventos publicados"
            icon={Calendar}
            trend={stats ? {
              ...calcularTendencia(stats.eventosActivos, stats.eventosMesAnterior),
              label: 'vs mes anterior'
            } : undefined}
            loading={loading}
          />

          <KPICard
            title="Tickets Vendidos"
            value={stats?.ticketsVendidos || 0}
            subtitle="Este mes"
            icon={Ticket}
            trend={stats ? {
              ...calcularTendencia(stats.ticketsVendidos, stats.ticketsMesAnterior),
              label: 'vs mes anterior'
            } : undefined}
            loading={loading}
          />

          <KPICard
            title="Órdenes"
            value={stats?.ordenesTotal || 0}
            subtitle="Total del mes"
            icon={TrendingUp}
            trend={stats ? {
              ...calcularTendencia(stats.ordenesTotal, stats.ordenesMesAnterior),
              label: 'vs mes anterior'
            } : undefined}
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-7 mb-8">
          <EventsChart data={chartData} loading={loading} />
          <QuickActions />
        </div>

        {/* Recent Orders */}
        <div className="grid gap-4 md:grid-cols-4">
          <RecentOrders orders={recentOrders} loading={loading} />
        </div>
      </div>
    </div>
  )
}
