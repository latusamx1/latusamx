'use client'

import Link from 'next/link'
import { ArrowLeft, Check, Rocket } from 'lucide-react'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  type?: 'login' | 'register'
}

export function AuthLayout({ children, title, subtitle, type = 'login' }: AuthLayoutProps) {
  const isLogin = type === 'login'

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form (Login) or Branding (Register) */}
      {isLogin ? (
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center justify-center">
                <div className="w-fit h-fit p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">LATUSAMX</span>
                </div>
              </Link>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{title}</h1>
              <p className="mt-2 text-gray-600">{subtitle}</p>
            </div>

            {children}

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Branding Side for Register */
        <div className="hidden lg:block lg:flex-1 bg-linear-to-br from-purple-600 via-pink-500 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur">
                <Rocket className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Comienza tu viaje hoy</h2>
              <p className="text-xl text-white/90 mb-8">
                Únete a miles de organizadores que confían en nuestro sistema
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">10K+</div>
                  <div className="text-white/80 text-sm">Usuarios activos</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">500K+</div>
                  <div className="text-white/80 text-sm">Tickets vendidos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Right Side - Branding (Login) or Form (Register) */}
      {isLogin ? (
        <div className="hidden lg:block lg:flex-1 bg-linear-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold mb-6">
                Gestiona tus eventos de manera profesional
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Sistema completo para venta de tickets y gestión de reservas
              </p>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Venta de tickets online</h4>
                    <p className="text-white/80 text-sm">
                      Acepta pagos y genera tickets automáticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Gestión de reservas</h4>
                    <p className="text-white/80 text-sm">Control total de mesas y horarios</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Reportes en tiempo real</h4>
                    <p className="text-white/80 text-sm">Analítica completa de tus eventos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
      ) : (
        /* Form Side for Register */
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center justify-center">
                <div className="w-fit h-fit p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">LATUSAMX</span>
                </div>
              </Link>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{title}</h1>
              <p className="mt-2 text-gray-600">{subtitle}</p>
            </div>

            {children}

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
