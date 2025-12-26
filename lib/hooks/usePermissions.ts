/**
 * Hook para manejar permisos y roles del usuario actual
 */

'use client'

import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { Permission, Rol, PermissionContext } from '@/types/roles.types'
import {
  getPermissionsByRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRole,
  isAnyRole,
  getDashboardRoute,
  isAdmin,
  isHost,
  isCliente,
} from '@/lib/utils/permissions'
import type { UserWithRole } from '@/types/roles.types'

/**
 * Hook que proporciona acceso a permisos y roles del usuario
 */
export function usePermissions(): PermissionContext {
  const { userProfile } = useAuth()

  // Convertir userProfile a UserWithRole
  const userWithRole = useMemo<UserWithRole | null>(() => {
    if (!userProfile) return null

    return {
      uid: userProfile.uid,
      email: userProfile.email,
      nombre: userProfile.nombre,
      rol: userProfile.rol,
      telefono: userProfile.telefono,
      createdAt: userProfile.createdAt,
    }
  }, [userProfile])

  // Obtener permisos del usuario
  const permissions = useMemo<Permission[]>(() => {
    if (!userWithRole) return []
    return getPermissionsByRole(userWithRole.rol)
  }, [userWithRole])

  // Crear contexto de permisos
  const permissionContext = useMemo<PermissionContext>(
    () => ({
      user: userWithRole,
      permissions,
      hasPermission: (permission: Permission) => hasPermission(userWithRole, permission),
      hasAnyPermission: (perms: Permission[]) => hasAnyPermission(userWithRole, perms),
      hasAllPermissions: (perms: Permission[]) => hasAllPermissions(userWithRole, perms),
      isRole: (role: Rol) => isRole(userWithRole, role),
      isAnyRole: (roles: Rol[]) => isAnyRole(userWithRole, roles),
    }),
    [userWithRole, permissions]
  )

  return permissionContext
}

/**
 * Hook simplificado para verificar si el usuario es admin
 */
export function useIsAdmin(): boolean {
  const { user } = usePermissions()
  return isAdmin(user)
}

/**
 * Hook simplificado para verificar si el usuario es host
 */
export function useIsHost(): boolean {
  const { user } = usePermissions()
  return isHost(user)
}

/**
 * Hook simplificado para verificar si el usuario es cliente
 */
export function useIsCliente(): boolean {
  const { user } = usePermissions()
  return isCliente(user)
}

/**
 * Hook para obtener el rol del usuario actual
 */
export function useUserRole(): Rol | null {
  const { user } = usePermissions()
  return user?.rol || null
}

/**
 * Hook para obtener la ruta del dashboard del usuario
 */
export function useDashboardRoute(): string {
  const { user } = usePermissions()
  return getDashboardRoute(user)
}

/**
 * Hook para verificar si el usuario tiene un permiso específico
 */
export function useHasPermission(permission: Permission): boolean {
  const { hasPermission: check } = usePermissions()
  return check(permission)
}

/**
 * Hook para verificar si el usuario tiene alguno de los permisos
 */
export function useHasAnyPermission(permissions: Permission[]): boolean {
  const { hasAnyPermission: check } = usePermissions()
  return check(permissions)
}

/**
 * Hook para verificar si el usuario tiene todos los permisos
 */
export function useHasAllPermissions(permissions: Permission[]): boolean {
  const { hasAllPermissions: check } = usePermissions()
  return check(permissions)
}
