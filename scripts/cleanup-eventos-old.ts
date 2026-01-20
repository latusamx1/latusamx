/**
 * Script de Limpieza de Eventos Antiguos
 *
 * Elimina eventos con fechas pasadas o eventos de prueba
 */

import { db } from '@/lib/firebase/config'
import { collection, getDocs, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore'

async function cleanupEventosOld() {
  if (!db) {
    console.error('❌ Firebase no inicializado')
    process.exit(1)
  }

  console.log('\n🧹 ═══════════════════════════════════════════════════════════')
  console.log('   LIMPIEZA DE EVENTOS ANTIGUOS')
  console.log('═══════════════════════════════════════════════════════════\n')

  const eventosRef = collection(db, 'eventos')
  const ahora = Timestamp.now()

  // Obtener todos los eventos
  const snapshot = await getDocs(eventosRef)

  console.log(`📊 Total de eventos en BD: ${snapshot.size}\n`)

  let eliminados = 0
  let preservados = 0
  const hoy = new Date()

  for (const docSnap of snapshot.docs) {
    const evento = docSnap.data()
    const fechaEvento = evento.fecha?.toDate ? evento.fecha.toDate() : new Date(evento.fecha)

    const esViejo = fechaEvento < hoy

    if (esViejo) {
      console.log(`🗑️  Eliminando: ${evento.titulo}`)
      console.log(`   Fecha: ${fechaEvento.toLocaleDateString('es-MX')}`)
      console.log(`   ID: ${docSnap.id}\n`)

      await deleteDoc(doc(db, 'eventos', docSnap.id))
      eliminados++
    } else {
      console.log(`✅ Preservando: ${evento.titulo}`)
      console.log(`   Fecha: ${fechaEvento.toLocaleDateString('es-MX')}`)
      console.log(`   ID: ${docSnap.id}\n`)
      preservados++
    }
  }

  console.log('═══════════════════════════════════════════════════════════')
  console.log('🎉 LIMPIEZA COMPLETADA\n')
  console.log('📊 Resumen:')
  console.log(`   🗑️  Eliminados: ${eliminados} eventos`)
  console.log(`   ✅ Preservados: ${preservados} eventos`)
  console.log('')
  console.log('💡 Siguiente paso:')
  console.log('   Ejecuta: npx ts-node scripts/seed-eventos-2026.ts')
  console.log('═══════════════════════════════════════════════════════════\n')
}

// Ejecutar limpieza
cleanupEventosOld()
  .then(() => {
    console.log('✅ Proceso completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error en la limpieza:', error)
    process.exit(1)
  })

export { cleanupEventosOld }
