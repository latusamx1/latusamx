/**
 * Hero section para landing page
 */

'use client'

import Link from 'next/link'
import { Ticket, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Gestiona Eventos y Reservas en un Solo Lugar
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Sistema completo para la venta de tickets y gestión de reservas de restaurantes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/eventos">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 shadow-lg w-full sm:w-auto">
                <Ticket className="w-5 h-5 mr-2" />
                Ver Eventos
              </Button>
            </a>
            <a href="#reservas">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur text-white hover:bg-white/20 border-white/30 h-14 px-8 w-full sm:w-auto"
              >
                <CalendarCheck className="w-5 h-5 mr-2" />
                Hacer Reserva
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>
  )
}
