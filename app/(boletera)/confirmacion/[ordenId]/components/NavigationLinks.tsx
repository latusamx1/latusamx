'use client'

import Link from 'next/link'
import { Home, LayoutDashboard } from 'lucide-react'

export function NavigationLinks() {
  return (
    <div className="space-y-4 text-center">
      <div>
        <Link
          href="/cliente/tickets"
          className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Ver mis Pedidos
        </Link>
      </div>
      <div>
        <Link href="/eventos" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <Home className="mr-2 h-4 w-4" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
