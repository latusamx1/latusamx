/**
 * Tests de Race Conditions para Sistema de Inventario
 *
 * Simula múltiples usuarios comprando simultáneamente
 * Verifica que las transacciones atómicas previenen overselling
 */

import { inventarioService } from '@/lib/services/inventario.service'
import { db } from '@/lib/firebase/config'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'

// ============================================
// TIPOS Y CONFIGURACIÓN
// ============================================

interface TestResult {
  testName: string
  passed: boolean
  detalles?: string
  error?: string
}

const results: TestResult[] = []

// ============================================
// HELPERS
// ============================================

async function runTest(name: string, testFn: () => Promise<void>) {
  console.log(`\n🧪 ${name}...`)
  try {
    await testFn()
    results.push({ testName: name, passed: true })
    console.log(`✅ ${name} - PASSED`)
  } catch (error) {
    results.push({
      testName: name,
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    })
    console.error(`❌ ${name} - FAILED:`, error)
  }
}

async function setupEvento(
  eventoId: string,
  tipoTicketId: string,
  disponibles: number
): Promise<void> {
  if (!db) throw new Error('Firebase no inicializado')

  const eventoRef = doc(db, 'eventos', eventoId)
  await updateDoc(eventoRef, {
    tiposTickets: [
      {
        id: tipoTicketId,
        nombre: 'Test Ticket',
        precio: 100,
        cantidad: disponibles,
        disponibles: disponibles
      }
    ],
    updatedAt: Timestamp.now()
  })

  console.log(`📦 Evento configurado: ${disponibles} tickets disponibles`)
}

async function getStockActual(eventoId: string, tipoTicketId: string): Promise<number> {
  if (!db) throw new Error('Firebase no inicializado')

  const eventoRef = doc(db, 'eventos', eventoId)
  const eventoSnap = await getDoc(eventoRef)

  if (!eventoSnap.exists()) {
    throw new Error('Evento no encontrado')
  }

  const evento = eventoSnap.data()
  const tipoTicket = evento.tiposTickets?.find((t: any) => t.id === tipoTicketId)

  return tipoTicket?.disponibles || 0
}

// ============================================
// TESTS
// ============================================

/**
 * Test 1: Compra Simple
 * Verifica que una compra única funcione correctamente
 */
async function testCompraSencilla() {
  const eventoId = 'test-evento-1'
  const tipoTicketId = 'test-tipo-1'

  // Setup: 10 tickets disponibles
  await setupEvento(eventoId, tipoTicketId, 10)

  // Comprar 3 tickets
  const resultado = await inventarioService.confirmarCompra(eventoId, tipoTicketId, 3)

  if (!resultado.success) {
    throw new Error(`Compra falló: ${resultado.error}`)
  }

  // Verificar stock
  const stockFinal = await getStockActual(eventoId, tipoTicketId)

  if (stockFinal !== 7) {
    throw new Error(`Stock incorrecto. Esperado: 7, Actual: ${stockFinal}`)
  }

  console.log('   ✓ Stock decrementado correctamente: 10 → 7')
}

/**
 * Test 2: Compras Simultáneas (2 usuarios)
 * Verifica que transacciones simultáneas se manejen correctamente
 */
async function testComprasSimultaneas() {
  const eventoId = 'test-evento-2'
  const tipoTicketId = 'test-tipo-2'

  // Setup: 5 tickets disponibles
  await setupEvento(eventoId, tipoTicketId, 5)

  console.log('   👥 Simulando 2 usuarios comprando 3 tickets cada uno...')

  // Simular 2 usuarios comprando al mismo tiempo
  const compra1 = inventarioService.confirmarCompra(eventoId, tipoTicketId, 3)
  const compra2 = inventarioService.confirmarCompra(eventoId, tipoTicketId, 3)

  const [resultado1, resultado2] = await Promise.all([compra1, compra2])

  // Verificar que solo 1 compra fue exitosa
  const exitosas = [resultado1, resultado2].filter(r => r.success)
  const fallidas = [resultado1, resultado2].filter(r => !r.success)

  if (exitosas.length !== 1) {
    throw new Error(
      `Ambas compras no deberían ser exitosas. Exitosas: ${exitosas.length}, Fallidas: ${fallidas.length}`
    )
  }

  console.log('   ✓ Solo 1 compra fue exitosa (correcto)')

  // Verificar stock final
  const stockFinal = await getStockActual(eventoId, tipoTicketId)

  if (stockFinal !== 2) {
    throw new Error(`Stock incorrecto. Esperado: 2, Actual: ${stockFinal}`)
  }

  console.log('   ✓ Stock final correcto: 5 → 2')
  console.log(`   ✓ Error esperado: "${fallidas[0].error}"`)
}

/**
 * Test 3: Overselling (múltiples usuarios)
 * Simula 5 usuarios comprando 2 tickets cada uno con solo 5 disponibles
 */
async function testOverselling() {
  const eventoId = 'test-evento-3'
  const tipoTicketId = 'test-tipo-3'

  // Setup: Solo 5 tickets disponibles
  await setupEvento(eventoId, tipoTicketId, 5)

  console.log('   👥 Simulando 5 usuarios comprando 2 tickets cada uno (10 total)...')

  // Simular 5 usuarios comprando simultáneamente
  const compras = Array.from({ length: 5 }, () =>
    inventarioService.confirmarCompra(eventoId, tipoTicketId, 2)
  )

  const resultados = await Promise.all(compras)

  // Contar exitosas y fallidas
  const exitosas = resultados.filter(r => r.success)
  const fallidas = resultados.filter(r => !r.success)

  console.log(`   📊 Exitosas: ${exitosas.length}, Fallidas: ${fallidas.length}`)

  // Solo 2 compras de 2 tickets (4 tickets) o 1 compra de 2 y otra de 3 deberían ser exitosas
  if (exitosas.length > 3) {
    throw new Error(`Demasiadas compras exitosas: ${exitosas.length}`)
  }

  // Verificar que no quedó stock negativo
  const stockFinal = await getStockActual(eventoId, tipoTicketId)

  if (stockFinal < 0) {
    throw new Error(`¡OVERSELLING! Stock negativo: ${stockFinal}`)
  }

  if (stockFinal > 5) {
    throw new Error(`Stock aumentó incorrectamente: ${stockFinal}`)
  }

  console.log(`   ✓ Stock final válido: ${stockFinal} (0-5)`)
  console.log('   ✓ No hubo overselling')
}

/**
 * Test 4: Compra Exacta (agotar stock completamente)
 */
async function testCompraExacta() {
  const eventoId = 'test-evento-4'
  const tipoTicketId = 'test-tipo-4'

  // Setup: 10 tickets
  await setupEvento(eventoId, tipoTicketId, 10)

  // Comprar exactamente todos
  const resultado = await inventarioService.confirmarCompra(eventoId, tipoTicketId, 10)

  if (!resultado.success) {
    throw new Error(`Compra falló: ${resultado.error}`)
  }

  const stockFinal = await getStockActual(eventoId, tipoTicketId)

  if (stockFinal !== 0) {
    throw new Error(`Stock debería ser 0, actual: ${stockFinal}`)
  }

  console.log('   ✓ Stock agotado completamente: 10 → 0')
}

/**
 * Test 5: Compra Rechazada (más de lo disponible)
 */
async function testCompraRechazada() {
  const eventoId = 'test-evento-5'
  const tipoTicketId = 'test-tipo-5'

  // Setup: 3 tickets
  await setupEvento(eventoId, tipoTicketId, 3)

  // Intentar comprar 5 (más de lo disponible)
  const resultado = await inventarioService.confirmarCompra(eventoId, tipoTicketId, 5)

  if (resultado.success) {
    throw new Error('Compra debería haber fallado pero fue exitosa')
  }

  console.log(`   ✓ Compra rechazada correctamente: "${resultado.error}"`)

  // Verificar que el stock NO cambió
  const stockFinal = await getStockActual(eventoId, tipoTicketId)

  if (stockFinal !== 3) {
    throw new Error(`Stock cambió cuando no debería. Esperado: 3, Actual: ${stockFinal}`)
  }

  console.log('   ✓ Stock intacto: 3')
}

/**
 * Test 6: Revertir Compra (reembolso)
 */
async function testRevertirCompra() {
  const eventoId = 'test-evento-6'
  const tipoTicketId = 'test-tipo-6'

  // Setup: 10 tickets
  await setupEvento(eventoId, tipoTicketId, 10)

  // Comprar 4
  await inventarioService.confirmarCompra(eventoId, tipoTicketId, 4)
  const stockDespuesCompra = await getStockActual(eventoId, tipoTicketId)

  if (stockDespuesCompra !== 6) {
    throw new Error(`Stock después de compra incorrecto: ${stockDespuesCompra}`)
  }

  // Revertir 4
  await inventarioService.revertirCompra(eventoId, tipoTicketId, 4)
  const stockDespuesRevertir = await getStockActual(eventoId, tipoTicketId)

  if (stockDespuesRevertir !== 10) {
    throw new Error(`Stock después de revertir incorrecto: ${stockDespuesRevertir}`)
  }

  console.log('   ✓ Compra revertida: 10 → 6 → 10')
}

/**
 * Test 7: Verificar Disponibilidad
 */
async function testVerificarDisponibilidad() {
  const eventoId = 'test-evento-7'
  const tipoTicketId = 'test-tipo-7'

  // Setup: 8 tickets
  await setupEvento(eventoId, tipoTicketId, 8)

  // Verificar disponibilidad de 5 (debería estar disponible)
  const resultado1 = await inventarioService.verificarDisponibilidad(eventoId, tipoTicketId, 5)

  if (!resultado1.disponible) {
    throw new Error('Debería estar disponible')
  }

  console.log('   ✓ Verificación exitosa: 5 tickets disponibles de 8')

  // Verificar disponibilidad de 10 (debería NO estar disponible)
  const resultado2 = await inventarioService.verificarDisponibilidad(eventoId, tipoTicketId, 10)

  if (resultado2.disponible) {
    throw new Error('NO debería estar disponible')
  }

  console.log(`   ✓ Verificación correcta de stock insuficiente: "${resultado2.mensaje}"`)
}

// ============================================
// EJECUTAR TODOS LOS TESTS
// ============================================

export async function runAllRaceConditionTests() {
  console.log('\n🏁 ═══════════════════════════════════════════════════════════')
  console.log('   TESTS DE RACE CONDITIONS - Sistema de Inventario')
  console.log('═══════════════════════════════════════════════════════════\n')

  await runTest('Test 1: Compra Sencilla', testCompraSencilla)
  await runTest('Test 2: Compras Simultáneas (2 usuarios)', testComprasSimultaneas)
  await runTest('Test 3: Overselling (5 usuarios)', testOverselling)
  await runTest('Test 4: Compra Exacta (agotar stock)', testCompraExacta)
  await runTest('Test 5: Compra Rechazada (cantidad excesiva)', testCompraRechazada)
  await runTest('Test 6: Revertir Compra (reembolso)', testRevertirCompra)
  await runTest('Test 7: Verificar Disponibilidad', testVerificarDisponibilidad)

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
  runAllRaceConditionTests()
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
