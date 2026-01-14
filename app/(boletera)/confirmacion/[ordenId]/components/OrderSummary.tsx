'use client'

import { Orden } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderSummaryProps {
  orden: Orden
}

export function OrderSummary({ orden }: OrderSummaryProps) {
  return (
    <div className="border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-sm text-gray-600">Número de Orden</p>
          <p className="text-2xl font-bold text-gray-900">#{orden.id}</p>
        </div>
        <div className="text-right">
          <p className="mb-1 text-sm text-gray-600">Fecha</p>
          <p className="font-semibold text-gray-900">
            {format(orden.createdAt, "dd MMMM, yyyy - hh:mm a", { locale: es })}
          </p>
        </div>
      </div>
    </div>
  )
}
