/**
 * Zustand store para carrito de compras de eventos
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  eventoId: string
  eventoTitulo: string
  eventoImagen?: string
  eventoFecha: any
  tipoTicketId: string
  tipoTicketNombre: string
  precio: number
  cantidad: number
}

interface CartStore {
  items: CartItem[]
  codigoDescuento: string | null
  descuentoAplicado: {
    codigo: string
    tipo: 'porcentaje' | 'monto'
    valor: number
  } | null
  // Actions
  addItem: (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => void
  removeItem: (eventoId: string, tipoTicketId: string) => void
  updateQuantity: (eventoId: string, tipoTicketId: string, cantidad: number) => void
  clearCart: () => void
  aplicarDescuento: (codigo: string, tipo: 'porcentaje' | 'monto', valor: number) => void
  removerDescuento: () => void
  // Computed
  getTotalItems: () => number
  getSubtotal: () => number
  getDescuento: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      codigoDescuento: null,
      descuentoAplicado: null,

      addItem: (item) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          (i) => i.eventoId === item.eventoId && i.tipoTicketId === item.tipoTicketId
        )

        if (existingItemIndex >= 0) {
          // Actualizar cantidad si ya existe
          const newItems = [...items]
          newItems[existingItemIndex].cantidad += item.cantidad || 1
          set({ items: newItems })
        } else {
          // Agregar nuevo item
          set({ items: [...items, { ...item, cantidad: item.cantidad || 1 }] })
        }
      },

      removeItem: (eventoId, tipoTicketId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.eventoId === eventoId && item.tipoTicketId === tipoTicketId)
          ),
        }))
      },

      updateQuantity: (eventoId, tipoTicketId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(eventoId, tipoTicketId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.eventoId === eventoId && item.tipoTicketId === tipoTicketId
              ? { ...item, cantidad }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], codigoDescuento: null, descuentoAplicado: null })
      },

      aplicarDescuento: (codigo, tipo, valor) => {
        set({
          codigoDescuento: codigo,
          descuentoAplicado: { codigo, tipo, valor },
        })
      },

      removerDescuento: () => {
        set({ codigoDescuento: null, descuentoAplicado: null })
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.cantidad, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
      },

      getDescuento: () => {
        const { descuentoAplicado } = get()
        if (!descuentoAplicado) return 0

        const subtotal = get().getSubtotal()
        if (descuentoAplicado.tipo === 'porcentaje') {
          return (subtotal * descuentoAplicado.valor) / 100
        }
        return descuentoAplicado.valor
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const descuento = get().getDescuento()
        return Math.max(0, subtotal - descuento)
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
)
