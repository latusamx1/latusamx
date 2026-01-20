/**
 * Hook para validación de stock en tiempo real
 *
 * Verifica disponibilidad antes de agregar al carrito
 * Previene agregar más tickets de los disponibles
 */

import { useState, useEffect } from 'react'
import { inventarioService } from '@/lib/services/inventario.service'

interface UseStockValidationProps {
  eventoId: string
  tipoTicketId: string
  cantidadSolicitada: number
  enabled?: boolean
}

interface StockValidationResult {
  disponible: boolean
  cantidadDisponible: number
  mensaje?: string
  loading: boolean
  error?: string
}

export function useStockValidation({
  eventoId,
  tipoTicketId,
  cantidadSolicitada,
  enabled = true
}: UseStockValidationProps): StockValidationResult {
  const [result, setResult] = useState<StockValidationResult>({
    disponible: false,
    cantidadDisponible: 0,
    loading: true
  })

  useEffect(() => {
    if (!enabled || !eventoId || !tipoTicketId) {
      setResult({
        disponible: false,
        cantidadDisponible: 0,
        loading: false,
        mensaje: 'Datos incompletos'
      })
      return
    }

    let isMounted = true

    const verificar = async () => {
      try {
        setResult(prev => ({ ...prev, loading: true }))

        const verificacion = await inventarioService.verificarDisponibilidad(
          eventoId,
          tipoTicketId,
          cantidadSolicitada
        )

        if (isMounted) {
          setResult({
            disponible: verificacion.disponible,
            cantidadDisponible: verificacion.cantidadDisponible,
            mensaje: verificacion.mensaje,
            loading: false
          })
        }
      } catch (error) {
        if (isMounted) {
          setResult({
            disponible: false,
            cantidadDisponible: 0,
            loading: false,
            error: error instanceof Error ? error.message : 'Error al verificar stock'
          })
        }
      }
    }

    verificar()

    return () => {
      isMounted = false
    }
  }, [eventoId, tipoTicketId, cantidadSolicitada, enabled])

  return result
}
