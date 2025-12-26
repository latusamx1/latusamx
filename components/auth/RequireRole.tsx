/**
 * Componente para proteger contenido por rol
 * Solo renderiza children si el usuario tiene el rol requerido
 */

'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Rol } from '@/types/roles.types'
import { usePermissions, useDashboardRoute } from '@/lib/hooks/usePermissions'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RequireRoleProps {
  /**
   * Rol requerido para ver el contenido
   */
  role?: Rol

  /**
   * Lista de roles permitidos (al menos uno)
   */
  roles?: Rol[]

  /**
   * Contenido a renderizar si tiene permiso
   */
  children: ReactNode

  /**
   * Componente a renderizar si no tiene permiso
   */
  fallback?: ReactNode

  /**
   * Si es true, redirige automáticamente en lugar de mostrar fallback
   */
  redirect?: boolean
}

/**
 * Componente que protege contenido basado en rol
 */
export function RequireRole({ role, roles, children, fallback, redirect = false }: RequireRoleProps) {
  const router = useRouter()
  const { user, isRole, isAnyRole } = usePermissions()
  const dashboardRoute = useDashboardRoute()

  // Verificar autenticación
  if (!user) {
    if (redirect) {
      router.push('/login')
      return null
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder a este contenido.</p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    )
  }

  // ADMIN tiene acceso a todo - siempre permitir
  const isAdmin = user.rol === Rol.ADMIN
  if (isAdmin) {
    return <>{children}</>
  }

  // Verificar rol individual
  if (role && !isRole(role)) {
    if (redirect) {
      router.push(dashboardRoute)
      return null
    }

    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder a este contenido. Se requiere el rol: <strong>{role}</strong>
            </p>
            <Button onClick={() => router.push(dashboardRoute)} className="w-full">
              Volver al Dashboard
            </Button>
          </div>
        </div>
      )
    )
  }

  // Verificar lista de roles
  if (roles && !isAnyRole(roles)) {
    if (redirect) {
      router.push(dashboardRoute)
      return null
    }

    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder a este contenido. Se requiere alguno de estos roles:{' '}
              <strong>{roles.join(', ')}</strong>
            </p>
            <Button onClick={() => router.push(dashboardRoute)} className="w-full">
              Volver al Dashboard
            </Button>
          </div>
        </div>
      )
    )
  }

  // Usuario tiene el rol requerido
  return <>{children}</>
}

/**
 * Componente específico para contenido solo de Admin
 */
export function RequireAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RequireRole role={Rol.ADMIN} fallback={fallback}>
      {children}
    </RequireRole>
  )
}

/**
 * Componente específico para contenido solo de Host
 */
export function RequireHost({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RequireRole role={Rol.HOST} fallback={fallback}>
      {children}
    </RequireRole>
  )
}

/**
 * Componente específico para contenido solo de Cliente
 */
export function RequireCliente({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RequireRole role={Rol.CLIENTE} fallback={fallback}>
      {children}
    </RequireRole>
  )
}

/**
 * Componente específico para contenido de Admin o Host
 */
export function RequireStaff({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RequireRole roles={[Rol.ADMIN, Rol.HOST]} fallback={fallback}>
      {children}
    </RequireRole>
  )
}
