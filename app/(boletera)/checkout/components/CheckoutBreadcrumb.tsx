import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function CheckoutBreadcrumb() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center text-sm">
          <Link href="/eventos" className="text-gray-500 hover:text-gray-700">
            Evento
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <Link href="/carrito" className="text-gray-500 hover:text-gray-700">
            Carrito
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>
      </div>
    </div>
  )
}
