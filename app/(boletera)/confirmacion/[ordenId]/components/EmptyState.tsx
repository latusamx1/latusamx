'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">No se encontraron detalles de la orden</p>
        <Button asChild className="mt-4">
          <Link href="/eventos">Volver a eventos</Link>
        </Button>
      </div>
    </div>
  )
}
