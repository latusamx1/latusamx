/**
 * Higher Order Component (HOC) para proteger componentes por rol
 */

'use client'

import { ComponentType } from 'react'
import { Rol } from '@/types/roles.types'
import { RequireRole } from '@/components/auth/RequireRole'

/**
 * HOC que envuelve un componente con protección de rol
 */
export function withRole<P extends object>(
  Component: ComponentType<P>,
  role: Rol,
  options?: {
    redirect?: boolean
    fallback?: React.ReactNode
  }
) {
  const WrappedComponent = (props: P) => {
    return (
      <RequireRole role={role} redirect={options?.redirect} fallback={options?.fallback}>
        <Component {...props} />
      </RequireRole>
    )
  }

  WrappedComponent.displayName = `withRole(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}

/**
 * HOC que envuelve un componente con protección de múltiples roles
 */
export function withAnyRole<P extends object>(
  Component: ComponentType<P>,
  roles: Rol[],
  options?: {
    redirect?: boolean
    fallback?: React.ReactNode
  }
) {
  const WrappedComponent = (props: P) => {
    return (
      <RequireRole roles={roles} redirect={options?.redirect} fallback={options?.fallback}>
        <Component {...props} />
      </RequireRole>
    )
  }

  WrappedComponent.displayName = `withAnyRole(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}

/**
 * HOC específico para componentes de Admin
 */
export function withAdmin<P extends object>(
  Component: ComponentType<P>,
  options?: {
    redirect?: boolean
    fallback?: React.ReactNode
  }
) {
  return withRole(Component, Rol.ADMIN, options)
}

/**
 * HOC específico para componentes de Host
 */
export function withHost<P extends object>(
  Component: ComponentType<P>,
  options?: {
    redirect?: boolean
    fallback?: React.ReactNode
  }
) {
  return withRole(Component, Rol.HOST, options)
}

/**
 * HOC específico para componentes de Staff (Admin o Host)
 */
export function withStaff<P extends object>(
  Component: ComponentType<P>,
  options?: {
    redirect?: boolean
    fallback?: React.ReactNode
  }
) {
  return withAnyRole(Component, [Rol.ADMIN, Rol.HOST], options)
}
