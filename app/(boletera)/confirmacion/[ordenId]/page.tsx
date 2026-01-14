import { Metadata } from 'next'
import ConfirmacionOrdenPage from './ConfirmacionOrdenPage'

export const metadata: Metadata = {
  title: 'Compra Confirmada | Big Texas BBQ',
  description: 'Tu compra ha sido procesada exitosamente',
}

interface PageProps {
  params: Promise<{
    ordenId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { ordenId } = await params
  return <ConfirmacionOrdenPage ordenId={ordenId} />
}
