'use client'

import { useEffect, useState } from 'react'
import { isFeatureActive } from '@/lib/utils/featureFlags'
import { Construction } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface FeatureGateProps {
  children: React.ReactNode
  fallbackTitle?: string
  fallbackDescription?: string
}

/**
 * Componente que bloquea el acceso a features hasta la fecha de activación
 */
export function FeatureGate({
  children,
  fallbackTitle = 'En desarrollo',
  fallbackDescription = 'Esta funcionalidad estará disponible próximamente.'
}: FeatureGateProps) {
  const [isActive, setIsActive] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    setIsActive(isFeatureActive())
  }, [])

  // Loading state
  if (isActive === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Feature is active - render children
  if (isActive) {
    return <>{children}</>
  }

  // Feature not active - show simple message
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-amber-600" />
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {fallbackTitle}
        </h1>

        <p className="text-gray-600 mb-6">
          {fallbackDescription}
        </p>

        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    </div>
  )
}
