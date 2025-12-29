/**
 * Detalle de evento - Página cliente
 * Basado en designs/screens/evento-detalle.html
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { Evento } from '@/types'
import { EventoDetalle } from './EventoDetalle'

export default function EventoPage() {
  const params = useParams()
  const [evento, setEvento] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchEvento() {
      if (!db || !params.id) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        const eventoDoc = await getDoc(doc(db, 'eventos', params.id as string))

        if (!eventoDoc.exists()) {
          setError(true)
        } else {
          setEvento({ id: eventoDoc.id, ...eventoDoc.data() } as Evento)
        }
      } catch (err) {
        console.error('Error fetching evento:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchEvento()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando evento...</p>
        </div>
      </div>
    )
  }

  if (error || !evento) {
    return notFound()
  }

  return <EventoDetalle evento={evento} />
}
