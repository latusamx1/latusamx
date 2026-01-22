/**
 * Sidebar con navegación específica por rol
 */

'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  MapPin,
  Settings,
  BarChart3,
  Scan,
  ChefHat,
  ShoppingBag,
  Home,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserRole } from '@/lib/hooks/usePermissions'
import { Rol } from '@/types/roles.types'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const userRole = useUserRole()

  // Navegación por rol
  const navItems = useMemo<NavItem[]>(() => {
    if (!userRole) return []

    // Admin: Acceso completo
    if (userRole === Rol.ADMIN) {
      return [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/eventos', label: 'Eventos', icon: Ticket },
        { href: '/admin/reservas', label: 'Reservas', icon: Calendar },
        { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingBag },
        { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
        { href: '/admin/sucursales', label: 'Sucursales', icon: MapPin },
        { href: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
        { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
      ]
    }

    // Host: Operaciones del día
    if (userRole === Rol.HOST) {
      return [
        { href: '/host', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/host/scanner', label: 'Scanner QR', icon: Scan },
        { href: '/host/reservas', label: 'Reservas', icon: Calendar },
        { href: '/host/checkin', label: 'Check-in', icon: Users },
        { href: '/host/mesas', label: 'Mesas', icon: Home },
        { href: '/host/eventos', label: 'Eventos Hoy', icon: Ticket },
      ]
    }

    // Cliente: Panel personal
    return [
      { href: '/cliente', label: 'Mi Dashboard', icon: LayoutDashboard },
      { href: '/cliente/tickets', label: 'Mis Tickets', icon: Ticket },
      { href: '/cliente/reservas', label: 'Mis Reservas', icon: Calendar },
      { href: '/cliente/ordenes', label: 'Mis Órdenes', icon: ShoppingBag },
      { href: '/eventos', label: 'Ver Eventos', icon: Ticket },
      { href: '/reservas', label: 'Reservar Mesa', icon: Calendar },
    ]
  }, [userRole])

  return (
    <aside
      className={cn(
        'flex h-full flex-col gap-2 border-r bg-white',
        'w-64 shrink-0',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-xl">
          BT
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-none">
            <span className="text-gray-900">Big </span>
            <span className="text-red-600">Texas</span>
          </span>
          <span className="text-xs text-gray-500">BBQ Josué</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-red-50 text-red-900 hover:bg-red-100'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn('h-5 w-5 shrink-0', isActive ? 'text-red-600' : 'text-gray-500')}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-900">¿Necesitas ayuda?</p>
          <p className="text-xs text-gray-600 mt-1">
            Contacta a soporte para asistencia
          </p>
        </div>
      </div>
    </aside>
  )
}
