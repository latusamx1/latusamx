'use client'

import { useCartStore } from '@/lib/stores/cartStore'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import CartBreadcrumb from './components/CartBreadcrumb'
import CartItem from './components/CartItem'
import CartSummary from './components/CartSummary'
import EmptyCart from './components/EmptyCart'
import CartActionsModal from './components/CartActionsModal'
import { useCartModal } from './hooks/useCartModal'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { PublicFooter } from '@/components/landing/PublicFooter'

export default function CarritoCliente() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDescuento,
    getTotalItems,
    descuentoAplicado,
    aplicarDescuento,
    removerDescuento
  } = useCartStore()

  const { isOpen, action, itemName, openModal, closeModal, setConfirmCallback, confirmCallback } = useCartModal()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  const handleApplyDiscount = (codigo: string, tipo: 'porcentaje' | 'monto', valor: number) => {
    aplicarDescuento(codigo, tipo, valor)
    const mensaje = tipo === 'monto'
      ? `Código aplicado: $${valor} de descuento`
      : `Código aplicado: ${valor}% de descuento`
    toast.success(mensaje)
  }

  const handleRemoveDiscount = () => {
    removerDescuento()
    toast.success('Descuento removido')
  }

  const handleRemoveItem = (eventoId: string, tipoTicketId: string, itemName: string) => {
    setConfirmCallback(() => {
      removeItem(eventoId, tipoTicketId)
      toast.info('Ticket eliminado del carrito')
    })
    openModal('remove', itemName)
  }

  // Si el carrito está vacío
  if (items.length === 0) {
    return <EmptyCart />
  }

  // Cálculos
  const subtotal = getSubtotal()
  const cargoPorServicio = subtotal * 0.1 // 10% cargo por servicio
  const descuento = getDescuento()
  const total = subtotal + cargoPorServicio - descuento
  const totalItems = getTotalItems()

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader/>
      <CartBreadcrumb />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={`${item.eventoId}-${item.tipoTicketId}`}
                item={item}
                onUpdateQuantity={(cantidad) => {
                  updateQuantity(item.eventoId, item.tipoTicketId, cantidad)
                  // if (cantidad > 0) {
                  //   openModal('update', item.eventoTitulo)
                  // }
                }}
                onRemove={(itemName) => handleRemoveItem(item.eventoId, item.tipoTicketId, itemName)}
                formatPrice={formatPrice}
              />
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link href="/eventos" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              totalItems={totalItems}
              subtotal={subtotal}
              cargoPorServicio={cargoPorServicio}
              descuento={descuento}
              total={total}
              descuentoAplicado={descuentoAplicado}
              formatPrice={formatPrice}
              onApplyDiscount={handleApplyDiscount}
              onRemoveDiscount={handleRemoveDiscount}
            />
          </div>
        </div>
      </div>

      <PublicFooter/>

      {/* Cart Actions Modal */}
      <CartActionsModal
        isOpen={isOpen}
        onClose={closeModal}
        action={action}
        itemName={itemName}
        onConfirm={confirmCallback || undefined}
      />
    </div>
  )
}
