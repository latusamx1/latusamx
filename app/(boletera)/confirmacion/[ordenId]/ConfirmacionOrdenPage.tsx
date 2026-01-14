'use client'

import { useEffect } from 'react'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { PublicFooter } from '@/components/landing/PublicFooter'

// Componentes
import { LoadingState } from './components/LoadingState'
import { EmptyState } from './components/EmptyState'
import { SuccessHeader } from './components/SuccessHeader'
import { OrderSummary } from './components/OrderSummary'
import { TicketsList } from './components/TicketsList'
import { PaymentSummary } from './components/PaymentSummary'
import { ImportantInfo } from './components/ImportantInfo'
import { ActionButtons } from './components/ActionButtons'
import { NavigationLinks } from './components/NavigationLinks'
import { SupportSection } from './components/SupportSection'

// Hook personalizado
import { useConfirmacionData } from './hooks/useConfirmacionData'

// Utilidades
import { crearConfetti, confettiStyles } from './utils/confetti'

interface ConfirmacionOrdenPageProps {
  ordenId: string
}

export default function ConfirmacionOrdenPage({ ordenId }: ConfirmacionOrdenPageProps) {
  const { loading, orden, tickets, evento } = useConfirmacionData(ordenId)

  useEffect(() => {
    // Efecto de confetti al cargar exitosamente
    if (!loading && orden && evento) {
      crearConfetti()
    }
  }, [loading, orden, evento])

  // Estado de carga
  if (loading) {
    return <LoadingState />
  }

  // Estado vacío
  if (!orden || !evento) {
    return <EmptyState />
  }

  return (
    <>
      {/* Estilos de confetti */}
      <style jsx global>{confettiStyles}</style>

      <div className="min-h-screen bg-gray-50">
        <PublicHeader />

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header de éxito */}
          <SuccessHeader />

          {/* Tarjeta de orden */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <OrderSummary orden={orden} />
            <TicketsList tickets={tickets} evento={evento} />
          </div>

          {/* Resumen de pago */}
          <PaymentSummary orden={orden} tickets={tickets} />

          {/* Información importante */}
          <ImportantInfo orden={orden} />

          {/* Botones de acción */}
          <ActionButtons ordenId={ordenId} evento={evento} />

          {/* Enlaces de navegación */}
          <NavigationLinks />

          {/* Sección de soporte */}
          <SupportSection />
        </div>

        <PublicFooter />
      </div>
    </>
  )
}
