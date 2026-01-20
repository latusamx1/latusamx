'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore'
import { Loader2, CheckCircle, XCircle, Database, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const eventos = [
  // EVENTO 1: Stock Alto
  {
    titulo: 'Festival Electrónico Winter 2026',
    descripcion: 'El festival de música electrónica más esperado del año. Con los mejores DJs internacionales y producción de clase mundial. Incluye 3 escenarios, zona VIP con open bar, y experiencias inmersivas.',
    categoria: 'festival' as const,
    fecha: Timestamp.fromDate(new Date('2026-02-14T20:00:00')),
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
      ubicacion: { lat: 19.406393, lng: -99.090584 },
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
        disponibles: 40000,
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
        disponibles: 5000,
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
        disponibles: 500,
        ventaMinima: 1,
        ventaMaxima: 4,
        orden: 3
      }
    ],
    estado: 'publicado' as const,
    destacado: true,
    tags: ['electronica', 'festival', 'techno', 'house'],
    precioMinimo: 1500,
    createdBy: 'admin',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    titulo: 'Concierto: Los Ángeles Azules',
    descripcion: 'La legendaria banda de cumbia sinfónica presenta su nuevo álbum "De Plaza en Plaza Tour 2026".',
    categoria: 'concierto' as const,
    fecha: Timestamp.fromDate(new Date('2026-02-08T21:00:00')),
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
      ubicacion: { lat: 19.425635, lng: -99.191788 },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    imagenPortada: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200',
    imagenPublicId: 'eventos/angeles-azules-2026',
    artistas: ['Los Ángeles Azules'],
    tiposTickets: [
      {
        id: 'ticket-cumbia-general',
        nombre: 'General',
        descripcion: 'Acceso general de pie',
        precio: 800,
        cantidad: 5000,
        disponibles: 1200,
        ventaMinima: 1,
        ventaMaxima: 8,
        orden: 1
      },
      {
        id: 'ticket-cumbia-palco',
        nombre: 'Palco',
        descripcion: 'Asientos en palcos',
        precio: 1800,
        cantidad: 3000,
        disponibles: 450,
        ventaMinima: 1,
        ventaMaxima: 6,
        orden: 2
      },
      {
        id: 'ticket-cumbia-vip',
        nombre: 'VIP Meet & Greet',
        descripcion: 'Acceso VIP + Foto',
        precio: 4500,
        cantidad: 200,
        disponibles: 8,
        ventaMinima: 1,
        ventaMaxima: 2,
        orden: 3
      }
    ],
    estado: 'publicado' as const,
    destacado: true,
    tags: ['cumbia', 'mexicano'],
    precioMinimo: 800,
    createdBy: 'admin',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    titulo: 'Stand Up: Franco Escamilla',
    descripcion: 'El comediante #1 regresa con su tour "Payaso Tour 2026". ¡ÚLTIMAS ENTRADAS!',
    categoria: 'teatro' as const,
    fecha: Timestamp.fromDate(new Date('2026-01-31T20:30:00')),
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
      ubicacion: { lat: 19.437679, lng: -99.154213 },
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
        disponibles: 12,
        ventaMinima: 1,
        ventaMaxima: 4,
        orden: 1
      },
      {
        id: 'ticket-standup-preferente',
        nombre: 'Preferente',
        descripcion: 'Asientos preferenciales',
        precio: 1200,
        cantidad: 1000,
        disponibles: 5,
        ventaMinima: 1,
        ventaMaxima: 4,
        orden: 2
      },
      {
        id: 'ticket-standup-vip',
        nombre: 'VIP Front Row',
        descripcion: 'Primera fila + Foto',
        precio: 2500,
        cantidad: 50,
        disponibles: 0,
        ventaMinima: 1,
        ventaMaxima: 2,
        orden: 3
      }
    ],
    estado: 'publicado' as const,
    destacado: false,
    tags: ['comedia', 'stand-up'],
    precioMinimo: 650,
    createdBy: 'admin',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const ejecutarSeed = async () => {
    if (!db) {
      toast.error('Firebase no inicializado')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const eventosRef = collection(db, 'eventos')
      const created = []

      for (const evento of eventos) {
        const docRef = await addDoc(eventosRef, evento)

        const totalDisponibles = evento.tiposTickets.reduce((sum, t) => sum + t.disponibles, 0)
        const totalTickets = evento.tiposTickets.reduce((sum, t) => sum + t.cantidad, 0)
        const porcentaje = ((totalDisponibles / totalTickets) * 100).toFixed(1)

        created.push({
          id: docRef.id,
          titulo: evento.titulo,
          fecha: evento.fecha.toDate().toLocaleDateString('es-MX'),
          stock: `${totalDisponibles}/${totalTickets} (${porcentaje}%)`,
          tickets: evento.tiposTickets.map(t => ({
            nombre: t.nombre,
            disponibles: t.disponibles,
            total: t.cantidad
          }))
        })
      }

      setResult({ success: true, eventos: created })
      toast.success(`${eventos.length} eventos creados exitosamente`)
    } catch (error) {
      console.error('Error:', error)
      setResult({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' })
      toast.error('Error al crear eventos')
    } finally {
      setLoading(false)
    }
  }

  const limpiarEventos = async () => {
    if (!db) {
      toast.error('Firebase no inicializado')
      return
    }

    if (!confirm('¿Estás seguro de eliminar todos los eventos? Esta acción no se puede deshacer.')) {
      return
    }

    setLoading(true)

    try {
      const eventosRef = collection(db, 'eventos')
      const snapshot = await getDocs(eventosRef)

      let eliminados = 0
      for (const doc of snapshot.docs) {
        await doc.ref.delete()
        eliminados++
      }

      toast.success(`${eliminados} eventos eliminados`)
      setResult(null)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar eventos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🌱 Seed de Eventos</h1>
        <p className="mt-2 text-gray-600">Herramienta para crear eventos de prueba</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Disponibles</CardTitle>
          <CardDescription>
            Crea eventos de prueba para testing del sistema de inventario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={ejecutarSeed} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Crear 3 Eventos de Prueba
                </>
              )}
            </Button>

            <Button onClick={limpiarEventos} disabled={loading} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar Todos
            </Button>
          </div>

          {result && (
            <div className={`rounded-lg border p-4 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              {result.success ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">Eventos Creados Exitosamente</h3>
                  </div>
                  <div className="space-y-3">
                    {result.eventos.map((evento: any, i: number) => (
                      <div key={i} className="rounded bg-white p-3 text-sm">
                        <div className="font-medium text-gray-900">{evento.titulo}</div>
                        <div className="text-gray-600">Fecha: {evento.fecha}</div>
                        <div className="text-gray-600">Stock: {evento.stock}</div>
                        <div className="mt-2 space-y-1">
                          {evento.tickets.map((t: any, j: number) => (
                            <div key={j} className="text-xs text-gray-500">
                              • {t.nombre}: {t.disponibles}/{t.total}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-900">Error al Crear Eventos</h3>
                  </div>
                  <p className="text-sm text-red-800">{result.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos a Crear</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eventos.map((evento, i) => {
              const totalDisp = evento.tiposTickets.reduce((s, t) => s + t.disponibles, 0)
              const totalTotal = evento.tiposTickets.reduce((s, t) => s + t.cantidad, 0)
              const perc = ((totalDisp / totalTotal) * 100).toFixed(0)

              return (
                <div key={i} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{evento.titulo}</h4>
                      <p className="text-sm text-gray-600">
                        {evento.fecha.toDate().toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <span className={`rounded px-2 py-1 text-xs font-medium ${
                      parseInt(perc) > 50 ? 'bg-green-100 text-green-800' :
                      parseInt(perc) > 10 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {perc}% stock
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
