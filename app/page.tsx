/**
 * Landing Page Principal - Diseño basado en designs/screens/index.html
 */

'use client'

import Link from 'next/link'
import {
  Ticket,
  CalendarCheck,
  CreditCard,
  QrCode,
  BarChart,
  Users,
  Utensils,
  Layout,
  Clock,
  UserCheck,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const eventosFeatures = [
    {
      icon: CreditCard,
      title: 'Venta de Tickets',
      description: 'Sistema completo de venta de boletos con múltiples tipos y precios',
      color: 'blue',
    },
    {
      icon: QrCode,
      title: 'Códigos QR',
      description: 'Generación automática de códigos QR para validación rápida',
      color: 'purple',
    },
    {
      icon: BarChart,
      title: 'Reportes',
      description: 'Análisis detallado de ventas, asistencia y rendimiento',
      color: 'green',
    },
    {
      icon: Users,
      title: 'Multi-evento',
      description: 'Gestiona múltiples eventos simultáneamente sin problemas',
      color: 'amber',
    },
  ]

  const reservasFeatures = [
    {
      icon: CalendarCheck,
      title: 'Gestión de Mesas',
      description: 'Control completo de disponibilidad y asignación de mesas',
      color: 'purple',
    },
    {
      icon: Layout,
      title: 'Planos Interactivos',
      description: 'Diseña y visualiza el layout de tu restaurante en tiempo real',
      color: 'blue',
    },
    {
      icon: Clock,
      title: 'Horarios',
      description: 'Configuración flexible de horarios y turnos de reserva',
      color: 'green',
    },
    {
      icon: UserCheck,
      title: 'Check-in Digital',
      description: 'Recepción moderna con códigos QR y lista de espera',
      color: 'pink',
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SG</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Sistema de Gestión</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#eventos" className="text-gray-600 hover:text-gray-900 transition-colors">
                Eventos
              </a>
              <a href="#reservas" className="text-gray-600 hover:text-gray-900 transition-colors">
                Reservas
              </a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Características
              </a>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/register">
                <Button>Comenzar</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <a href="#eventos" className="block text-gray-600 hover:text-gray-900">
                Eventos
              </a>
              <a href="#reservas" className="block text-gray-600 hover:text-gray-900">
                Reservas
              </a>
              <a href="#features" className="block text-gray-600 hover:text-gray-900">
                Características
              </a>
              <Link href="/login" className="block text-gray-600 hover:text-gray-900">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="block">
                <Button className="w-full">Comenzar</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
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
              <a href="#eventos">
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-gray-600">Funcionalidades completas para eventos y reservas</p>
          </div>

          {/* Eventos Features */}
          <div id="eventos" className="mb-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              <Ticket className="w-8 h-8 inline-block mr-2 text-blue-600" />
              Módulo de Boletera
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {eventosFeatures.map((feature, index) => {
                const Icon = feature.icon
                const colors = getColorClasses(feature.color)
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reservas Features */}
          <div id="reservas">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              <Utensils className="w-8 h-8 inline-block mr-2 text-purple-600" />
              Módulo de Reservas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reservasFeatures.map((feature, index) => {
                const Icon = feature.icon
                const colors = getColorClasses(feature.color)
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a cientos de organizadores que ya confían en nuestro sistema
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#eventos">
              <Button size="lg" className="h-14 px-8 w-full sm:w-auto">
                <Ticket className="w-5 h-5 mr-2" />
                Comenzar con Eventos
              </Button>
            </a>
            <a href="#reservas">
              <Button size="lg" variant="secondary" className="bg-purple-600 text-white hover:bg-purple-700 h-14 px-8 w-full sm:w-auto">
                <Utensils className="w-5 h-5 mr-2" />
                Comenzar con Reservas
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-white/80">Eventos Creados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-white/80">Tickets Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Reservas Activas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-white/80">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SG</span>
                </div>
                <span className="ml-3 text-lg font-bold">Sistema de Gestión</span>
              </div>
              <p className="text-gray-400 text-sm">La solución completa para eventos y reservas</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#eventos" className="hover:text-white">
                    Eventos
                  </a>
                </li>
                <li>
                  <a href="#reservas" className="hover:text-white">
                    Reservas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Soporte
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Sistema de Gestión. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
