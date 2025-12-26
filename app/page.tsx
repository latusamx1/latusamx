/**
 * Landing Page Principal
 */

import Link from 'next/link'
import { Ticket, Calendar, Users, Shield, Smartphone, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LATUSAMX | Sistema de Eventos y Reservas',
  description:
    'Sistema completo para gestión de eventos, venta de tickets y reservas de mesa. La mejor experiencia monterrey, méxico.',
  keywords: [
    'eventos',
    'tickets',
    'reservas',
    'restaurante',
    'monterrey',
    'mexico',
  ],
}

export default function Home() {
  const features = [
    {
      icon: Ticket,
      title: 'Venta de Tickets',
      description: 'Compra tickets para eventos especiales de forma rápida y segura con confirmación instantánea.',
    },
    {
      icon: Calendar,
      title: 'Reservas de Mesa',
      description: 'Reserva tu mesa en línea, elige horario y área preferida para una experiencia personalizada.',
    },
    {
      icon: Users,
      title: 'Gestión Completa',
      description: 'Panel administrativo robusto para gestionar eventos, reservas y operaciones del día.',
    },
    {
      icon: Shield,
      title: 'Sistema Seguro',
      description: 'Autenticación segura con roles y permisos. Tus datos están protegidos.',
    },
    {
      icon: Smartphone,
      title: 'Scanner QR',
      description: 'Validación de tickets y reservas mediante códigos QR desde cualquier dispositivo.',
    },
    {
      icon: Zap,
      title: 'Tiempo Real',
      description: 'Actualizaciones instantáneas de disponibilidad y confirmaciones automáticas.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="inline-flex items-center gap-3 mb-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <div className="flex w-fit h-fit p-2 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-700 text-white font-bold text-xl">
                LATUSAMX
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Sistema de Eventos y Reservas
              <br />
              <span className="text-yellow-300">LATUSAMX</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Compra tickets para eventos especiales, reserva tu mesa y disfruta de la mejor experiencia monterrey, méxico
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/eventos">
                <Button
                  size="lg"
                  className="w-56 h-14 text-lg bg-white text-red-600 hover:bg-white/90 shadow-lg"
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  Ver Eventos
                </Button>
              </Link>
              <Link href="/reservas">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-56 h-14 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar Mesa
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300">500+</div>
                <div className="text-sm md:text-base text-white/80">Eventos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300">10K+</div>
                <div className="text-sm md:text-base text-white/80">Clientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300">24/7</div>
                <div className="text-sm md:text-base text-white/80">Atención al Cliente</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 text-base px-4 py-1">Características</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sistema completo para la gestión de eventos, venta de tickets y reservas de mesas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="rounded-full bg-red-100 w-12 h-12 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - For Users */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-linear-to-r from-red-600 to-red-700 text-white border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <CardContent className="p-8 md:p-12 relative">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para comenzar?</h2>
                  <p className="text-xl text-white/90 mb-8">
                    Únete a miles de clientes que ya disfrutan de nuestros eventos y el mejor BBQ de Venezuela
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/register">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-white text-red-600 hover:bg-white/90 shadow-lg"
                      >
                        Crear Cuenta Gratis
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10"
                      >
                        Iniciar Sesión
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - For Business */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Administras eventos o restaurantes?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nuestro sistema es perfecto para gestionar tu negocio de forma eficiente
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">Panel Admin</div>
                  <p className="text-gray-600">Gestión completa de eventos y reservas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">Reportes</div>
                  <p className="text-gray-600">Análisis de ventas y ocupación</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">Control QR</div>
                  <p className="text-gray-600">Validación instantánea de tickets</p>
                </CardContent>
              </Card>
            </div>
            <Link href="/contacto">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Contactar a Ventas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
