/**
 * Utilidades para manejo de permisos y roles
 */

import { Rol, Permission, ROL_PERMISSIONS, ROL_ROUTES } from '@/types/roles.types'
import type { UserWithRole } from '@/types/roles.types'

// ========================================
// HELPERS DE PERMISOS
// ========================================

/**
 * Obtiene todos los permisos de un rol
 */
export function getPermissionsByRole(rol: Rol): Permission[] {
  return ROL_PERMISSIONS[rol] || []
}

/**
 * Verifica si un usuario tiene un permiso específico
 */
export function hasPermission(user: UserWithRole | null, permission: Permission): boolean {
  if (!user) return false

  const permissions = getPermissionsByRole(user.rol)
  return permissions.includes(permission)
}

/**
 * Verifica si un usuario tiene al menos uno de los permisos
 */
export function hasAnyPermission(user: UserWithRole | null, permissions: Permission[]): boolean {
  if (!user) return false

  const userPermissions = getPermissionsByRole(user.rol)
  return permissions.some((permission) => userPermissions.includes(permission))
}

/**
 * Verifica si un usuario tiene todos los permisos
 */
export function hasAllPermissions(user: UserWithRole | null, permissions: Permission[]): boolean {
  if (!user) return false

  const userPermissions = getPermissionsByRole(user.rol)
  return permissions.every((permission) => userPermissions.includes(permission))
}

// ========================================
// HELPERS DE ROLES
// ========================================

/**
 * Verifica si un usuario tiene un rol específico
 */
export function isRole(user: UserWithRole | null, role: Rol): boolean {
  if (!user) return false
  return user.rol === role
}

/**
 * Verifica si un usuario tiene alguno de los roles
 */
export function isAnyRole(user: UserWithRole | null, roles: Rol[]): boolean {
  if (!user) return false
  return roles.includes(user.rol)
}

/**
 * Verifica si un usuario es admin
 */
export function isAdmin(user: UserWithRole | null): boolean {
  return isRole(user, Rol.ADMIN)
}

/**
 * Verifica si un usuario es host
 */
export function isHost(user: UserWithRole | null): boolean {
  return isRole(user, Rol.HOST)
}

/**
 * Verifica si un usuario es cliente
 */
export function isCliente(user: UserWithRole | null): boolean {
  return isRole(user, Rol.CLIENTE)
}

// ========================================
// HELPERS DE NAVEGACIÓN
// ========================================

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 */
export function getDashboardRoute(user: UserWithRole | null): string {
  if (!user) return '/login'
  return ROL_ROUTES[user.rol] || '/dashboard/cliente'
}

/**
 * Verifica si una ruta está permitida para un rol
 */
export function isRouteAllowedForRole(path: string, user: UserWithRole | null): boolean {
  if (!user) return false

  // Rutas de admin solo para admin
  if (path.startsWith('/dashboard/admin') || path.startsWith('/admin')) {
    return isAdmin(user)
  }

  // Rutas de host solo para host y admin
  if (path.startsWith('/dashboard/host') || path.startsWith('/host')) {
    return isHost(user) || isAdmin(user)
  }

  // Rutas de cliente para todos los usuarios autenticados
  if (path.startsWith('/dashboard/cliente') || path.startsWith('/cliente')) {
    return true
  }

  // Dashboard genérico - redirigir al dashboard específico
  if (path === '/dashboard') {
    return true
  }

  return true
}

/**
 * Obtiene la ruta de redirección si el usuario no tiene acceso
 */
export function getRedirectRoute(path: string, user: UserWithRole | null): string | null {
  if (!user) return '/login'

  if (!isRouteAllowedForRole(path, user)) {
    return getDashboardRoute(user)
  }

  return null
}

// ========================================
// HELPERS DE VALIDACIÓN
// ========================================

/**
 * Valida que un usuario puede realizar una acción
 * Lanza error si no tiene permiso
 */
export function requirePermission(user: UserWithRole | null, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`No tienes permiso para realizar esta acción: ${permission}`)
  }
}

/**
 * Valida que un usuario tiene un rol específico
 * Lanza error si no tiene el rol
 */
export function requireRole(user: UserWithRole | null, role: Rol): void {
  if (!isRole(user, role)) {
    throw new Error(`No tienes el rol requerido: ${role}`)
  }
}

/**
 * Valida que un usuario tiene alguno de los roles
 * Lanza error si no tiene ninguno de los roles
 */
export function requireAnyRole(user: UserWithRole | null, roles: Rol[]): void {
  if (!isAnyRole(user, roles)) {
    throw new Error(`No tienes ninguno de los roles requeridos: ${roles.join(', ')}`)
  }
}

// ========================================
// HELPERS PARA API ROUTES
// ========================================

/**
 * Middleware para verificar permisos en API routes
 */
export function checkPermission(user: UserWithRole | null, permission: Permission): {
  allowed: boolean
  error?: string
} {
  if (!user) {
    return {
      allowed: false,
      error: 'Usuario no autenticado',
    }
  }

  if (!hasPermission(user, permission)) {
    return {
      allowed: false,
      error: `No tienes permiso para: ${permission}`,
    }
  }

  return { allowed: true }
}

/**
 * Middleware para verificar rol en API routes
 */
export function checkRole(user: UserWithRole | null, role: Rol): {
  allowed: boolean
  error?: string
} {
  if (!user) {
    return {
      allowed: false,
      error: 'Usuario no autenticado',
    }
  }

  if (!isRole(user, role)) {
    return {
      allowed: false,
      error: `Requiere rol: ${role}`,
    }
  }

  return { allowed: true }
}

/**
 * Middleware para verificar alguno de los roles en API routes
 */
export function checkAnyRole(user: UserWithRole | null, roles: Rol[]): {
  allowed: boolean
  error?: string
} {
  if (!user) {
    return {
      allowed: false,
      error: 'Usuario no autenticado',
    }
  }

  if (!isAnyRole(user, roles)) {
    return {
      allowed: false,
      error: `Requiere alguno de estos roles: ${roles.join(', ')}`,
    }
  }

  return { allowed: true }
}
