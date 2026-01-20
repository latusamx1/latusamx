/**
 * Indicador Visual de Stock Disponible
 *
 * Muestra la cantidad de tickets disponibles con colores según disponibilidad
 * Previene agregar más de lo disponible
 */

'use client'

import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface StockIndicatorProps {
  disponibles: number
  total: number
  size?: 'sm' | 'md' | 'lg'
  showMessage?: boolean
}

export function StockIndicator({
  disponibles,
  total,
  size = 'md',
  showMessage = true
}: StockIndicatorProps) {
  const porcentaje = (disponibles / total) * 100
  const agotado = disponibles === 0
  const pocosDisponibles = disponibles <= total * 0.2 && disponibles > 0
  const disponible = disponibles > total * 0.2

  const getColor = () => {
    if (agotado) return 'text-red-600 bg-red-50 border-red-200'
    if (pocosDisponibles) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const getIcon = () => {
    if (agotado) return <XCircle className="w-4 h-4" />
    if (pocosDisponibles) return <AlertCircle className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  const getMessage = () => {
    if (agotado) return 'Agotado'
    if (pocosDisponibles) return `¡Solo quedan ${disponibles}!`
    return `${disponibles} disponibles`
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className="space-y-2">
      {showMessage && (
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${getColor()}`}>
          {getIcon()}
          <span className="font-medium">{getMessage()}</span>
        </div>
      )}

      {/* Barra de progreso visual */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Stock</span>
          <span>
            {disponibles} / {total}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              agotado
                ? 'bg-red-500'
                : pocosDisponibles
                  ? 'bg-orange-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Componente simplificado tipo badge
export function StockBadge({ disponibles, total }: { disponibles: number; total: number }) {
  const agotado = disponibles === 0
  const pocosDisponibles = disponibles <= total * 0.2 && disponibles > 0

  return (
    <Badge
      variant={agotado ? 'destructive' : pocosDisponibles ? 'warning' : 'success'}
      className="gap-1"
    >
      {agotado ? (
        <>
          <XCircle className="w-3 h-3" />
          Agotado
        </>
      ) : pocosDisponibles ? (
        <>
          <AlertCircle className="w-3 h-3" />
          ¡Solo {disponibles}!
        </>
      ) : (
        <>
          <CheckCircle className="w-3 h-3" />
          {disponibles} disponibles
        </>
      )}
    </Badge>
  )
}

// Componente para mostrar durante la validación
export function StockValidating() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Clock className="w-4 h-4 animate-pulse" />
      <span>Verificando disponibilidad...</span>
    </div>
  )
}
