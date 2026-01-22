'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface EventsChartProps {
  data: {
    mes: string
    eventos: number
    ticketsVendidos: number
  }[]
  loading?: boolean
}

export function EventsChart({ data, loading }: EventsChartProps) {
  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Eventos y Tickets</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Eventos y Tickets</CardTitle>
        <CardDescription>Últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="mes"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].payload.mes}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">Eventos:</span>
                          <span className="font-bold text-blue-600">{payload[0].value}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">Tickets:</span>
                          <span className="font-bold text-green-600">{payload[1].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend />
            <Bar dataKey="eventos" fill="#3b82f6" name="Eventos" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ticketsVendidos" fill="#10b981" name="Tickets Vendidos" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
