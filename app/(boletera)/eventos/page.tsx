/**
 * Catálogo de eventos - Página pública con SSR
 * Basado en designs/screens/eventos.html
 */

import type { Metadata } from 'next'
import { EventosCatalogo } from './EventosCatalogo'

export const metadata: Metadata = {
  title: 'Eventos - Descubre Eventos Increíbles | LATUSAMX',
  description: 'Encuentra y compra tickets para los mejores eventos. Conciertos, festivales, deportes, teatro y más.',
  keywords: 'eventos, conciertos, festivales, tickets, boletos, espectáculos, deportes, teatro',
}

export default function EventosPage() {
  return <EventosCatalogo />
}
