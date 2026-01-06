import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { PublicFooter } from '@/components/landing/PublicFooter'

export default function EmptyCart() {
  return (
    <div className="min-h-screen relative bg-gray-50">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-600 mb-6">Agrega tickets para continuar con tu compra</p>
          <Button asChild>
            <Link href="/eventos">
              Ver Eventos
            </Link>
          </Button>
        </div>
      </div>

      <div className='md:absolute w-full bottom-0'>
        <PublicFooter />
      </div>
    </div>
  )
}
