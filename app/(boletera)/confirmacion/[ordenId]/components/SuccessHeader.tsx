'use client'

import { CheckCircle } from 'lucide-react'

export function SuccessHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h1 className="mb-3 text-4xl font-bold text-gray-900">¡Compra Confirmada!</h1>
      <p className="text-xl text-gray-600">Tu pedido ha sido procesado exitosamente</p>
    </div>
  )
}
