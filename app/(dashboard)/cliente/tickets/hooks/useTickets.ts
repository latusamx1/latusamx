'use client'

import { useState, useEffect, useMemo } from 'react'
import { Ticket, Evento } from '@/types'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { toast } from 'sonner'

export type TicketFilter = 'todos' | 'proximos' | 'pasados' | 'usados'

interface TicketConEvento extends Ticket {
  evento?: Evento
}

export function useTickets(userId: string | null) {
  const [tickets, setTickets] = useState<TicketConEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TicketFilter>('todos')

  useEffect(() => {
    const cargarTickets = async () => {
      if (!userId || !db) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Obtener todas las órdenes del usuario
        const ordenesQuery = query(collection(db, 'ordenes'), where('userId', '==', userId))
        const ordenesSnap = await getDocs(ordenesQuery)
        const ordenesIds = ordenesSnap.docs.map((doc) => doc.id)

        if (ordenesIds.length === 0) {
          setTickets([])
          setLoading(false)
          return
        }

        // Obtener tickets de esas órdenes
        const ticketsPromises = ordenesIds.map(async (ordenId) => {
          const ticketsQuery = query(collection(db, 'tickets'), where('ordenId', '==', ordenId))
          const ticketsSnap = await getDocs(ticketsQuery)
          return ticketsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            fechaUso: doc.data().fechaUso?.toDate(),
          })) as Ticket[]
        })

        const ticketsArrays = await Promise.all(ticketsPromises)
        const allTickets = ticketsArrays.flat()

        // Obtener información de eventos
        const ticketsConEvento = await Promise.all(
          allTickets.map(async (ticket) => {
            try {
              const eventoDoc = await getDoc(doc(db, 'eventos', ticket.eventoId))
              if (eventoDoc.exists()) {
                return {
                  ...ticket,
                  evento: {
                    id: eventoDoc.id,
                    ...eventoDoc.data(),
                  } as Evento,
                }
              }
              return ticket
            } catch (error) {
              console.error('Error al cargar evento:', error)
              return ticket
            }
          })
        )

        setTickets(ticketsConEvento)
      } catch (error) {
        console.error('Error al cargar tickets:', error)
        toast.error('Error al cargar tus tickets')
      } finally {
        setLoading(false)
      }
    }

    cargarTickets()
  }, [userId])

  // Filtrar tickets
  const ticketsFiltrados = useMemo(() => {
    const now = new Date()

    switch (filter) {
      case 'proximos':
        return tickets.filter((ticket) => {
          if (!ticket.evento?.fecha) return false
          const fechaEvento = ticket.evento.fecha.toDate
            ? ticket.evento.fecha.toDate()
            : new Date(ticket.evento.fecha)
          return fechaEvento > now && !ticket.usado
        })
      case 'pasados':
        return tickets.filter((ticket) => {
          if (!ticket.evento?.fecha) return false
          const fechaEvento = ticket.evento.fecha.toDate
            ? ticket.evento.fecha.toDate()
            : new Date(ticket.evento.fecha)
          return fechaEvento < now
        })
      case 'usados':
        return tickets.filter((ticket) => ticket.usado)
      default:
        return tickets
    }
  }, [tickets, filter])

  // Contar tickets por categoría
  const counts = useMemo(() => {
    const now = new Date()
    return {
      todos: tickets.length,
      proximos: tickets.filter((t) => {
        if (!t.evento?.fecha) return false
        const fecha = t.evento.fecha.toDate ? t.evento.fecha.toDate() : new Date(t.evento.fecha)
        return fecha > now && !t.usado
      }).length,
      pasados: tickets.filter((t) => {
        if (!t.evento?.fecha) return false
        const fecha = t.evento.fecha.toDate ? t.evento.fecha.toDate() : new Date(t.evento.fecha)
        return fecha < now
      }).length,
      usados: tickets.filter((t) => t.usado).length,
    }
  }, [tickets])

  return {
    tickets: ticketsFiltrados,
    loading,
    filter,
    setFilter,
    counts,
  }
}
