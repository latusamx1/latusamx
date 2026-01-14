'use client'

import { Mail, Phone } from 'lucide-react'

export function SupportSection() {
  return (
    <div className="mt-12 rounded-lg bg-gray-100 p-6 text-center">
      <h4 className="mb-2 font-semibold text-gray-900">¿Necesitas ayuda?</h4>
      <p className="mb-4 text-sm text-gray-600">
        Nuestro equipo de soporte está listo para asistirte
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="mailto:Latusamx1@gmail.com"
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          <Mail className="mr-2 h-4 w-4" />
          Latusamx1@gmail.com
        </a>
        <a
          href="tel:+52887xxxxxxx"
          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          <Phone className="mr-2 h-4 w-4" />
          +52 887 xxxxxxx
        </a>
      </div>
    </div>
  )
}
