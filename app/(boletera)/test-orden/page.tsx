'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

export default function TestOrdenPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ordenId, setOrdenId] = useState<string>('')

  const crearOrdenPrueba = async () => {
    setLoading(true)
    try {
      // Crear orden de prueba
      const ordenData = {
        userId: 'test-user',
        eventoId: 'test-evento-123',
        items: [
          {
            tipoTicketId: 'vip-001',
            nombre: 'VIP',
            precio: 500,
            cantidad: 2,
            subtotal: 1000,
          },
          {
            tipoTicketId: 'general-001',
            nombre: 'General',
            precio: 200,
            cantidad: 3,
            subtotal: 600,
          },
        ],
        subtotal: 1600,
        descuento: 0,
        total: 1600,
        codigoDescuento: null,
        metodoPago: 'card',
        estado: 'pagada',
        datosComprador: {
          nombre: 'Usuario de Prueba',
          email: 'test@ejemplo.com',
          telefono: '+52 123 456 7890',
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        pagadoAt: Timestamp.now(),
      }

      const ordenRef = await addDoc(collection(db!, 'ordenes'), ordenData)
      console.log('Orden de prueba creada:', ordenRef.id)

      // Crear tickets de prueba
      const ticketsData = [
        { tipoTicket: 'VIP', cantidad: 2 },
        { tipoTicket: 'General', cantidad: 3 },
      ]

      for (const ticket of ticketsData) {
        for (let i = 0; i < ticket.cantidad; i++) {
          await addDoc(collection(db!, 'tickets'), {
            ordenId: ordenRef.id,
            eventoId: 'test-evento-123',
            tipoTicketId: ticket.tipoTicket.toLowerCase() + '-001',
            tipoTicket: ticket.tipoTicket,
            precio: ticket.tipoTicket === 'VIP' ? 500 : 200,
            qrCode: `TICKET-${ordenRef.id}-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
            usado: false,
            createdAt: Timestamp.now(),
          })
        }
      }

      // Crear evento de prueba si no existe
      await addDoc(collection(db!, 'eventos'), {
        id: 'test-evento-123',
        titulo: 'Festival de Música 2024',
        descripcion: 'El mejor festival del año',
        categoria: 'concierto',
        fecha: Timestamp.fromDate(new Date('2024-03-15T20:00:00')),
        horaInicio: '20:00',
        horaFin: '02:00',
        venueId: 'venue-001',
        venue: {
          id: 'venue-001',
          nombre: 'Central Stadium',
          direccion: 'Av. Principal 123',
          ciudad: 'Ciudad de México',
          estado: 'CDMX',
          codigoPostal: '12345',
          capacidad: 5000,
        },
        estado: 'publicado',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      setOrdenId(ordenRef.id)
      toast.success('Orden de prueba creada: ' + ordenRef.id)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al crear orden de prueba')
    } finally {
      setLoading(false)
    }
  }

  const irAConfirmacion = () => {
    if (ordenId) {
      router.push(`/confirmacion/${ordenId}`)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <h1 className="mb-6 text-3xl font-bold">🧪 Prueba de Página de Confirmación</h1>

        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Paso 1: Crear Orden de Prueba</h2>
            <p className="mb-4 text-sm text-gray-600">
              Esto creará una orden con tickets de ejemplo en Firestore
            </p>
            <Button onClick={crearOrdenPrueba} disabled={loading} className="w-full">
              {loading ? 'Creando orden...' : 'Crear Orden de Prueba'}
            </Button>
          </div>

          {ordenId && (
            <div className="rounded-lg bg-green-50 p-4">
              <p className="mb-2 font-semibold text-green-900">✅ Orden creada exitosamente</p>
              <p className="mb-4 text-sm text-green-700">
                ID de la orden: <code className="rounded bg-green-100 px-2 py-1">{ordenId}</code>
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Paso 2: Ver Página de Confirmación</h3>
                <Button onClick={irAConfirmacion} className="w-full">
                  Ir a Página de Confirmación
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">ℹ️ Información</h3>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Esta página crea una orden de prueba en Firestore</li>
              <li>• Genera 5 tickets (2 VIP + 3 General)</li>
              <li>• Cada ticket tiene un QR code único</li>
              <li>• Puedes probar la descarga de PDF y calendario</li>
            </ul>
          </div>

          <div className="text-sm text-gray-500">
            <p>Para probar el flujo completo:</p>
            <ol className="ml-4 mt-2 list-decimal space-y-1">
              <li>Agrega eventos al carrito en /eventos</li>
              <li>Ve a /carrito</li>
              <li>Procede al checkout en /checkout</li>
              <li>Completa el formulario y paga</li>
              <li>Serás redirigido a /confirmacion/[ordenId]</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
