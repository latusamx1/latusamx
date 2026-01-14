'use client'

import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Cargando detalles de tu compra...</p>
      </div>
    </div>
  )
}
