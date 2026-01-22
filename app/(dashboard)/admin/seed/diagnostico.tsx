'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export function DiagnosticoFirebase() {
  const [estado, setEstado] = useState<{
    dbInicializado: boolean
    puedeConectar: boolean
    error?: string
  }>({
    dbInicializado: false,
    puedeConectar: false
  })

  useEffect(() => {
    async function diagnosticar() {
      // 1. Verificar que db existe
      if (!db) {
        setEstado({
          dbInicializado: false,
          puedeConectar: false,
          error: 'Firebase Firestore no está inicializado'
        })
        return
      }

      // 2. Intentar conectar a Firestore
      try {
        const eventosRef = collection(db, 'eventos')
        await getDocs(eventosRef)

        setEstado({
          dbInicializado: true,
          puedeConectar: true
        })
      } catch (error) {
        setEstado({
          dbInicializado: true,
          puedeConectar: false,
          error: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }

    diagnosticar()
  }, [])

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Diagnóstico de Firebase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          {estado.dbInicializado ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm">
            Firestore {estado.dbInicializado ? 'inicializado' : 'NO inicializado'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {estado.puedeConectar ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : estado.dbInicializado ? (
            <XCircle className="h-4 w-4 text-red-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm">
            Conexión a Firestore {estado.puedeConectar ? 'exitosa' : 'pendiente'}
          </span>
        </div>

        {estado.error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <strong>Error:</strong> {estado.error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
