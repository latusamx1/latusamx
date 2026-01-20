/**
 * Script de Testing del Flujo Completo
 *
 * Este script verifica que todas las piezas del sistema estén conectadas correctamente.
 * NO reemplaza el testing manual, pero ayuda a detectar errores obvios.
 */

import { db } from '@/lib/firebase/config'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore'

interface TestResult {
  testName: string
  passed: boolean
  error?: string
  duration?: number
}

const results: TestResult[] = []

async function runTest(name: string, testFn: () => Promise<void>) {
  const start = Date.now()
  try {
    await testFn()
    results.push({
      testName: name,
      passed: true,
      duration: Date.now() - start
    })
    console.log(`✅ ${name} - ${Date.now() - start}ms`)
  } catch (error) {
    results.push({
      testName: name,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start
    })
    console.error(`❌ ${name}:`, error)
  }
}

async function testFirebaseConnection() {
  if (!db) throw new Error('Firebase no inicializado')

  // Intentar leer una colección
  const eventosRef = collection(db, 'eventos')
  await getDocs(query(eventosRef))
}

async function testEventosExisten() {
  if (!db) throw new Error('Firebase no inicializado')

  const eventosRef = collection(db, 'eventos')
  const snapshot = await getDocs(eventosRef)

  if (snapshot.empty) {
    throw new Error('No hay eventos en la base de datos. Crea al menos 1 evento.')
  }

  console.log(`   ℹ️  Encontrados ${snapshot.size} eventos`)
}

async function testEventoTieneTicketsDisponibles() {
  if (!db) throw new Error('Firebase no inicializado')

  const eventosRef = collection(db, 'eventos')
  const q = query(eventosRef, where('ticketsDisponibles', '>', 0))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    throw new Error('No hay eventos con tickets disponibles')
  }

  console.log(`   ℹ️  Encontrados ${snapshot.size} eventos con tickets disponibles`)
}

async function testOrdenesCollectionExists() {
  if (!db) throw new Error('Firebase no inicializado')

  const ordenesRef = collection(db, 'ordenes')
  const snapshot = await getDocs(ordenesRef)

  console.log(`   ℹ️  Colección 'ordenes' tiene ${snapshot.size} documentos`)
}

async function testTicketsCollectionExists() {
  if (!db) throw new Error('Firebase no inicializado')

  const ticketsRef = collection(db, 'tickets')
  const snapshot = await getDocs(ticketsRef)

  console.log(`   ℹ️  Colección 'tickets' tiene ${snapshot.size} documentos`)
}

async function testTicketStructure() {
  if (!db) throw new Error('Firebase no inicializado')

  const ticketsRef = collection(db, 'tickets')
  const snapshot = await getDocs(ticketsRef)

  if (snapshot.empty) {
    console.log('   ⚠️  No hay tickets para validar estructura (esto es OK si es primera vez)')
    return
  }

  const ticket = snapshot.docs[0].data()
  const requiredFields = [
    'ordenId',
    'eventoId',
    'userId',
    'qrCode',
    'precio',
    'tipoTicket',
    'usado',
    'createdAt'
  ]

  const missingFields = requiredFields.filter(field => !(field in ticket))

  if (missingFields.length > 0) {
    throw new Error(`Ticket le faltan campos: ${missingFields.join(', ')}`)
  }

  // Validar formato de QR
  if (!ticket.qrCode.startsWith('TICKET-')) {
    throw new Error(`QR code no tiene formato correcto: ${ticket.qrCode}`)
  }

  console.log(`   ℹ️  Estructura de ticket validada correctamente`)
}

async function testOrdenStructure() {
  if (!db) throw new Error('Firebase no inicializado')

  const ordenesRef = collection(db, 'ordenes')
  const snapshot = await getDocs(ordenesRef)

  if (snapshot.empty) {
    console.log('   ⚠️  No hay órdenes para validar estructura (esto es OK si es primera vez)')
    return
  }

  const orden = snapshot.docs[0].data()
  const requiredFields = [
    'userId',
    'items',
    'total',
    'estado',
    'createdAt'
  ]

  const missingFields = requiredFields.filter(field => !(field in orden))

  if (missingFields.length > 0) {
    throw new Error(`Orden le faltan campos: ${missingFields.join(', ')}`)
  }

  // Validar que items es un array
  if (!Array.isArray(orden.items)) {
    throw new Error('Campo "items" debe ser un array')
  }

  // Validar que total es un número
  if (typeof orden.total !== 'number') {
    throw new Error('Campo "total" debe ser un número')
  }

  console.log(`   ℹ️  Estructura de orden validada correctamente`)
}

async function testQRCodesUnicos() {
  if (!db) throw new Error('Firebase no inicializado')

  const ticketsRef = collection(db, 'tickets')
  const snapshot = await getDocs(ticketsRef)

  if (snapshot.size < 2) {
    console.log('   ⚠️  No hay suficientes tickets para validar unicidad')
    return
  }

  const qrCodes = snapshot.docs.map(doc => doc.data().qrCode)
  const uniqueQRs = new Set(qrCodes)

  if (qrCodes.length !== uniqueQRs.size) {
    throw new Error(`Hay QR codes duplicados! Total: ${qrCodes.length}, Únicos: ${uniqueQRs.size}`)
  }

  console.log(`   ℹ️  Todos los ${qrCodes.length} QR codes son únicos`)
}

async function testTicketsBelongToOrden() {
  if (!db) throw new Error('Firebase no inicializado')

  const ticketsRef = collection(db, 'tickets')
  const ticketsSnapshot = await getDocs(ticketsRef)

  if (ticketsSnapshot.empty) {
    console.log('   ⚠️  No hay tickets para validar relación con órdenes')
    return
  }

  const ordenesRef = collection(db, 'ordenes')
  const ordenesSnapshot = await getDocs(ordenesRef)
  const ordenIds = new Set(ordenesSnapshot.docs.map(doc => doc.id))

  let orphanTickets = 0
  ticketsSnapshot.docs.forEach(doc => {
    const ticket = doc.data()
    if (!ordenIds.has(ticket.ordenId)) {
      orphanTickets++
    }
  })

  if (orphanTickets > 0) {
    throw new Error(`Hay ${orphanTickets} tickets huérfanos (sin orden asociada)`)
  }

  console.log(`   ℹ️  Todos los tickets tienen orden asociada válida`)
}

async function testUsuarioTieneTickets() {
  if (!db) throw new Error('Firebase no inicializado')

  const ticketsRef = collection(db, 'tickets')
  const snapshot = await getDocs(ticketsRef)

  if (snapshot.empty) {
    console.log('   ⚠️  No hay tickets para validar por usuario')
    return
  }

  // Agrupar por usuario
  const ticketsPorUsuario = new Map<string, number>()
  snapshot.docs.forEach(doc => {
    const ticket = doc.data()
    const count = ticketsPorUsuario.get(ticket.userId) || 0
    ticketsPorUsuario.set(ticket.userId, count + 1)
  })

  console.log(`   ℹ️  ${ticketsPorUsuario.size} usuarios tienen tickets`)
  ticketsPorUsuario.forEach((count, userId) => {
    console.log(`      - Usuario ${userId.slice(0, 8)}...: ${count} tickets`)
  })
}

// Ejecutar todos los tests
export async function runAllTests() {
  console.log('\n🧪 ═══════════════════════════════════════════════════════════')
  console.log('   TESTING DEL FLUJO COMPLETO - Sistema de Eventos')
  console.log('═══════════════════════════════════════════════════════════\n')

  console.log('📡 Tests de Conexión\n')
  await runTest('1. Conexión a Firebase', testFirebaseConnection)

  console.log('\n📊 Tests de Datos\n')
  await runTest('2. Eventos existen en BD', testEventosExisten)
  await runTest('3. Eventos con tickets disponibles', testEventoTieneTicketsDisponibles)
  await runTest('4. Colección de órdenes existe', testOrdenesCollectionExists)
  await runTest('5. Colección de tickets existe', testTicketsCollectionExists)

  console.log('\n🔍 Tests de Estructura\n')
  await runTest('6. Estructura de ticket correcta', testTicketStructure)
  await runTest('7. Estructura de orden correcta', testOrdenStructure)

  console.log('\n✅ Tests de Integridad\n')
  await runTest('8. QR codes son únicos', testQRCodesUnicos)
  await runTest('9. Tickets pertenecen a órdenes válidas', testTicketsBelongToOrden)
  await runTest('10. Usuarios tienen tickets', testUsuarioTieneTickets)

  // Resumen
  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('📊 RESUMEN DE RESULTADOS\n')

  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length
  const percentage = ((passed / total) * 100).toFixed(1)

  console.log(`   Total de tests: ${total}`)
  console.log(`   ✅ Exitosos: ${passed}`)
  console.log(`   ❌ Fallidos: ${failed}`)
  console.log(`   📈 Porcentaje: ${percentage}%`)

  if (failed > 0) {
    console.log('\n❌ TESTS FALLIDOS:\n')
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`   • ${r.testName}`)
        console.log(`     Error: ${r.error}`)
      })
  }

  console.log('\n═══════════════════════════════════════════════════════════\n')

  return {
    total,
    passed,
    failed,
    percentage: parseFloat(percentage),
    results
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  runAllTests()
    .then(summary => {
      if (summary.failed > 0) {
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('Error ejecutando tests:', error)
      process.exit(1)
    })
}
