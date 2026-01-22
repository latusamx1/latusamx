'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, limit, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'pending'
  message: string
  details?: string
}

export function TestPermissions() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results: TestResult[] = []

    // Test 1: Leer eventos
    try {
      const eventosRef = collection(db!, 'eventos')
      const q = query(eventosRef, limit(1))
      const snapshot = await getDocs(q)

      results.push({
        name: 'Leer Eventos',
        status: 'success',
        message: `✅ Puede leer eventos (${snapshot.size} encontrados)`,
        details: snapshot.empty ? 'No hay eventos en la BD' : `Evento: ${snapshot.docs[0]?.data().titulo || 'Sin título'}`
      })
    } catch (error: any) {
      results.push({
        name: 'Leer Eventos',
        status: 'error',
        message: '❌ No puede leer eventos',
        details: error.message || error.code
      })
    }

    // Test 2: Leer órdenes
    try {
      const ordenesRef = collection(db!, 'ordenes')
      const q = query(ordenesRef, limit(1))
      const snapshot = await getDocs(q)

      results.push({
        name: 'Leer Órdenes',
        status: 'success',
        message: `✅ Puede leer órdenes (${snapshot.size} encontradas)`,
        details: snapshot.empty ? 'No hay órdenes en la BD' : 'Tiene permisos correctos'
      })
    } catch (error: any) {
      results.push({
        name: 'Leer Órdenes',
        status: 'error',
        message: '❌ No puede leer órdenes',
        details: error.message || error.code
      })
    }

    // Test 3: Leer tickets
    try {
      const ticketsRef = collection(db!, 'tickets')
      const q = query(ticketsRef, limit(1))
      const snapshot = await getDocs(q)

      results.push({
        name: 'Leer Tickets',
        status: 'success',
        message: `✅ Puede leer tickets (${snapshot.size} encontrados)`,
        details: snapshot.empty ? 'No hay tickets en la BD' : 'Tiene permisos correctos'
      })
    } catch (error: any) {
      results.push({
        name: 'Leer Tickets',
        status: 'error',
        message: '❌ No puede leer tickets',
        details: error.message || error.code
      })
    }

    // Test 4: Intentar crear un documento de prueba
    try {
      const testRef = collection(db!, 'test_permisos')
      const docRef = await addDoc(testRef, {
        test: true,
        timestamp: new Date()
      })

      // Intentar eliminarlo
      await deleteDoc(doc(db!, 'test_permisos', docRef.id))

      results.push({
        name: 'Escribir/Eliminar Test',
        status: 'success',
        message: '✅ Puede escribir y eliminar',
        details: 'Reglas permiten operaciones de escritura'
      })
    } catch (error: any) {
      results.push({
        name: 'Escribir/Eliminar Test',
        status: 'error',
        message: '⚠️ No puede escribir (esto es normal)',
        details: error.code === 'permission-denied' ? 'Esperado: colección test_permisos no existe' : error.message
      })
    }

    setTests(results)
    setTesting(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-yellow-50 border-yellow-200'
    }
  }

  const allPassed = tests.length > 0 && tests.filter(t => t.name !== 'Escribir/Eliminar Test').every(t => t.status === 'success')

  return (
    <Card className={`${allPassed ? 'border-green-300' : 'border-red-300'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>🔍 Test de Permisos de Firestore</CardTitle>
          <Button
            onClick={runTests}
            disabled={testing}
            variant="outline"
            size="sm"
          >
            {testing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Probar Nuevamente
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Ejecutando tests de permisos...</p>
          </div>
        ) : (
          <>
            {tests.map((test, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${getColor(test.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(test.status)}
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{test.name}</div>
                    <div className="text-sm mt-1">{test.message}</div>
                    {test.details && (
                      <div className="text-xs text-muted-foreground mt-1 font-mono bg-white/50 p-1 rounded">
                        {test.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Resumen */}
            <div className={`mt-4 p-4 rounded-lg border-2 ${allPassed ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
              {allPassed ? (
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">✅ Todos los permisos funcionan correctamente</p>
                  <p className="text-sm text-green-700 mt-1">Las reglas de Firestore están configuradas correctamente</p>
                </div>
              ) : (
                <div className="text-center">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="font-semibold text-red-900">❌ Hay problemas con los permisos</p>
                  <p className="text-sm text-red-700 mt-1">Necesitas actualizar las reglas en Firebase Console</p>
                  <Button
                    className="mt-3"
                    variant="destructive"
                    onClick={() => window.open('https://console.firebase.google.com/project/latusamx/firestore/rules', '_blank')}
                  >
                    Abrir Firebase Console
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
