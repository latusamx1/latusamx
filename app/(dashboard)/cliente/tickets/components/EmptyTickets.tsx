'use client'

import { Button } from '@/components/ui/button'
import { Ticket } from 'lucide-react'
import Link from 'next/link'

interface EmptyTicketsProps {
  filter: string
}

export function EmptyTickets({ filter }: EmptyTicketsProps) {
  const getMessage = () => {
    switch (filter) {
      case 'proximos':
        return {
          title: 'No tienes eventos próximos',
          description: 'Explora nuevos eventos y compra tus tickets',
        }
      case 'pasados':
        return {
          title: 'No tienes eventos pasados',
          description: 'Tus eventos anteriores aparecerán aquí',
        }
      case 'usados':
        return {
          title: 'No tienes tickets usados',
          description: 'Los tickets que uses en eventos aparecerán aquí',
        }
      default:
        return {
          title: 'No tienes tickets todavía',
          description: '¡Comienza tu aventura! Descubre eventos increíbles',
        }
    }
  }

  const message = getMessage()

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
        <Ticket className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{message.title}</h3>
      <p className="mb-6 text-sm text-gray-600">{message.description}</p>
      {filter === 'todos' || filter === 'proximos' ? (
        <Button asChild>
          <Link href="/eventos">Explorar Eventos</Link>
        </Button>
      ) : null}
    </div>
  )
}
