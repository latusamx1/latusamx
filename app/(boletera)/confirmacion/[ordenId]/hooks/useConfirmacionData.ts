'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Orden, Ticket, Evento } from '@/types'
import { db } from '@/lib/firebase/config'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { toast } from 'sonner'

export function useConfirmacionData(ordenId: string) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orden, setOrden] = useState<Orden | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [evento, setEvento] = useState<Evento | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)

        // Verificar que Firebase esté inicializado
        if (!db) {
          console.error('Firebase no está inicializado')
          toast.error('Error de conexión. Por favor recarga la página.')
          setLoading(false)
          return
        }

        // Obtener orden
        const ordenDoc = await getDoc(doc(db, 'ordenes', ordenId))
        if (!ordenDoc.exists()) {
          toast.error('Orden no encontrada')
          router.push('/eventos')
          return
        }

        const ordenData = {
          id: ordenDoc.id,
          ...ordenDoc.data(),
          createdAt: ordenDoc.data().createdAt?.toDate(),
          updatedAt: ordenDoc.data().updatedAt?.toDate(),
        } as Orden

        setOrden(ordenData)

        // Obtener tickets de la orden
        const ticketsQuery = query(collection(db, 'tickets'), where('ordenId', '==', ordenId))
        const ticketsSnap = await getDocs(ticketsQuery)
        const ticketsData = ticketsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          fechaUso: doc.data().fechaUso?.toDate(),
        })) as Ticket[]

        setTickets(ticketsData)

        // Obtener evento
        const eventoDoc = await getDoc(doc(db, 'eventos', ordenData.eventoId))
        if (eventoDoc.exists()) {
          setEvento({
            id: eventoDoc.id,
            ...eventoDoc.data(),
          } as Evento)
        }
      } catch (error) {
        console.error('Error al cargar datos:', error)
        toast.error('Error al cargar los detalles de la orden')
      } finally {
        setLoading(false)
      }
    }

    // Esperar a que el componente esté montado y Firebase esté listo
    const inicializar = async () => {
      if (typeof window !== 'undefined' && db) {
        await cargarDatos()
      } else {
        // Si Firebase no está listo, reintentar después de un breve delay
        setTimeout(() => {
          if (db) {
            cargarDatos()
          }
        }, 100)
      }
    }

    inicializar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordenId])

  return { loading, orden, tickets, evento }
}
