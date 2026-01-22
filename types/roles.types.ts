/**
 * Sistema de Roles y Permisos
 * Define los roles del sistema y sus permisos asociados
 */

// ========================================
// ENUMS
// ========================================

/**
 * Roles disponibles en el sistema
 */
export enum Rol {
  ADMIN = 'admin',
  HOST = 'host',
  CLIENTE = 'cliente',
}

/**
 * Permisos granulares del sistema
 */
export enum Permission {
  // Eventos
  EVENTOS_VIEW = 'eventos:view',
  EVENTOS_CREATE = 'eventos:create',
  EVENTOS_EDIT = 'eventos:edit',
  EVENTOS_DELETE = 'eventos:delete',
  EVENTOS_PUBLISH = 'eventos:publish',

  // Tickets y Órdenes
  TICKETS_VIEW = 'tickets:view',
  TICKETS_VIEW_ALL = 'tickets:view:all',
  TICKETS_SCAN = 'tickets:scan',
  TICKETS_VALIDATE = 'tickets:validate',
  ORDENES_VIEW = 'ordenes:view',
  ORDENES_VIEW_ALL = 'ordenes:view:all',
  ORDENES_REFUND = 'ordenes:refund',

  // Reservas
  RESERVAS_VIEW = 'reservas:view',
  RESERVAS_VIEW_ALL = 'reservas:view:all',
  RESERVAS_CREATE = 'reservas:create',
  RESERVAS_EDIT = 'reservas:edit',
  RESERVAS_CANCEL = 'reservas:cancel',
  RESERVAS_CHECKIN = 'reservas:checkin',

  // Sucursales y Mesas
  SUCURSALES_VIEW = 'sucursales:view',
  SUCURSALES_EDIT = 'sucursales:edit',
  MESAS_VIEW = 'mesas:view',
  MESAS_EDIT = 'mesas:edit',
  PLANOS_VIEW = 'planos:view',
  PLANOS_EDIT = 'planos:edit',

  // Usuarios
  USUARIOS_VIEW = 'usuarios:view',
  USUARIOS_EDIT = 'usuarios:edit',
  USUARIOS_DELETE = 'usuarios:delete',
  USUARIOS_ROLES = 'usuarios:roles',

  // Reportes
  REPORTES_VIEW = 'reportes:view',
  REPORTES_VENTAS = 'reportes:ventas',
  REPORTES_RESERVAS = 'reportes:reservas',
  REPORTES_CLIENTES = 'reportes:clientes',

  // Sistema
  CONFIGURACION_VIEW = 'configuracion:view',
  CONFIGURACION_EDIT = 'configuracion:edit',
  DESCUENTOS_VIEW = 'descuentos:view',
  DESCUENTOS_EDIT = 'descuentos:edit',
}

// ========================================
// MATRIZ DE PERMISOS POR ROL
// ========================================

/**
 * Define qué permisos tiene cada rol
 */
export const ROL_PERMISSIONS: Record<Rol, Permission[]> = {
  [Rol.ADMIN]: [
    // Acceso completo a todo
    Permission.EVENTOS_VIEW,
    Permission.EVENTOS_CREATE,
    Permission.EVENTOS_EDIT,
    Permission.EVENTOS_DELETE,
    Permission.EVENTOS_PUBLISH,
    Permission.TICKETS_VIEW,
    Permission.TICKETS_VIEW_ALL,
    Permission.TICKETS_SCAN,
    Permission.TICKETS_VALIDATE,
    Permission.ORDENES_VIEW,
    Permission.ORDENES_VIEW_ALL,
    Permission.ORDENES_REFUND,
    Permission.RESERVAS_VIEW,
    Permission.RESERVAS_VIEW_ALL,
    Permission.RESERVAS_CREATE,
    Permission.RESERVAS_EDIT,
    Permission.RESERVAS_CANCEL,
    Permission.RESERVAS_CHECKIN,
    Permission.SUCURSALES_VIEW,
    Permission.SUCURSALES_EDIT,
    Permission.MESAS_VIEW,
    Permission.MESAS_EDIT,
    Permission.PLANOS_VIEW,
    Permission.PLANOS_EDIT,
    Permission.USUARIOS_VIEW,
    Permission.USUARIOS_EDIT,
    Permission.USUARIOS_DELETE,
    Permission.USUARIOS_ROLES,
    Permission.REPORTES_VIEW,
    Permission.REPORTES_VENTAS,
    Permission.REPORTES_RESERVAS,
    Permission.REPORTES_CLIENTES,
    Permission.CONFIGURACION_VIEW,
    Permission.CONFIGURACION_EDIT,
    Permission.DESCUENTOS_VIEW,
    Permission.DESCUENTOS_EDIT,
  ],

  [Rol.HOST]: [
    // Operaciones del día
    Permission.EVENTOS_VIEW,
    Permission.TICKETS_VIEW_ALL,
    Permission.TICKETS_SCAN,
    Permission.TICKETS_VALIDATE,
    Permission.RESERVAS_VIEW_ALL,
    Permission.RESERVAS_CHECKIN,
    Permission.RESERVAS_CREATE,
    Permission.MESAS_VIEW,
    Permission.PLANOS_VIEW,
    Permission.ORDENES_VIEW,
  ],

  [Rol.CLIENTE]: [
    // Solo sus propios datos
    Permission.EVENTOS_VIEW,
    Permission.TICKETS_VIEW,
    Permission.ORDENES_VIEW,
    Permission.RESERVAS_VIEW,
    Permission.RESERVAS_CREATE,
    Permission.RESERVAS_EDIT,
    Permission.RESERVAS_CANCEL,
    Permission.SUCURSALES_VIEW,
  ],
}

// ========================================
// RUTAS POR ROL
// ========================================

/**
 * Define las rutas del dashboard según el rol
 */
export const ROL_ROUTES: Record<Rol, string> = {
  [Rol.ADMIN]: '/admin',
  [Rol.HOST]: '/host',
  [Rol.CLIENTE]: '/cliente',
}

/**
 * Rutas protegidas que requieren autenticación
 */
export const PROTECTED_ROUTES = ['/dashboard', '/checkout', '/mis-tickets', '/mis-reservas']

/**
 * Rutas públicas que no requieren autenticación
 */
export const PUBLIC_ROUTES = ['/', '/eventos', '/reservas', '/login', '/register', '/forgot-password', '/reset-password']

// ========================================
// LABELS Y METADATA
// ========================================

/**
 * Labels amigables para roles
 */
export const ROL_LABELS: Record<Rol, string> = {
  [Rol.ADMIN]: 'Administrador',
  [Rol.HOST]: 'Host / Recepción',
  [Rol.CLIENTE]: 'Cliente',
}

/**
 * Descripciones de roles
 */
export const ROL_DESCRIPTIONS: Record<Rol, string> = {
  [Rol.ADMIN]: 'Acceso completo al sistema, gestión de eventos, reservas, usuarios y configuración',
  [Rol.HOST]: 'Gestión operativa: check-in de reservas, escaneo de tickets, gestión de mesas',
  [Rol.CLIENTE]: 'Compra de tickets, creación de reservas y gestión de cuenta personal',
}

/**
 * Colores para badges de roles
 */
export const ROL_COLORS: Record<Rol, string> = {
  [Rol.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
  [Rol.HOST]: 'bg-blue-100 text-blue-800 border-blue-200',
  [Rol.CLIENTE]: 'bg-green-100 text-green-800 border-green-200',
}

// ========================================
// TYPES
// ========================================

/**
 * Usuario con rol
 */
export interface UserWithRole {
  uid: string
  email: string
  nombre: string
  rol: Rol
  telefono?: string
  createdAt: Date
}

/**
 * Contexto de permisos
 */
export interface PermissionContext {
  user: UserWithRole | null
  permissions: Permission[]
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  isRole: (role: Rol) => boolean
  isAnyRole: (roles: Rol[]) => boolean
}
