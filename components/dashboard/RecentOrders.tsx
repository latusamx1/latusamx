'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Eye } from 'lucide-react'
import Link from 'next/link'
import { Orden, EstadoOrden } from '@/types'

interface RecentOrdersProps {
  orders: Orden[]
  loading?: boolean
}

const estadoColors: Record<EstadoOrden, { bg: string; text: string; label: string }> = {
  pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
  pagada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pagada' },
  cancelada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
  reembolsada: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Reembolsada' }
}

export function RecentOrders({ orders, loading }: RecentOrdersProps) {
  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Últimas Órdenes</CardTitle>
          <CardDescription>Órdenes recientes del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-32 bg-gray-100 animate-pulse rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Últimas Órdenes</CardTitle>
          <CardDescription>Órdenes recientes del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay órdenes registradas aún</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Últimas Órdenes</CardTitle>
          <CardDescription>Órdenes recientes del sistema</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/ordenes">
            Ver todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((orden) => {
            const estadoConfig = estadoColors[orden.estado]
            const fecha = orden.createdAt instanceof Date
              ? orden.createdAt.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
              : new Date(orden.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })

            return (
              <div
                key={orden.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Avatar con inicial */}
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {orden.datosComprador.nombre.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{orden.datosComprador.nombre}</p>
                    <Badge variant="secondary" className="text-xs">
                      {orden.items.reduce((sum, item) => sum + item.cantidad, 0)} tickets
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{fecha}</span>
                    <span>•</span>
                    <span className="truncate">{orden.evento?.titulo || 'Evento'}</span>
                  </div>
                </div>

                {/* Estado y Total */}
                <div className="text-right">
                  <div className="font-semibold">
                    ${orden.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                  <Badge className={`${estadoConfig.bg} ${estadoConfig.text} border-0`}>
                    {estadoConfig.label}
                  </Badge>
                </div>

                {/* Acción */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/ordenes/${orden.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
