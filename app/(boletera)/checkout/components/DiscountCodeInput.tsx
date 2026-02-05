'use client'

import { useState } from 'react'
import { Tag, X, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { descuentosService, type ValidacionDescuento } from '@/lib/services/descuentos.service'
import { toast } from 'sonner'

interface DiscountCodeInputProps {
  eventoId?: string
  subtotal: number
  onApplyDiscount: (descuento: number, codigoId: string, codigoStr: string) => void
  onRemoveDiscount: () => void
  appliedCode?: string | null
}

export default function DiscountCodeInput({
  eventoId,
  subtotal,
  onApplyDiscount,
  onRemoveDiscount,
  appliedCode,
}: DiscountCodeInputProps) {
  const [codigo, setCodigo] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validacion, setValidacion] = useState<ValidacionDescuento | null>(null)

  const handleApply = async () => {
    if (!codigo.trim()) {
      toast.error('Ingresa un código de descuento')
      return
    }

    setIsValidating(true)
    setValidacion(null)

    try {
      const result = await descuentosService.validarCodigo(codigo, eventoId, subtotal)
      setValidacion(result)

      if (result.valido && result.descuento && result.codigo) {
        onApplyDiscount(result.descuento, result.codigo.id, result.codigo.codigo)
        toast.success(result.mensaje)
      } else {
        toast.error(result.mensaje)
      }
    } catch (error) {
      console.error('Error validating code:', error)
      toast.error('Error al validar el código')
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemove = () => {
    setCodigo('')
    setValidacion(null)
    onRemoveDiscount()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  // Si ya hay un código aplicado, mostrar estado de éxito
  if (appliedCode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Código aplicado</p>
              <code className="text-xs bg-green-100 px-2 py-0.5 rounded text-green-700 font-bold">
                {appliedCode}
              </code>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-green-700 hover:text-green-800 hover:bg-green-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        <Tag className="w-4 h-4" />
        ¿Tienes un código de descuento?
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Ingresa tu código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          disabled={isValidating}
          className="uppercase"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={isValidating || !codigo.trim()}
        >
          {isValidating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Aplicar'
          )}
        </Button>
      </div>
      {validacion && !validacion.valido && (
        <p className="text-sm text-red-600">{validacion.mensaje}</p>
      )}
    </div>
  )
}
