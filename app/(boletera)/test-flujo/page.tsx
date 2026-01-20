'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { Check, X, Loader2, Play, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

type TestStatus = 'idle' | 'running' | 'success' | 'error'

interface TestStep {
  id: string
  title: string
  description: string
  status: TestStatus
  error?: string
  action?: () => Promise<void>
  manualAction?: string
  route?: string
}

export default function TestFlujoPage() {
  const router = useRouter()
  const [steps, setSteps] = useState<TestStep[]>([
    {
      id: 'eventos',
      title: '1. Ver Eventos',
      description: 'Verificar que se carguen eventos desde Firestore',
      status: 'idle',
      route: '/eventos',
      async action() {
        if (!db) throw new Error('Firebase no inicializado')
        const eventosRef = collection(db, 'eventos')
        const snapshot = await getDocs(eventosRef)
        if (snapshot.empty) throw new Error('No hay eventos en la base de datos')
        toast.success(`✅ ${snapshot.size} eventos encontrados`)
      }
    },
    {
      id: 'detalle',
      title: '2. Ver Detalle de Evento',
      description: 'Abrir página de detalle y verificar selector de tickets',
      status: 'idle',
      manualAction: 'Click en un evento → Verificar que se muestre el selector de cantidad'
    },
    {
      id: 'carrito-agregar',
      title: '3. Agregar al Carrito',
      description: 'Agregar tickets al carrito',
      status: 'idle',
      manualAction: 'Seleccionar cantidad → Click en "Agregar al Carrito" → Verificar toast y badge'
    },
    {
      id: 'carrito-ver',
      title: '4. Ver Carrito',
      description: 'Verificar que los items aparezcan en el carrito',
      status: 'idle',
      route: '/carrito',
      manualAction: 'Navegar a /carrito → Verificar items y total'
    },
    {
      id: 'carrito-editar',
      title: '5. Editar Carrito',
      description: 'Cambiar cantidades y eliminar items',
      status: 'idle',
      manualAction: 'Aumentar cantidad → Disminuir cantidad → Eliminar item → Verificar total'
    },
    {
      id: 'checkout-navegar',
      title: '6. Ir a Checkout',
      description: 'Navegar a la página de checkout',
      status: 'idle',
      route: '/checkout',
      manualAction: 'Click en "Proceder al Pago" → Verificar resumen de orden'
    },
    {
      id: 'checkout-completar',
      title: '7. Completar Checkout',
      description: 'Completar el proceso de pago',
      status: 'idle',
      manualAction: 'Llenar datos → Seleccionar método de pago → Click en "Confirmar Compra"'
    },
    {
      id: 'orden-creada',
      title: '8. Verificar Orden Creada',
      description: 'Verificar que se creó la orden en Firestore',
      status: 'idle',
      async action() {
        if (!db) throw new Error('Firebase no inicializado')
        const ordenesRef = collection(db, 'ordenes')
        const q = query(ordenesRef, orderBy('createdAt', 'desc'), limit(1))
        const snapshot = await getDocs(q)
        if (snapshot.empty) throw new Error('No se encontró ninguna orden')
        const orden = snapshot.docs[0].data()
        toast.success(`✅ Orden ${snapshot.docs[0].id.slice(0, 8)}... creada`)
      }
    },
    {
      id: 'tickets-creados',
      title: '9. Verificar Tickets Creados',
      description: 'Verificar que se generaron los tickets con QR',
      status: 'idle',
      async action() {
        if (!db) throw new Error('Firebase no inicializado')
        const ticketsRef = collection(db, 'tickets')
        const q = query(ticketsRef, orderBy('createdAt', 'desc'), limit(5))
        const snapshot = await getDocs(q)
        if (snapshot.empty) throw new Error('No se encontraron tickets')

        // Verificar que todos tienen QR único
        const qrCodes = snapshot.docs.map(doc => doc.data().qrCode)
        const uniqueQRs = new Set(qrCodes)
        if (qrCodes.length !== uniqueQRs.size) {
          throw new Error('Hay QR codes duplicados')
        }

        toast.success(`✅ ${snapshot.size} tickets creados con QR únicos`)
      }
    },
    {
      id: 'confirmacion',
      title: '10. Ver Confirmación',
      description: 'Verificar página de confirmación con QR codes',
      status: 'idle',
      manualAction: 'Después del checkout → Verificar redirección a /confirmacion/[ordenId] → Ver QR codes'
    },
    {
      id: 'mis-tickets',
      title: '11. Ver Dashboard de Tickets',
      description: 'Verificar que los tickets aparezcan en el dashboard',
      status: 'idle',
      route: '/cliente/tickets',
      manualAction: 'Navegar a /cliente/tickets → Verificar filtros → Click en "Ver QR"'
    },
    {
      id: 'ticket-modal',
      title: '12. Ver Modal de Ticket',
      description: 'Verificar modal con QR grande y opciones',
      status: 'idle',
      manualAction: 'Click en "Ver QR" → Verificar QR grande → Probar "Descargar" y "Compartir"'
    }
  ])

  const runAutoTest = async (stepId: string) => {
    const step = steps.find(s => s.id === stepId)
    if (!step || !step.action) return

    setSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, status: 'running' as TestStatus } : s))
    )

    try {
      await step.action()
      setSteps(prev =>
        prev.map(s =>
          s.id === stepId ? { ...s, status: 'success' as TestStatus, error: undefined } : s
        )
      )
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      setSteps(prev =>
        prev.map(s =>
          s.id === stepId ? { ...s, status: 'error' as TestStatus, error: errorMsg } : s
        )
      )
      toast.error(errorMsg)
    }
  }

  const markAsComplete = (stepId: string) => {
    setSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, status: 'success' as TestStatus } : s))
    )
    toast.success('Paso marcado como completado')
  }

  const navigateTo = (route: string) => {
    router.push(route)
    toast.info(`Navegando a ${route}`)
  }

  const resetTests = () => {
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' as TestStatus, error: undefined })))
    toast.info('Tests reiniciados')
  }

  const runAllAutoTests = async () => {
    const autoSteps = steps.filter(s => s.action)
    for (const step of autoSteps) {
      await runAutoTest(step.id)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const completedSteps = steps.filter(s => s.status === 'success').length
  const totalSteps = steps.length
  const progress = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🧪 Testing del Flujo Completo</h1>
        <p className="mt-2 text-gray-600">
          Sigue estos pasos para validar el flujo end-to-end del sistema de eventos
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso General</CardTitle>
          <CardDescription>
            {completedSteps} de {totalSteps} pasos completados ({progress}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button onClick={runAllAutoTests} size="sm">
              <Play className="mr-2 h-4 w-4" />
              Ejecutar Tests Automáticos
            </Button>
            <Button onClick={resetTests} variant="outline" size="sm">
              Reiniciar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card
            key={step.id}
            className={`transition-all ${
              step.status === 'success'
                ? 'border-green-200 bg-green-50'
                : step.status === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    {step.status === 'success' && (
                      <Badge className="bg-green-600">
                        <Check className="mr-1 h-3 w-3" />
                        Completado
                      </Badge>
                    )}
                    {step.status === 'error' && (
                      <Badge variant="destructive">
                        <X className="mr-1 h-3 w-3" />
                        Error
                      </Badge>
                    )}
                    {step.status === 'running' && (
                      <Badge className="bg-blue-600">
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Ejecutando...
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1">{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Manual Action */}
              {step.manualAction && (
                <div className="mb-3 rounded-lg bg-blue-50 p-3">
                  <p className="text-sm text-blue-900">
                    <strong>📝 Acción manual:</strong> {step.manualAction}
                  </p>
                </div>
              )}

              {/* Error */}
              {step.error && (
                <div className="mb-3 rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-900">
                    <strong>❌ Error:</strong> {step.error}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {step.action && (
                  <Button
                    onClick={() => runAutoTest(step.id)}
                    size="sm"
                    variant="outline"
                    disabled={step.status === 'running'}
                  >
                    {step.status === 'running' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ejecutando...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Ejecutar Test
                      </>
                    )}
                  </Button>
                )}

                {step.route && (
                  <Button
                    onClick={() => navigateTo(step.route!)}
                    size="sm"
                    variant="outline"
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    Ir a {step.route}
                  </Button>
                )}

                {step.manualAction && step.status !== 'success' && (
                  <Button onClick={() => markAsComplete(step.id)} size="sm" variant="outline">
                    <Check className="mr-2 h-4 w-4" />
                    Marcar como Completado
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      {progress === 100 && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">🎉 ¡Todos los tests completados!</CardTitle>
            <CardDescription className="text-green-700">
              El flujo completo ha sido validado exitosamente. Puedes marcar la tarea 6.8 como
              completada.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Documentation Link */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Documentación Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Para testing más detallado, consulta:
          </p>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
            <li>
              <code className="rounded bg-gray-100 px-1">docs/TESTING_FLUJO_COMPLETO.md</code> -
              Guía completa con todos los casos de prueba
            </li>
            <li>
              <code className="rounded bg-gray-100 px-1">scripts/test-flujo-completo.ts</code> -
              Script de validación automática
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
