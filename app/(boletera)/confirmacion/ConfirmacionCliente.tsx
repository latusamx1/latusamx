'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { PublicFooter } from '@/components/landing/PublicFooter'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Download, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmacionCliente() {
  const router = useRouter()

  // Aquí podrías obtener los detalles de la orden desde la URL o estado global
  // Por ahora, mostramos un mensaje genérico de confirmación

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Compra Confirmada!</h1>
          <p className="text-lg text-gray-600">
            Tu pedido ha sido procesado exitosamente
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="space-y-6">
            {/* Email Confirmation */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Revisa tu correo</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Hemos enviado la confirmación de tu compra y tus tickets a tu correo electrónico.
                  Si no lo encuentras, revisa tu carpeta de spam.
                </p>
              </div>
            </div>

            {/* QR Codes */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Descarga tus tickets</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Cada ticket incluye un código QR único. Puedes presentarlos desde tu dispositivo móvil
                  o imprimirlos.
                </p>
              </div>
            </div>

            {/* Event Day */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Día del evento</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Presenta tu código QR en la entrada del evento. Te recomendamos llegar con anticipación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Información importante:</h3>
          <ul className="space-y-1 text-sm text-yellow-800">
            <li>• Guarda bien tus tickets, los necesitarás para ingresar al evento</li>
            <li>• No compartas tus códigos QR, son únicos e intransferibles</li>
            <li>• Si tienes alguna duda, contáctanos a soporte@bigtexasbbq.com</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/eventos">
              Ver más eventos
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/mis-tickets">
              Ver mis tickets
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <a href="mailto:soporte@bigtexasbbq.com" className="text-blue-600 hover:underline font-medium">
              Contáctanos
            </a>
          </p>
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
