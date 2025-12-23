/**
 * Componente para estados vacíos
 */

'use client'

import { LucideIcon, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {/* Icono */}
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <Icon className="h-12 w-12 text-gray-400" />
        </div>

        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Descripción */}
        {description && <p className="text-sm text-gray-600 mb-6 max-w-sm">{description}</p>}

        {/* Acción */}
        {action && (
          <Button onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
