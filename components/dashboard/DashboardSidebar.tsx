'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  MapPin,
  Percent,
  CalendarCheck,
  Layout as LayoutIcon,
  Building,
  Settings,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { logout } from '@/lib/firebase/auth'
import { useAuthStore } from '@/lib/stores/authStore'
import { getInitials } from '@/lib/utils/userHelpers'
import Avatar from './Avatar'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { userProfile, reset } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const userName = userProfile?.nombre || 'Usuario'
  const userRole = userProfile?.rol || 'cliente'
  const initials = getInitials(userName)

  // Secciones de navegación según el rol
  const navigationSections = userRole === 'admin'
    ? [
        {
          title: 'Principal',
          items: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
          ],
        },
        {
          title: 'Eventos',
          items: [
            { icon: Ticket, label: 'Eventos', href: '/admin/eventos' },
            { icon: PlusCircle, label: 'Crear Evento', href: '/admin/eventos/crear' },
            { icon: MapPin, label: 'Venues', href: '/admin/venues' },
            { icon: Percent, label: 'Códigos', href: '/admin/codigos' },
          ],
        },
        {
          title: 'Reservas',
          items: [
            { icon: CalendarCheck, label: 'Reservas', href: '/admin/reservas' },
            { icon: LayoutIcon, label: 'Planos', href: '/admin/planos' },
            { icon: Building, label: 'Sucursales', href: '/admin/sucursales' },
          ],
        },
      ]
    : [ // Host
        {
          title: 'Principal',
          items: [
            { icon: LayoutDashboard, label: 'Dashboard', href: '/host' },
          ],
        },
        {
          title: 'Operaciones',
          items: [
            { icon: Ticket, label: 'Validar Tickets', href: '/host/scanner' },
            { icon: CalendarCheck, label: 'Check-in', href: '/host/checkin' },
            { icon: LayoutIcon, label: 'Plano Mesas', href: '/host/plano' },
          ],
        },
        {
          title: 'Gestión',
          items: [
            { icon: Building, label: 'Lista de Espera', href: '/host/lista-espera' },
            { icon: PlusCircle, label: 'Buscar', href: '/host/buscar' },
          ],
        },
      ]

  // Mapeo de roles a español
  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    host: 'Host',
    cliente: 'Cliente',
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      await logout()
      reset() // Limpiar estado de Zustand
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      alert('Error al cerrar sesión. Por favor intenta de nuevo.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="h-14 sm:h-16 flex items-center px-4 sm:px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center">
            <div className="w-fit h-fit p-1.5 sm:p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">LATUSAMX</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)]">
          {navigationSections.map((section) => (
            <div key={section.title} className="pt-4 first:pt-0">
              {section.title !== 'Principal' && (
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}

          {/* Settings */}
          <div className="pt-4">
            <Link
              href="/configuracion"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar initials={initials} color="blue" size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{roleLabels[userRole]}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}
