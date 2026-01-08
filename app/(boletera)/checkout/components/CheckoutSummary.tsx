'use client'

import { CartItem } from '@/lib/stores/cartStore'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag, Tag } from 'lucide-react'

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  cargoPorServicio: number
  descuento: number
  total: number
}

export default function CheckoutSummary({
  items,
  subtotal,
  cargoPorServicio,
  descuento,
  total,
}: CheckoutSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2" />
        Resumen del Pedido
      </h2>

      {/* Items List */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={`${item.eventoId}-${item.tipoTicketId}`} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.eventoTitulo}</p>
              <p className="text-gray-500">
                {item.tipoTicketNombre} × {item.cantidad}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {formatPrice(item.precio * item.cantidad)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cargo por servicio</span>
          <span className="font-medium text-gray-900">{formatPrice(cargoPorServicio)}</span>
        </div>

        {descuento > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              Descuento
            </span>
            <span className="font-medium">-{formatPrice(descuento)}</span>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          Al completar tu compra, recibirás tus tickets por correo electrónico con códigos QR únicos.
        </p>
      </div>

      {/* Security Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Pago seguro</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  )
}
