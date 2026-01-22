'use client'

import { Search, Plus, Menu } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authStore'
import { getInitials } from '@/lib/utils/userHelpers'
import NotificationBell from './NotificationBell'
import Avatar from './Avatar'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  showCreateButton?: boolean
  onMenuClick?: () => void
}

export default function DashboardHeader({
  title,
  subtitle,
  showSearch = false,
  showCreateButton = false,
  onMenuClick,
}: DashboardHeaderProps) {
  const { userProfile } = useAuthStore()

  const userName = userProfile?.nombre || 'Usuario'
  const initials = getInitials(userName)

  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 lg:px-8">
      {/* Mobile Menu Button */}
      {onMenuClick && (
        <button className="lg:hidden p-1.5 sm:p-2" onClick={onMenuClick}>
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Search */}
      {showSearch && (
        <div className="hidden md:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar eventos, reservas..."
              className="w-full h-9 sm:h-10 pl-8 sm:pl-10 pr-3 sm:pr-4 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Title for Mobile (when no search) */}
      {!showSearch && (
        <div className="flex-1">
          <h1 className="text-base sm:text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <NotificationBell count={3} />

        {showCreateButton && (
          <button className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4">
            <Plus className="w-4 h-4 mr-2" />
            Crear Evento
          </button>
        )}

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Avatar initials={initials} color="blue" size="sm" />
          <span className="hidden md:block text-sm font-medium text-gray-900">
            {userName}
          </span>
        </div>
      </div>
    </header>
  )
}
