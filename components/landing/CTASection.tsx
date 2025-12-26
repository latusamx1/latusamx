/**
 * Call to Action section
 */

'use client'

import Link from 'next/link'
import { Ticket, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
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
  )
}
