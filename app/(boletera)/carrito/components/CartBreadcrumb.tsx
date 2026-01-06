import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function CartBreadcrumb() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/eventos" className="text-gray-600 hover:text-gray-900">
            Evento
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-medium">Carrito</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Checkout</span>
        </nav>
      </div>
    </div>
  )
}
