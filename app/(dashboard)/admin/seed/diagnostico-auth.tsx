'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, User } from 'lucide-react'
import { onAuthStateChanged } from 'firebase/auth'

export function DiagnosticoAuth() {
  const [estado, setEstado] = useState<{
    autenticado: boolean
    email?: string
    uid?: string
    rol?: string
    error?: string
  }>({
    autenticado: false
  })

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setEstado({
          autenticado: false,
          error: 'No hay usuario autenticado'
        })
        return
      }

      // Usuario autenticado, verificar rol
      try {
        const userDoc = await getDoc(doc(db!, 'usuarios', user.uid))

        if (!userDoc.exists()) {
          setEstado({
            autenticado: true,
            email: user.email || undefined,
            uid: user.uid,
            error: 'Documento de usuario no existe en Firestore'
          })
          return
        }

        const userData = userDoc.data()

        setEstado({
          autenticado: true,
          email: user.email || undefined,
          uid: user.uid,
          rol: userData.rol
        })
      } catch (error) {
        setEstado({
          autenticado: true,
          email: user.email || undefined,
          uid: user.uid,
          error: error instanceof Error ? error.message : 'Error al obtener rol'
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const esAdmin = estado.rol === 'admin'

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Diagnóstico de Autenticación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          {estado.autenticado ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm">
            {estado.autenticado ? 'Autenticado' : 'NO autenticado'}
          </span>
        </div>

        {estado.email && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm">Email: {estado.email}</span>
          </div>
        )}

        {estado.uid && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">UID: {estado.uid.substring(0, 10)}...</span>
          </div>
        )}

        {estado.rol && (
          <div className="flex items-center gap-2">
            {esAdmin ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
            <span className="text-sm">
              Rol: <strong>{estado.rol}</strong>
              {!esAdmin && ' (Necesitas rol "admin")'}
            </span>
          </div>
        )}

        {estado.error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
            <strong>Error:</strong> {estado.error}
          </div>
        )}

        {!estado.autenticado && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <strong>Solución:</strong> Debes iniciar sesión con una cuenta de administrador para usar esta herramienta.
            <br />
            <a href="/auth/login" className="underline font-medium mt-1 inline-block">
              Ir a inicio de sesión →
            </a>
          </div>
        )}

        {estado.autenticado && !esAdmin && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
            <strong>Problema:</strong> Tu usuario no tiene permisos de administrador.
            <br />
            Contacta a un administrador para actualizar tu rol a "admin".
          </div>
        )}

        {estado.autenticado && esAdmin && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
            <strong>✓ Todo correcto:</strong> Tienes permisos de administrador para crear eventos.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
