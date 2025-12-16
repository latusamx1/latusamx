'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useDashboardRoute } from '@/lib/hooks/usePermissions'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function DashboardPage() {
  const router = useRouter()
  const { userProfile, isInitialized } = useAuth()
  const dashboardRoute = useDashboardRoute()

  // Redirigir al dashboard específico del rol
  useEffect(() => {
    if (isInitialized && userProfile) {
      router.push(dashboardRoute)
    }
  }, [isInitialized, userProfile, dashboardRoute, router])

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a tu dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
