'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { Loader2, CheckCircle, Wrench } from 'lucide-react'
import { toast } from 'sonner'

export function FixEventos() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ actualizados: number; errores: number } | null>(null)

  const fixEventos = async () => {
    if (!db) {
      toast.error('Firebase no inicializado')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const eventosRef = collection(db, 'eventos')
      const snapshot = await getDocs(eventosRef)

      let actualizados = 0
      let errores = 0

      for (const docSnap of snapshot.docs) {
        try {
          const data = docSnap.data()

          // Solo actualizar si no tiene 'status' o si 'status' no coincide con 'estado'
          if (!data.status || data.status !== data.estado) {
            await updateDoc(doc(db, 'eventos', docSnap.id), {
              status: data.estado || 'publicado'
            })
            actualizados++
            console.log(`✓ Actualizado: ${data.titulo}`)
          }
        } catch (error) {
          console.error(`✗ Error en ${docSnap.id}:`, error)
          errores++
        }
      }

      setResult({ actualizados, errores })

      if (actualizados > 0) {
        toast.success(`${actualizados} eventos actualizados correctamente`)
      } else {
        toast.info('No hay eventos que necesiten actualización')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar eventos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-4 border-orange-300 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wrench className="h-5 w-5 text-orange-600" />
          Reparar Eventos Existentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">
          Si tienes eventos que no aparecen en la página de catálogo, usa esta herramienta
          para agregar el campo <code className="bg-white px-1 py-0.5 rounded">status</code> faltante.
        </p>

        <Button
          onClick={fixEventos}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              <Wrench className="mr-2 h-4 w-4" />
              Actualizar Eventos
            </>
          )}
        </Button>

        {result && (
          <div className="mt-3 p-3 bg-white border border-orange-200 rounded text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span>Eventos actualizados: {result.actualizados}</span>
            </div>
            {result.errores > 0 && (
              <div className="mt-1 text-red-700">
                Errores: {result.errores}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
