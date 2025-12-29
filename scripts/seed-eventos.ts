/**
 * Script para agregar eventos de prueba a Firestore
 * Ejecutar con: npx tsx scripts/seed-eventos.ts
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

// Inicializar Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

const db = getFirestore()

const eventosData = [
  {
    titulo: 'Festival de Música 2024',
    descripcion:
      '¡Prepárate para vivir la experiencia musical del año! El Festival de Música 2024 trae lo mejor del rock, pop y música electrónica en un solo lugar.\n\nCon más de 20 artistas nacionales e internacionales, efectos visuales espectaculares y una producción de clase mundial, este evento promete ser inolvidable.\n\nNo te pierdas esta oportunidad única de ver a tus artistas favoritos en vivo. ¡Los boletos se están agotando rápido!',
    categoria: 'festival',
    fecha: Timestamp.fromDate(new Date('2024-03-15T20:00:00')),
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    titulo: 'Tech Conference 2024',
    descripcion:
      'La conferencia de tecnología más importante del año. Aprende sobre las últimas tendencias en desarrollo web, IA, blockchain y más.\n\nConferencias magistrales, talleres prácticos y networking con líderes de la industria.',
    categoria: 'conferencia',
    fecha: Timestamp.fromDate(new Date('2024-12-20T09:00:00')),
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    titulo: 'Rock Night Live',
    descripcion: 'Una noche épica de rock con las mejores bandas locales e internacionales. Prepárate para headbanging y mucha energía.',
    categoria: 'concierto',
    fecha: Timestamp.fromDate(new Date('2024-12-22T21:00:00')),
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    titulo: 'Obra Clásica: Romeo y Julieta',
    descripcion:
      'La obra clásica de Shakespeare interpretada por el mejor elenco del país. Una experiencia teatral inolvidable.\n\nDirección de Juan Pérez, con escenografía y vestuario de época.',
    categoria: 'teatro',
    fecha: Timestamp.fromDate(new Date('2024-12-24T19:00:00')),
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    titulo: 'Partido de Fútbol: Liga MX',
    descripcion: 'El clásico más esperado de la temporada. América vs Chivas en el estadio más grande de México.',
    categoria: 'deportivo',
    fecha: Timestamp.fromDate(new Date('2024-12-29T17:00:00')),
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    titulo: 'Taller de Fotografía Profesional',
    descripcion:
      'Aprende las técnicas profesionales de fotografía con expertos reconocidos internacionalmente.\n\nIncluye práctica, teoría y sesión de fotos al aire libre.',
    categoria: 'conferencia',
    fecha: Timestamp.fromDate(new Date('2024-12-30T10:00:00')),
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
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
]

async function seedEventos() {
  console.log('🌱 Iniciando seed de eventos...')

  try {
    const batch = db.batch()

    for (const evento of eventosData) {
      const docRef = db.collection('eventos').doc()
      batch.set(docRef, evento)
      console.log(`✅ Agregado: ${evento.titulo}`)
    }

    await batch.commit()
    console.log(`\n🎉 ${eventosData.length} eventos agregados exitosamente!`)
    console.log('\n📋 Resumen:')
    console.log('- Festival de Música 2024 (DESTACADO)')
    console.log('- Tech Conference 2024')
    console.log('- Rock Night Live (SOLD OUT)')
    console.log('- Obra Clásica: Romeo y Julieta')
    console.log('- Partido de Fútbol: Liga MX')
    console.log('- Taller de Fotografía Profesional')
    console.log('\n✨ Ahora puedes visitar /eventos para ver los eventos!')
  } catch (error) {
    console.error('❌ Error al agregar eventos:', error)
    process.exit(1)
  }
}

// Ejecutar
seedEventos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
