/**
 * Script para crear venues de ejemplo en Firestore
 * Ejecutar con: npx ts-node scripts/seed-venues.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

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

const venuesData = [
  {
    nombre: 'Centro de Convenciones',
    direccion: 'Av. Principal 123, Centro',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    codigoPostal: '06000',
    capacidad: 500,
    descripcion: 'Amplio centro de convenciones con todas las amenidades',
    amenidades: ['Estacionamiento', 'Aire acondicionado', 'WiFi', 'Audio profesional'],
    imagenes: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    ],
    telefono: '55-1234-5678',
    email: 'contacto@centroconvenciones.com',
    activo: true,
  },
  {
    nombre: 'Salón de Eventos "El Gran Jardín"',
    direccion: 'Calle Jardines 456',
    ciudad: 'Monterrey',
    estado: 'Nuevo León',
    codigoPostal: '64000',
    capacidad: 300,
    descripcion: 'Elegante salón con hermosos jardines al aire libre',
    amenidades: ['Jardín', 'Terraza', 'Estacionamiento', 'Catering'],
    imagenes: [
      'https://images.unsplash.com/photo-1519167758481-83f29da8c424?w=800&q=80',
    ],
    telefono: '81-9876-5432',
    email: 'eventos@elgranjardin.com',
    activo: true,
  },
  {
    nombre: 'Teatro Municipal',
    direccion: 'Plaza Cultural 789',
    ciudad: 'Guadalajara',
    estado: 'Jalisco',
    codigoPostal: '44100',
    capacidad: 800,
    descripcion: 'Histórico teatro con excelente acústica',
    amenidades: ['Butacas numeradas', 'Sistema de audio', 'Iluminación profesional', 'Camerinos'],
    imagenes: [
      'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    ],
    telefono: '33-5555-1234',
    email: 'info@teatromunicipal.com',
    activo: true,
  },
  {
    nombre: 'Club Deportivo Arena',
    direccion: 'Av. Deportiva 321',
    ciudad: 'Puebla',
    estado: 'Puebla',
    codigoPostal: '72000',
    capacidad: 1000,
    descripcion: 'Arena multiusos ideal para eventos deportivos y conciertos',
    amenidades: ['Gradas', 'Vestidores', 'Estacionamiento amplio', 'Cafetería'],
    imagenes: [
      'https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=800&q=80',
    ],
    telefono: '222-8888-9999',
    email: 'reservas@clubarena.com',
    activo: true,
  },
  {
    nombre: 'Restaurante "La Terraza"',
    direccion: 'Paseo del Río 567',
    ciudad: 'Querétaro',
    estado: 'Querétaro',
    codigoPostal: '76000',
    capacidad: 150,
    descripcion: 'Restaurante con terraza y vista panorámica',
    amenidades: ['Terraza', 'Bar', 'Cocina completa', 'Vista panorámica'],
    imagenes: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    ],
    telefono: '442-3333-7777',
    email: 'eventos@laterraza.com',
    activo: true,
  },
]

async function seedVenues() {
  try {
    console.log('🌱 Iniciando seed de venues...')

    for (const venueData of venuesData) {
      const venueRef = await db.collection('venues').add({
        ...venueData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✅ Venue creado: ${venueData.nombre} (ID: ${venueRef.id})`)
    }

    console.log(`\n🎉 Seed completado! ${venuesData.length} venues creados exitosamente.`)
  } catch (error) {
    console.error('❌ Error al crear venues:', error)
    process.exit(1)
  }
}

seedVenues()
