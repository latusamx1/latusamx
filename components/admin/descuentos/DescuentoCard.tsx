'use client'

import { CodigoDescuento } from '@/types'
import { type EstadoCodigo } from '@/lib/services/descuentos.service'
import { Pencil, Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DescuentoCardProps {
  descuento: CodigoDescuento & { estado: EstadoCodigo; ahorroTotal: number }
  onEdit: (descuento: CodigoDescuento) => void
  onDelete: (descuento: CodigoDescuento) => void
}

export default function DescuentoCard({ descuento, onEdit, onDelete }: DescuentoCardProps) {
  const fechaFin = descuento.fechaFin instanceof Date
    ? descuento.fechaFin
    : (descuento.fechaFin as any)?.toDate?.() || new Date(descuento.fechaFin)

  const handleCopy = () => {
    navigator.clipboard.writeText(descuento.codigo)
    toast.success('Código copiado al portapapeles')
  }

  const getEstadoBadge = () => {
    switch (descuento.estado) {
      case 'activo':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Activo
          </span>
        )
      case 'programado':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Programado
          </span>
        )
      case 'expirado':
        return (
          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
            Expirado
          </span>
        )
      case 'agotado':
        return (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            Agotado
          </span>
        )
      default:
        return null
    }
  }

  const getCodeColorClass = () => {
    switch (descuento.estado) {
      case 'activo':
        return descuento.tipo === 'porcentaje'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-purple-100 text-purple-700'
      case 'programado':
        return 'bg-cyan-100 text-cyan-700'
      default:
        return 'bg-gray-200 text-gray-600'
    }
  }

  const isExpired = descuento.estado === 'expirado' || descuento.estado === 'agotado'

  return (
    <div className={`p-6 hover:bg-gray-50 ${isExpired ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <code className={`px-3 py-1 ${getCodeColorClass()} font-bold rounded text-lg`}>
              {descuento.codigo}
            </code>
            {getEstadoBadge()}
          </div>
          <p className={`font-medium mb-1 ${isExpired ? 'text-gray-600' : 'text-gray-900'}`}>
            {descuento.tipo === 'porcentaje'
              ? `${descuento.valor}% de descuento`
              : `$${descuento.valor.toLocaleString('es-MX')} de descuento`}
            {(descuento as any).descripcion && ` - ${(descuento as any).descripcion}`}
          </p>
          <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
            <span>
              Usado: {descuento.usos}
              {descuento.usosMaximos ? `/${descuento.usosMaximos}` : ''} veces
            </span>
            <span>•</span>
            <span>
              {isExpired ? 'Expiró' : 'Expira'}:{' '}
              {format(fechaFin, 'd MMM yyyy', { locale: es })}
            </span>
            <span>•</span>
            <span>Ahorro total: ${descuento.ahorroTotal.toLocaleString('es-MX')}</span>
          </div>
        </div>
        {!isExpired && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(descuento)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Editar"
            >
              <Pencil className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Copiar código"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(descuento)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
