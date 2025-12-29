/**
 * Página de administración para crear eventos de prueba
 * Usa Firebase Client SDK
 */

'use client'

import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

const eventosData = [
  {
    titulo: 'Festival de Música 2024',
    descripcion:
      '¡Prepárate para vivir la experiencia musical del año! El Festival de Música 2024 trae lo mejor del rock, pop y música electrónica en un solo lugar.\n\nCon más de 20 artistas nacionales e internacionales, efectos visuales espectaculares y una producción de clase mundial, este evento promete ser inolvidable.\n\n¡No te pierdas esta oportunidad única de ver a tus artistas favoritos en vivo. Los boletos se están agotando rápido!',
    categoria: 'festival',
    fecha: new Date('2024-03-15T20:00:00'),
    horaInicio: '20:00',
    horaFin: '02:00',
    venueId: 'venue-1',
    venue: {
      id: 'venue-1',
      nombre: 'Central Stadium',
      direccion: 'Av. Principal 123',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '01000',
      capacidad: 1000,
    },
    imagenPortada: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop',
    artistas: ['The Rockers', 'DJ Electric', 'Pop Stars', 'The Band', 'Indie Crew', 'Rock Legends'],
    tiposTickets: [
      {
        id: 'general',
        nombre: 'General Admission',
        descripcion: 'Standing room only',
        precio: 500,
        cantidad: 500,
        disponibles: 500,
      },
      {
        id: 'vip',
        nombre: 'VIP Access',
        descripcion: 'Reserved seating + backstage',
        precio: 1500,
        cantidad: 50,
        disponibles: 50,
      },
      {
        id: 'premium',
        nombre: 'Premium Seating',
        descripcion: 'Best view seats',
        precio: 1000,
        cantidad: 200,
        disponibles: 200,
      },
    ],
    estado: 'publicado',
    status: 'publicado',
    destacado: true,
    tags: ['música', 'festival', 'rock', 'pop', 'electrónica'],
    precioMinimo: 500,
    createdBy: 'admin',
  },
  {
    titulo: 'Tech Conference 2024',
    descripcion:
      'La conferencia de tecnología más importante del año. Aprende sobre las últimas tendencias en desarrollo web, IA, blockchain y más.\n\nConferencias magistrales, talleres prácticos y networking con líderes de la industria.',
    categoria: 'conferencia',
    fecha: new Date('2024-12-20T09:00:00'),
    horaInicio: '09:00',
    horaFin: '18:00',
    venueId: 'venue-2',
    venue: {
      id: 'venue-2',
      nombre: 'Centro de Convenciones Santa Fe',
      direccion: 'Av. Santa Fe 94',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '05348',
      capacidad: 500,
    },
    imagenPortada: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
    artistas: ['Keynote Speaker 1', 'Keynote Speaker 2', 'Tech Expert 1', 'Tech Expert 2'],
    tiposTickets: [
      {
        id: 'early-bird',
        nombre: 'Early Bird',
        descripcion: 'Precio especial preventa',
        precio: 1200,
        cantidad: 100,
        disponibles: 20,
      },
      {
        id: 'regular',
        nombre: 'Regular Pass',
        descripcion: 'Acceso completo a conferencias',
        precio: 1800,
        cantidad: 300,
        disponibles: 300,
      },
      {
        id: 'vip',
        nombre: 'VIP Pass',
        descripcion: 'Acceso VIP + talleres exclusivos',
        precio: 3500,
        cantidad: 50,
        disponibles: 50,
      },
    ],
    estado: 'publicado',
    status: 'publicado',
    destacado: false,
    tags: ['tecnología', 'conferencia', 'networking', 'IA'],
    precioMinimo: 1200,
    createdBy: 'admin',
  },
  {
    titulo: 'Rock Night Live',
    descripcion: 'Una noche épica de rock con las mejores bandas locales e internacionales. Prepárate para headbanging y mucha energía.',
    categoria: 'concierto',
    fecha: new Date('2024-12-22T21:00:00'),
    horaInicio: '21:00',
    horaFin: '02:00',
    venueId: 'venue-3',
    venue: {
      id: 'venue-3',
      nombre: 'Rock Arena Condesa',
      direccion: 'Calle Condesa 45',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '06140',
      capacidad: 800,
    },
    imagenPortada: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop',
    artistas: ['Heavy Metal Band', 'Rock Legends', 'Alternative Rock'],
    tiposTickets: [
      {
        id: 'general',
        nombre: 'General Admission',
        descripcion: 'Acceso general standing',
        precio: 800,
        cantidad: 700,
        disponibles: 0, // SOLD OUT
      },
    ],
    estado: 'publicado',
    status: 'publicado',
    destacado: false,
    tags: ['rock', 'concierto', 'música en vivo'],
    precioMinimo: 800,
    createdBy: 'admin',
  },
  {
    titulo: 'Obra Clásica: Romeo y Julieta',
    descripcion:
      'La obra clásica de Shakespeare interpretada por el mejor elenco del país. Una experiencia teatral inolvidable.\n\nDirección de Juan Pérez, con escenografía y vestuario de época.',
    categoria: 'teatro',
    fecha: new Date('2024-12-24T19:00:00'),
    horaInicio: '19:00',
    horaFin: '21:30',
    venueId: 'venue-4',
    venue: {
      id: 'venue-4',
      nombre: 'Teatro Principal',
      direccion: 'Calle del Teatro 10',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '06000',
      capacidad: 400,
    },
    imagenPortada: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=600&fit=crop',
    artistas: ['Elenco Principal', 'Director: Juan Pérez'],
    tiposTickets: [
      {
        id: 'balcon',
        nombre: 'Balcón',
        descripcion: 'Asientos balcón',
        precio: 350,
        cantidad: 100,
        disponibles: 100,
      },
      {
        id: 'platea',
        nombre: 'Platea',
        descripcion: 'Asientos platea',
        precio: 600,
        cantidad: 150,
        disponibles: 150,
      },
      {
        id: 'preferente',
        nombre: 'Preferente',
        descripcion: 'Mejores asientos',
        precio: 900,
        cantidad: 50,
        disponibles: 50,
      },
    ],
    estado: 'publicado',
    status: 'publicado',
    destacado: false,
    tags: ['teatro', 'clásico', 'Shakespeare'],
    precioMinimo: 350,
    createdBy: 'admin',
  },
  {
    titulo: 'Partido de Fútbol: Liga MX',
    descripcion: 'El clásico más esperado de la temporada. América vs Chivas en el estadio más grande de México.',
    categoria: 'deportivo',
    fecha: new Date('2024-12-29T17:00:00'),
    horaInicio: '17:00',
    horaFin: '19:00',
    venueId: 'venue-5',
    venue: {
      id: 'venue-5',
      nombre: 'Estadio Azteca',
      direccion: 'Calzada de Tlalpan 3465',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '04220',
      capacidad: 87000,
    },
    imagenPortada: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=600&fit=crop',
    artistas: ['América', 'Chivas'],
    tiposTickets: [
      {
        id: 'general',
        nombre: 'General',
        descripcion: 'Acceso general',
        precio: 250,
        cantidad: 30000,
        disponibles: 30000,
      },
      {
        id: 'preferente',
        nombre: 'Preferente',
        descripcion: 'Asientos preferentes',
        precio: 500,
        cantidad: 10000,
        disponibles: 10000,
      },
      {
        id: 'palco',
        nombre: 'Palco',
        descripcion: 'Palco VIP',
        precio: 2000,
        cantidad: 500,
        disponibles: 500,
      },
    ],
    estado: 'publicado',
    status: 'publicado',
    destacado: false,
    tags: ['fútbol', 'deportes', 'Liga MX'],
    precioMinimo: 250,
    createdBy: 'admin',
  },
  {
    titulo: 'Taller de Fotografía Profesional',
    descripcion:
      'Aprende las técnicas profesionales de fotografía con expertos reconocidos internacionalmente.\n\nIncluye práctica, teoría y sesión de fotos al aire libre.',
    categoria: 'conferencia',
    fecha: new Date('2024-12-30T10:00:00'),
    horaInicio: '10:00',
    horaFin: '18:00',
    venueId: 'venue-6',
    venue: {
      id: 'venue-6',
      nombre: 'Estudio Polanco',
      direccion: 'Calle Polanco 567',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '11560',
      capacidad: 30,
    },
    imagenPortada: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop',
    artistas: ['Carlos Fotógrafo', 'Ana Profesional'],
    tiposTickets: [
      {
        id: 'basico',
        nombre: 'Básico',
        descripcion: 'Taller básico de 4 horas',
        precio: 1500,
        cantidad: 20,
        disponibles: 5,
      },
      {
        id: 'completo',
        nombre: 'Completo',
        descripcion: 'Taller completo de 8 horas',
        precio: 2500,
        cantidad: 15,
        disponibles: 15,
      },
    ],
    estado: 'publicado',
    status: 'publicado',
    destacado: false,
    tags: ['fotografía', 'taller', 'educación'],
    precioMinimo: 1500,
    createdBy: 'admin',
  },
]

export default function SeedEventosPage() {
  const [loading, setLoading] = useState(false)
  const [createdCount, setCreatedCount] = useState(0)

  const handleSeedEventos = async () => {
    if (!db) {
      toast.error('Firebase no está inicializado')
      return
    }

    setLoading(true)
    setCreatedCount(0)

    try {
      const eventosRef = collection(db, 'eventos')

      for (const eventoData of eventosData) {
        // Convertir fecha a Timestamp de Firestore
        const eventoConTimestamp = {
          ...eventoData,
          fecha: Timestamp.fromDate(eventoData.fecha),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(eventosRef, eventoConTimestamp)
        console.log(`✅ Agregado: ${eventoData.titulo} (ID: ${docRef.id})`)
        setCreatedCount((prev) => prev + 1)
      }

      toast.success(`🎉 ${eventosData.length} eventos creados exitosamente!`)
    } catch (error) {
      console.error('❌ Error al crear eventos:', error)
      toast.error('Error al crear eventos. Ver consola para detalles.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-2">Crear Eventos de Prueba</h1>
        <p className="text-gray-600 mb-6">
          Esta página creará 6 eventos de prueba en Firestore para probar el catálogo y las páginas de detalle.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-2">Eventos que se crearán:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>Festival de Música 2024 (DESTACADO)</li>
            <li>Tech Conference 2024</li>
            <li>Rock Night Live (SOLD OUT)</li>
            <li>Obra Clásica: Romeo y Julieta</li>
            <li>Partido de Fútbol: Liga MX</li>
            <li>Taller de Fotografía Profesional</li>
          </ul>
        </div>

        {createdCount > 0 && (
          <div className="mb-4">
            <p className="text-sm text-green-600">
              Progreso: {createdCount} / {eventosData.length} eventos creados
            </p>
          </div>
        )}

        <Button onClick={handleSeedEventos} disabled={loading} size="lg" className="w-full">
          {loading ? `Creando eventos... (${createdCount}/${eventosData.length})` : '🌱 Crear Eventos de Prueba'}
        </Button>

        {createdCount === eventosData.length && createdCount > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">✅ ¡Listo! Ahora puedes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-green-700">
              <li>
                Ver el catálogo en{' '}
                <a href="/eventos" className="underline font-medium">
                  /eventos
                </a>
              </li>
              <li>Click en cualquier evento para ver su detalle</li>
              <li>Probar filtros, búsqueda y ordenamiento</li>
              <li>Probar el selector de tickets</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  )
}
