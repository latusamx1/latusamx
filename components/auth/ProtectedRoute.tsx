'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'host' | 'cliente'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, userProfile, isLoading, isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Verificar rol si es requerido
    if (requiredRole && userProfile && userProfile.rol !== requiredRole) {
      // Si no tiene el rol requerido, redirigir al dashboard
      router.push('/dashboard')
    }
  }, [isAuthenticated, userProfile, requiredRole, router, isInitialized])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no renderizar nada (el useEffect redirige)
  if (!isAuthenticated) {
    return null
  }

  // Si requiere un rol específico y no lo tiene, no renderizar nada
  if (requiredRole && userProfile && userProfile.rol !== requiredRole) {
    return null
  }

  return <>{children}</>
}
