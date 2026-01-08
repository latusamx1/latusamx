import { Metadata } from 'next'
import ConfirmacionCliente from './ConfirmacionCliente'

export const metadata: Metadata = {
  title: 'Compra Confirmada - Big Texas BBQ',
  description: 'Tu compra ha sido procesada exitosamente',
}

export default function ConfirmacionPage() {
  return <ConfirmacionCliente />
}
