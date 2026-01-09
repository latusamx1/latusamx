'use client'

import { Calendar } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authStore'
import { getInitials } from '@/lib/utils/userHelpers'
import NotificationBell from './NotificationBell'

export default function ClienteHeader() {
  const { userProfile } = useAuthStore()

  const userName = userProfile?.nombre || 'Usuario'
  const userEmail = userProfile?.email || ''
  const initials = getInitials(userName)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EventPro</h1>
              <p className="text-sm text-gray-500">Mi Cuenta</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell count={3} />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
