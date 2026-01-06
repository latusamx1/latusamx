'use client'

import { Button } from '@/components/ui/button'
import { CreditCard, ShieldCheck, Lock, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DiscountCodeInput from './DiscountCodeInput'

interface CartSummaryProps {
  totalItems: number
  subtotal: number
  cargoPorServicio: number
  descuento: number
  total: number
  descuentoAplicado: {
    codigo: string
    tipo: 'porcentaje' | 'monto'
    valor: number
  } | null
  formatPrice: (price: number) => string
  onApplyDiscount: (codigo: string, tipo: 'porcentaje' | 'monto', valor: number) => void
  onRemoveDiscount: () => void
}

export default function CartSummary({
  totalItems,
  subtotal,
  cargoPorServicio,
  descuento,
  total,
  descuentoAplicado,
  formatPrice,
  onApplyDiscount,
  onRemoveDiscount
}: CartSummaryProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h3>

      {/* Summary Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Subtotal ({totalItems} {totalItems === 1 ? 'ticket' : 'tickets'})
          </span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Cargo por servicio</span>
          <span className="font-medium text-gray-900">{formatPrice(cargoPorServicio)}</span>
        </div>
        {descuento > 0 && (
          <div className="flex items-center justify-between text-sm text-green-600">
            <span>Descuento</span>
            <span>-{formatPrice(descuento)}</span>
          </div>
        )}
      </div>

      {/* Discount Code */}
      <DiscountCodeInput
        descuentoAplicado={descuentoAplicado}
        onApply={onApplyDiscount}
        onRemove={onRemoveDiscount}
      />

      {/* Total */}
      <div className="flex items-center justify-between text-xl font-bold mb-6">
        <span>Total</span>
        <span className="text-blue-600">{formatPrice(total)}</span>
      </div>

      {/* Checkout Button */}
      <Button
        className="w-full h-12 mb-4"
        onClick={() => router.push('/checkout')}
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Continuar al Pago
      </Button>

      {/* Security Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Pago 100% seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Encriptación SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>Reembolso garantizado</span>
          </div>
        </div>
      </div>

      {/* Accepted Payment Methods */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-3">Aceptamos</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">VISA</span>
          </div>
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">MC</span>
          </div>
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">AMEX</span>
          </div>
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">PP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
