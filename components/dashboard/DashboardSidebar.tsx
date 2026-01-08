'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import Avatar from './Avatar'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigationSections = [
  {
    title: 'Principal',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admin' },
    ],
  },
  {
    title: 'Eventos',
    items: [
      { icon: Ticket, label: 'Mis Eventos', href: '/eventos' },
      { icon: PlusCircle, label: 'Crear Evento', href: '/eventos/crear' },
      { icon: MapPin, label: 'Venues', href: '/venues' },
      { icon: Percent, label: 'Códigos', href: '/codigos' },
    ],
  },
  {
    title: 'Reservas',
    items: [
      { icon: CalendarCheck, label: 'Reservas', href: '/reservas' },
      { icon: LayoutIcon, label: 'Planos', href: '/planos' },
      { icon: Building, label: 'Sucursales', href: '/sucursales' },
    ],
  },
]

export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SG</span>
          </div>
          <span className="ml-3 font-bold text-gray-900">Sistema de Gestión</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-8rem)]">
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
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
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
            <Avatar initials="JD" color="blue" size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Juan Pérez</p>
              <p className="text-xs text-gray-500 truncate">Admin</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
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
