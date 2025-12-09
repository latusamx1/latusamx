'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { userProfile, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Bienvenido, <span className="font-semibold">{userProfile?.nombre}</span>!
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="font-semibold text-blue-900 mb-2">Información del Usuario</h2>
                <dl className="space-y-1 text-sm">
                  <div>
                    <dt className="inline font-medium">Email:</dt>{' '}
                    <dd className="inline">{userProfile?.email}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Rol:</dt>{' '}
                    <dd className="inline capitalize">{userProfile?.rol}</dd>
                  </div>
                  {userProfile?.telefono && (
                    <div>
                      <dt className="inline font-medium">Teléfono:</dt>{' '}
                      <dd className="inline">{userProfile.telefono}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="font-semibold text-green-900 mb-2">
                  ✅ Sistema de Autenticación Completado
                </h2>
                <p className="text-sm text-green-800">
                  El sistema de autenticación está funcionando correctamente. Puedes iniciar
                  sesión, registrarte y cerrar sesión.
                </p>
              </div>

              <Button onClick={logout} variant="outline" className="w-full sm:w-auto">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
