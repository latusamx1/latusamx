/**
 * Seed de Eventos - Enero 2026
 *
 * Crea 3 eventos de prueba con diferentes niveles de stock
 * para testing del sistema de inventario
 */

import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const eventos = [
  // EVENTO 1: Stock Alto (Recién publicado)
  {
    titulo: 'Festival Electrónico Winter 2026',
    descripcion: 'El festival de música electrónica más esperado del año. Con los mejores DJs internacionales y producción de clase mundial. Incluye 3 escenarios, zona VIP con open bar, y experiencias inmersivas.',
    categoria: 'festival',
    fecha: Timestamp.fromDate(new Date('2026-02-14T20:00:00')), // San Valentín
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
      ubicacion: {
        lat: 19.406393,
        lng: -99.090584
      },
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
        disponibles: 40000, // 100% disponible
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
        disponibles: 5000, // 100% disponible
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
        disponibles: 500, // 100% disponible
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

  // EVENTO 2: Stock Medio (Ventas en progreso)
  {
    titulo: 'Concierto: Los Ángeles Azules',
    descripcion: 'La legendaria banda de cumbia sinfónica presenta su nuevo álbum "De Plaza en Plaza Tour 2026". Una noche mágica llena de éxitos y sorpresas especiales con invitados de lujo.',
    categoria: 'concierto',
    fecha: Timestamp.fromDate(new Date('2026-02-08T21:00:00')), // Sábado en 2 semanas
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
      ubicacion: {
        lat: 19.425635,
        lng: -99.191788
      },
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
        disponibles: 1200, // 24% disponible (ventas al 76%)
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
        disponibles: 450, // 15% disponible (ventas al 85%)
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
        disponibles: 8, // 4% disponible (casi agotado!)
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

  // EVENTO 3: Stock Bajo (Casi agotado - Para testing de límites)
  {
    titulo: 'Stand Up: Franco Escamilla',
    descripcion: 'El comediante #1 de habla hispana regresa con su tour "Payaso Tour 2026". Una noche de risas garantizadas con nuevo material nunca antes visto. ¡ÚLTIMAS ENTRADAS!',
    categoria: 'teatro',
    fecha: Timestamp.fromDate(new Date('2026-01-31T20:30:00')), // Este fin de semana
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
      ubicacion: {
        lat: 19.437679,
        lng: -99.154213
      },
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
        disponibles: 12, // Solo 0.8% disponible (casi agotado!)
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
        disponibles: 5, // Solo 0.5% disponible (CRÍTICO!)
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
        disponibles: 0, // AGOTADO - Para testing
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

async function seedEventos() {
  if (!db) {
    console.error('❌ Firebase no inicializado')
    process.exit(1)
  }

  console.log('\n🌱 ═══════════════════════════════════════════════════════════')
  console.log('   SEED DE EVENTOS - Enero 2026')
  console.log('═══════════════════════════════════════════════════════════\n')

  const eventosRef = collection(db, 'eventos')

  for (const evento of eventos) {
    try {
      const docRef = await addDoc(eventosRef, evento)

      const totalDisponibles = evento.tiposTickets.reduce((sum, t) => sum + t.disponibles, 0)
      const totalTickets = evento.tiposTickets.reduce((sum, t) => sum + t.cantidad, 0)
      const porcentajeDisponible = ((totalDisponibles / totalTickets) * 100).toFixed(1)

      console.log(`✅ ${evento.titulo}`)
      console.log(`   ID: ${docRef.id}`)
      console.log(`   Fecha: ${evento.fecha.toDate().toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`)
      console.log(`   Venue: ${evento.venue.nombre}`)
      console.log(`   Stock: ${totalDisponibles}/${totalTickets} (${porcentajeDisponible}% disponible)`)
      console.log(`   Tipos de Tickets:`)

      evento.tiposTickets.forEach(ticket => {
        const porcentaje = ((ticket.disponibles / ticket.cantidad) * 100).toFixed(0)
        const emoji = ticket.disponibles === 0 ? '🔴' :
                      ticket.disponibles < ticket.cantidad * 0.1 ? '🟠' : '🟢'
        console.log(`      ${emoji} ${ticket.nombre}: ${ticket.disponibles}/${ticket.cantidad} (${porcentaje}%)`)
      })
      console.log('')
    } catch (error) {
      console.error(`❌ Error creando evento "${evento.titulo}":`, error)
    }
  }

  console.log('═══════════════════════════════════════════════════════════')
  console.log('🎉 SEED COMPLETADO\n')
  console.log('📊 Resumen:')
  console.log(`   • ${eventos.length} eventos creados`)
  console.log(`   • Fechas: Enero-Febrero 2026`)
  console.log(`   • Stock variado para testing`)
  console.log('')
  console.log('🧪 Casos de Prueba:')
  console.log('   1️⃣  Festival Electrónico → Stock ALTO (100% disponible)')
  console.log('   2️⃣  Los Ángeles Azules → Stock MEDIO (15-85% disponible)')
  console.log('   3️⃣  Franco Escamilla → Stock BAJO (0-0.8% disponible)')
  console.log('')
  console.log('🔥 Escenarios de Testing:')
  console.log('   • Compra normal (Evento 1)')
  console.log('   • Compra con pocos disponibles (Evento 2 - VIP)')
  console.log('   • Compra de últimos tickets (Evento 3 - General/Preferente)')
  console.log('   • Intento de compra agotado (Evento 3 - VIP)')
  console.log('   • Race conditions simultáneas (cualquier evento)')
  console.log('')
  console.log('💡 Siguiente paso:')
  console.log('   Abre http://localhost:3000/eventos para ver los eventos')
  console.log('═══════════════════════════════════════════════════════════\n')
}

// Ejecutar seed
seedEventos()
  .then(() => {
    console.log('✅ Proceso completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en el seed:', error)
    process.exit(1)
  })

export { seedEventos }
