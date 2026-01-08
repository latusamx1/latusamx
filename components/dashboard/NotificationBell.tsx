'use client'

import { Bell } from 'lucide-react'
import { useState } from 'react'

interface NotificationBellProps {
  count?: number
}

export default function NotificationBell({ count = 0 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {count > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Dropdown de notificaciones - por implementar */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          </div>
          <div className="p-4 text-center text-sm text-gray-500">
            No hay notificaciones nuevas
          </div>
        </div>
      )}
    </div>
  )
}
