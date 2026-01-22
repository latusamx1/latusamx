/**
 * Sección de características - Eventos y Reservas
 */

'use client'

import { Ticket, Utensils, CreditCard, QrCode, BarChart, Users, CalendarCheck, Layout, Clock, UserCheck } from 'lucide-react'
import { FeatureCard } from './FeatureCard'

export function FeaturesSection() {
  const eventosFeatures = [
    {
      icon: CreditCard,
      title: 'Venta de Tickets',
      description: 'Sistema completo de venta de boletos con múltiples tipos y precios',
      color: 'blue' as const,
    },
    {
      icon: QrCode,
      title: 'Códigos QR',
      description: 'Generación automática de códigos QR para validación rápida',
      color: 'purple' as const,
    },
    {
      icon: BarChart,
      title: 'Reportes',
      description: 'Análisis detallado de ventas, asistencia y rendimiento',
      color: 'green' as const,
    },
    {
      icon: Users,
      title: 'Multi-evento',
      description: 'Gestiona múltiples eventos simultáneamente sin problemas',
      color: 'amber' as const,
    },
  ]

  const reservasFeatures = [
    {
      icon: CalendarCheck,
      title: 'Gestión de Mesas',
      description: 'Control completo de disponibilidad y asignación de mesas',
      color: 'purple' as const,
    },
    {
      icon: Layout,
      title: 'Planos Interactivos',
      description: 'Diseña y visualiza el layout de tu restaurante en tiempo real',
      color: 'blue' as const,
    },
    {
      icon: Clock,
      title: 'Horarios',
      description: 'Configuración flexible de horarios y turnos de reserva',
      color: 'green' as const,
    },
    {
      icon: UserCheck,
      title: 'Check-in Digital',
      description: 'Recepción moderna con códigos QR y lista de espera',
      color: 'pink' as const,
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-xl text-gray-600">Funcionalidades completas para eventos y reservas</p>
        </div>

        {/* Eventos Features */}
        <div id="eventos" className="mb-12 sm:mb-16 md:mb-20">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            <Ticket className="w-6 h-6 sm:w-8 sm:h-8 inline-block mr-2 text-blue-600" />
            Módulo de Boletera
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {eventosFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Reservas Features */}
        <div id="reservas">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            <Utensils className="w-6 h-6 sm:w-8 sm:h-8 inline-block mr-2 text-purple-600" />
            Módulo de Reservas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {reservasFeatures.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
