'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface DiscountCodeInputProps {
  descuentoAplicado: {
    codigo: string
    tipo: 'porcentaje' | 'monto'
    valor: number
  } | null
  onApply: (codigo: string, tipo: 'porcentaje' | 'monto', valor: number) => void
  onRemove: () => void
}

export default function DiscountCodeInput({ descuentoAplicado, onApply, onRemove }: DiscountCodeInputProps) {
  const [codigoInput, setCodigoInput] = useState('')
  const [validando, setValidando] = useState(false)

  const handleValidarCodigo = () => {
    if (!codigoInput.trim()) {
      return
    }

    setValidando(true)

    // Simulación de validación
    setTimeout(() => {
      const codigosValidos: Record<string, { tipo: 'porcentaje' | 'monto', valor: number }> = {
        'PROMO10': { tipo: 'monto', valor: 50 },
        'BIENVENIDO10': { tipo: 'porcentaje', valor: 10 },
        'VIP20': { tipo: 'porcentaje', valor: 20 },
      }

      const codigo = codigoInput.toUpperCase()
      const descuento = codigosValidos[codigo]

      if (descuento) {
        onApply(codigo, descuento.tipo, descuento.valor)
        setCodigoInput('')
      }

      setValidando(false)
    }, 800)
  }

  return (
    <div className="mb-4 pb-4 border-b border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Código de Descuento
      </label>
      {descuentoAplicado ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mb-2">
          <span className="text-sm font-medium text-green-600">
            {descuentoAplicado.codigo} aplicado
          </span>
          <button
            onClick={onRemove}
            className="text-xs text-green-600 hover:text-green-700 underline"
          >
            Remover
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ingresa código"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleValidarCodigo()
              }
            }}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleValidarCodigo}
            disabled={validando}
            className="px-4"
          >
            {validando ? 'Validando...' : 'Aplicar'}
          </Button>
        </div>
      )}
    </div>
  )
}
