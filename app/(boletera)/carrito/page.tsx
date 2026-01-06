import { Metadata } from 'next'
import CarritoCliente from './CarritoCliente'

export const metadata: Metadata = {
  title: 'Carrito de Compras | Big Texas BBQ',
  description: 'Revisa y completa tu compra de tickets',
}

export default function CarritoPage() {
  return <CarritoCliente />
}
