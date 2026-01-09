'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { getInitials } from '@/lib/utils/userHelpers'
import NotificationBell from './NotificationBell'

export default function HostHeader() {
  const { userProfile } = useAuthStore()

  const userName = userProfile?.nombre || 'Usuario'
  const initials = getInitials(userName)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              {/* Menu icon placeholder - could add mobile menu */}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EventPro</h1>
              <p className="text-sm text-gray-500">Sucursal Centro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell count={3} />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
