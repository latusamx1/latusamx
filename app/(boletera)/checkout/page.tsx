import { Metadata } from 'next'
import CheckoutCliente from './CheckoutCliente'

export const metadata: Metadata = {
  title: 'Checkout - Big Texas BBQ',
  description: 'Completa tu compra de tickets',
}

export default function CheckoutPage() {
  return <CheckoutCliente />
}
