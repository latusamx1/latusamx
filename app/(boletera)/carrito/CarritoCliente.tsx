'use client'

import { useCartStore } from '@/lib/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  Lock,
  RotateCcw
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function CarritoCliente() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getSubtotal, getDescuento, getTotal, getTotalItems, descuentoAplicado, aplicarDescuento, removerDescuento } = useCartStore()
  const [codigoInput, setCodigoInput] = useState('')
  const [validandoCodigo, setValidandoCodigo] = useState(false)

  const handleValidarCodigo = async () => {
    if (!codigoInput.trim()) {
      toast.error('Por favor ingresa un código')
      return
    }

    setValidandoCodigo(true)

    // Simulación de validación (aquí deberías llamar a tu servicio real)
    setTimeout(() => {
      // Códigos de prueba
      const codigosValidos: Record<string, { tipo: 'porcentaje' | 'monto', valor: number }> = {
        'PROMO10': { tipo: 'monto', valor: 50 },
        'BIENVENIDO10': { tipo: 'porcentaje', valor: 10 },
        'VIP20': { tipo: 'porcentaje', valor: 20 },
      }

      const codigo = codigoInput.toUpperCase()
      const descuento = codigosValidos[codigo]

      if (descuento) {
        aplicarDescuento(codigo, descuento.tipo, descuento.valor)
        const mensaje = descuento.tipo === 'monto'
          ? `Código aplicado: $${descuento.valor} de descuento`
          : `Código aplicado: ${descuento.valor}% de descuento`
        toast.success(mensaje)
        setCodigoInput('')
      } else {
        toast.error('Código inválido')
      }

      setValidandoCodigo(false)
    }, 800)
  }

  const handleRemoverDescuento = () => {
    removerDescuento()
    toast.success('Descuento removido')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const subtotal = getSubtotal()
  const cargoPorServicio = subtotal * 0.1 // 10% cargo por servicio
  const descuento = getDescuento()
  const total = subtotal + cargoPorServicio - descuento
  const totalItems = getTotalItems()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">BT</span>
                </div>
                <span className="ml-3 font-bold text-gray-900">Big Texas BBQ</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Empty Cart */}
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BT</span>
              </div>
              <span className="ml-3 font-bold text-gray-900">Big Texas BBQ</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.eventoId}-${item.tipoTicketId}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Event Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex-shrink-0 overflow-hidden">
                      {item.eventoImagen ? (
                        <Image
                          src={item.eventoImagen}
                          alt={item.eventoTitulo}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : null}
                    </div>

                    {/* Ticket Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.eventoTitulo}</h3>
                      <p className="text-sm text-gray-600 mb-1">{item.tipoTicketNombre}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {item.eventoFecha && format(new Date(item.eventoFecha.seconds * 1000), "d MMMM, yyyy", { locale: es })}
                        </span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>
                          {item.eventoFecha && format(new Date(item.eventoFecha.seconds * 1000), "h:mm a", { locale: es })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.eventoId, item.tipoTicketId, item.cantidad - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1.5 border-x border-gray-300 font-medium">
                            {item.cantidad}
                          </span>
                          <button
                            className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.eventoId, item.tipoTicketId, item.cantidad + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.precio)} x {item.cantidad}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.precio * item.cantidad)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
                          removeItem(item.eventoId, item.tipoTicketId)
                          toast.info('Ticket eliminado del carrito')
                        }
                      }}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link href="/eventos" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h3>

              {/* Summary Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({totalItems} {totalItems === 1 ? 'ticket' : 'tickets'})
                  </span>
                  <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cargo por servicio</span>
                  <span className="font-medium text-gray-900">{formatPrice(cargoPorServicio)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex items-center justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span>-{formatPrice(descuento)}</span>
                  </div>
                )}
              </div>

              {/* Discount Code */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Descuento
                </label>
                {descuentoAplicado ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mb-2">
                    <span className="text-sm font-medium text-green-600">
                      {descuentoAplicado.codigo} aplicado
                    </span>
                    <button
                      onClick={handleRemoverDescuento}
                      className="text-xs text-green-600 hover:text-green-700 underline"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Ingresa código"
                      value={codigoInput}
                      onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleValidarCodigo()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleValidarCodigo}
                      disabled={validandoCodigo}
                      className="px-4"
                    >
                      {validandoCodigo ? 'Validando...' : 'Aplicar'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full h-12 mb-4"
                onClick={() => router.push('/checkout')}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Continuar al Pago
              </Button>

              {/* Security Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Encriptación SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-purple-600" />
                    <span>Reembolso garantizado</span>
                  </div>
                </div>
              </div>

              {/* Accepted Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">Aceptamos</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">VISA</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">MC</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">AMEX</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">PP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Big Texas BBQ. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
