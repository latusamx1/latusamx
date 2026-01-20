/**
 * API Route para Seed de Eventos
 *
 * Ejecutar: POST http://localhost:3000/api/seed-eventos
 * O desde el navegador: GET http://localhost:3000/api/seed-eventos
 */

import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const eventos = [
  // EVENTO 1: Stock Alto
  {
    titulo: 'Festival Electrónico Winter 2026',
    descripcion: 'El festival de música electrónica más esperado del año. Con los mejores DJs internacionales y producción de clase mundial. Incluye 3 escenarios, zona VIP con open bar, y experiencias inmersivas.',
    categoria: 'festival',
    fecha: Timestamp.fromDate(new Date('2026-02-14T20:00:00')),
    fechaFin: Timestamp.fromDate(new Date('2026-02-15T06:00:00')),
    horaInicio: '20:00',
    horaFin: '06:00',
    venueId: 'venue-001',
    venue: {
      id: 'venue-001',
      nombre: 'Foro Sol',
      direccion: 'Viaducto Río de la Piedad s/n',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '08400',
      capacidad: 65000,
      ubicacion: { lat: 19.406393, lng: -99.090584 },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    imagenPortada: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
    imagenPublicId: 'eventos/festival-electronico-2026',
    artistas: ['Martin Garrix', 'Carl Cox', 'Charlotte de Witte', 'Amelie Lens'],
    tiposTickets: [
      {
        id: 'ticket-festival-general',
        nombre: 'General',
        descripcion: 'Acceso general a los 3 escenarios',
        precio: 1500,
        cantidad: 40000,
        disponibles: 40000,
        ventaMinima: 1,
        ventaMaxima: 10,
        orden: 1
      },
      {
        id: 'ticket-festival-vip',
        nombre: 'VIP',
        descripcion: 'Acceso VIP + Open Bar + Área exclusiva',
        precio: 3500,
        cantidad: 5000,
        disponibles: 5000,
        ventaMinima: 1,
        ventaMaxima: 6,
        orden: 2
      },
      {
        id: 'ticket-festival-platinum',
        nombre: 'Platinum',
        descripcion: 'Todo incluido + Meet & Greet con artistas',
        precio: 8500,
        cantidad: 500,
        disponibles: 500,
        ventaMinima: 1,
        ventaMaxima: 4,
        orden: 3
      }
    ],
    estado: 'publicado',
    destacado: true,
    tags: ['electronica', 'festival', 'techno', 'house'],
    precioMinimo: 1500,
    createdBy: 'admin',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // EVENTO 2: Stock Medio
  {
    titulo: 'Concierto: Los Ángeles Azules',
    descripcion: 'La legendaria banda de cumbia sinfónica presenta su nuevo álbum "De Plaza en Plaza Tour 2026". Una noche mágica llena de éxitos y sorpresas especiales con invitados de lujo.',
    categoria: 'concierto',
    fecha: Timestamp.fromDate(new Date('2026-02-08T21:00:00')),
    horaInicio: '21:00',
    horaFin: '23:30',
    venueId: 'venue-002',
    venue: {
      id: 'venue-002',
      nombre: 'Auditorio Nacional',
      direccion: 'Paseo de la Reforma 50',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '11580',
      capacidad: 10000,
      ubicacion: { lat: 19.425635, lng: -99.191788 },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    imagenPortada: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200',
    imagenPublicId: 'eventos/angeles-azules-2026',
    artistas: ['Los Ángeles Azules', 'Invitados Especiales'],
    tiposTickets: [
      {
        id: 'ticket-cumbia-general',
        nombre: 'General',
        descripcion: 'Acceso general de pie',
        precio: 800,
        cantidad: 5000,
        disponibles: 1200,
        ventaMinima: 1,
        ventaMaxima: 8,
        orden: 1
      },
      {
        id: 'ticket-cumbia-palco',
        nombre: 'Palco',
        descripcion: 'Asientos en palcos con excelente vista',
        precio: 1800,
        cantidad: 3000,
        disponibles: 450,
        ventaMinima: 1,
        ventaMaxima: 6,
        orden: 2
      },
      {
        id: 'ticket-cumbia-vip',
        nombre: 'VIP Meet & Greet',
        descripcion: 'Acceso VIP + Foto con la banda + Mercancía exclusiva',
        precio: 4500,
        cantidad: 200,
        disponibles: 8,
        ventaMinima: 1,
        ventaMaxima: 2,
        orden: 3
      }
    ],
    estado: 'publicado',
    destacado: true,
    tags: ['cumbia', 'mexicano', 'bailar', 'familia'],
    precioMinimo: 800,
    createdBy: 'admin',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // EVENTO 3: Stock Bajo
  {
    titulo: 'Stand Up: Franco Escamilla',
    descripcion: 'El comediante #1 de habla hispana regresa con su tour "Payaso Tour 2026". Una noche de risas garantizadas con nuevo material nunca antes visto. ¡ÚLTIMAS ENTRADAS!',
    categoria: 'teatro',
    fecha: Timestamp.fromDate(new Date('2026-01-31T20:30:00')),
    horaInicio: '20:30',
    horaFin: '22:30',
    venueId: 'venue-003',
    venue: {
      id: 'venue-003',
      nombre: 'Teatro Metropólitan',
      direccion: 'Independencia 90',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '06050',
      capacidad: 3000,
      ubicacion: { lat: 19.437679, lng: -99.154213 },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    imagenPortada: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200',
    imagenPublicId: 'eventos/franco-escamilla-2026',
    artistas: ['Franco Escamilla'],
    tiposTickets: [
      {
        id: 'ticket-standup-general',
        nombre: 'General',
        descripcion: 'Asientos generales',
        precio: 650,
        cantidad: 1500,
        disponibles: 12,
        ventaMinima: 1,
        ventaMaxima: 4,
        orden: 1
      },
      {
        id: 'ticket-standup-preferente',
        nombre: 'Preferente',
        descripcion: 'Asientos preferenciales zona media',
        precio: 1200,
        cantidad: 1000,
        disponibles: 5,
        ventaMinima: 1,
        ventaMaxima: 4,
        orden: 2
      },
      {
        id: 'ticket-standup-vip',
        nombre: 'VIP Front Row',
        descripcion: 'Primera fila + Foto con Franco después del show',
        precio: 2500,
        cantidad: 50,
        disponibles: 0,
        ventaMinima: 1,
        ventaMaxima: 2,
        orden: 3
      }
    ],
    estado: 'publicado',
    destacado: false,
    tags: ['comedia', 'stand-up', 'humor', 'franco-escamilla'],
    precioMinimo: 650,
    createdBy: 'admin',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase no inicializado' },
        { status: 500 }
      )
    }

    const eventosRef = collection(db, 'eventos')
    const created = []

    for (const evento of eventos) {
      const docRef = await addDoc(eventosRef, evento)

      const totalDisponibles = evento.tiposTickets.reduce((sum, t) => sum + t.disponibles, 0)
      const totalTickets = evento.tiposTickets.reduce((sum, t) => sum + t.cantidad, 0)

      created.push({
        id: docRef.id,
        titulo: evento.titulo,
        fecha: evento.fecha.toDate().toLocaleDateString('es-MX'),
        stock: `${totalDisponibles}/${totalTickets}`,
        porcentaje: `${((totalDisponibles / totalTickets) * 100).toFixed(1)}%`
      })
    }

    return NextResponse.json({
      success: true,
      message: `${eventos.length} eventos creados exitosamente`,
      eventos: created
    })
  } catch (error) {
    console.error('Error en seed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return GET()
}
