'use client'

import { Orden, Ticket } from '@/types'
import { CreditCard } from 'lucide-react'

interface PaymentSummaryProps {
  orden: Orden
  tickets: Ticket[]
}

export function PaymentSummary({ orden, tickets }: PaymentSummaryProps) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Resumen de Pago</h3>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal ({tickets.length} tickets)</span>
          <span className="font-medium text-gray-900">${orden.subtotal.toFixed(2)}</span>
        </div>

        {orden.descuento > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Descuento</span>
            <span className="font-medium text-green-600">-${orden.descuento.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold">
        <span>Total Pagado</span>
        <span className="text-green-600">${orden.total.toFixed(2)}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <CreditCard className="h-4 w-4" />
        <span>Pagado con {orden.metodoPago}</span>
      </div>
    </div>
  )
}
