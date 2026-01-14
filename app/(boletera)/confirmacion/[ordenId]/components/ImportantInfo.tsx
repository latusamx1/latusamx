'use client'

import { Orden } from '@/types'
import { Info } from 'lucide-react'

interface ImportantInfoProps {
  orden: Orden
}

export function ImportantInfo({ orden }: ImportantInfoProps) {
  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-6 w-6 shrink-0 text-blue-600" />
        <div>
          <h4 className="mb-2 font-semibold text-blue-900">Información Importante</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className='hidden'>
              ✓ Hemos enviado tus tickets a <strong>{orden.datosComprador.email}</strong>
            </li>
            <li>✓ Presenta el código QR al llegar al evento</li>
            <li>✓ Recomendamos llegar 30 minutos antes del inicio</li>
            <li>✓ Puedes descargar tus tickets en PDF desde esta página</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
