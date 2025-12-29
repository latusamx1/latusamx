/**
 * Detalle de evento - Página con SSR y Dynamic Metadata
 * Basado en designs/screens/evento-detalle.html
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { Evento } from '@/types'
import { EventoDetalle } from './EventoDetalle'

interface EventoPageProps {
  params: {
    id: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EventoPageProps): Promise<Metadata> {
  try {
    const eventoDoc = await getDoc(doc(db!, 'eventos', params.id))

    if (!eventoDoc.exists()) {
      return {
        title: 'Evento no encontrado',
      }
    }

    const evento = { id: eventoDoc.id, ...eventoDoc.data() } as Evento

    const formatFecha = (timestamp: any) => {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date)
    }

    return {
      title: `${evento.titulo} - ${formatFecha(evento.fecha)} | LATUSAMX`,
      description: evento.descripcion || `Compra tickets para ${evento.titulo}. ${formatFecha(evento.fecha)} en ${evento.venue?.nombre || 'Venue por confirmar'}`,
      keywords: `${evento.titulo}, ${evento.categoria}, evento, tickets, boletos, ${evento.venue?.nombre || ''}`,
      openGraph: {
        title: evento.titulo,
        description: evento.descripcion,
        images: evento.imagenPortada ? [evento.imagenPortada] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: evento.titulo,
        description: evento.descripcion,
        images: evento.imagenPortada ? [evento.imagenPortada] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Evento | LATUSAMX',
    }
  }
}

export default async function EventoPage({ params }: EventoPageProps) {
  try {
    const eventoDoc = await getDoc(doc(db!, 'eventos', params.id))

    if (!eventoDoc.exists()) {
      notFound()
    }

    const evento = { id: eventoDoc.id, ...eventoDoc.data() } as Evento

    return <EventoDetalle evento={evento} />
  } catch (error) {
    console.error('Error fetching evento:', error)
    notFound()
  }
}
