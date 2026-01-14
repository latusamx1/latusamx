/**
 * Hook para gestionar órdenes
 */

import { useState, useEffect } from 'react'
import { ordenesService } from '@/lib/services/ordenes.service'
import { Orden } from '@/types'
import { toast } from 'sonner'

export function useOrden(ordenId: string | null) {
  const [orden, setOrden] = useState<Orden | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ordenId) return

    const cargarOrden = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ordenesService.obtenerPorId(ordenId)
        setOrden(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar orden'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    cargarOrden()
  }, [ordenId])

  return { orden, loading, error }
}

export function useOrdenes(userId: string | null) {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarOrdenes = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      const data = await ordenesService.obtenerPorUsuario(userId)
      setOrdenes(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar órdenes'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarOrdenes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return { ordenes, loading, error, refetch: cargarOrdenes }
}
