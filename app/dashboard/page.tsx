'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import { getDashboardRoute } from '@/lib/utils/permissions'

/**
 * Ruta legacy /dashboard que redirige al dashboard específico del rol
 * Mantiene compatibilidad con URLs antiguas
 */
export default function DashboardRedirectPage() {
  const router = useRouter()
  const { userProfile, loading } = useAuthStore()

  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        router.push('/login')
      } else {
        const dashboardRoute = getDashboardRoute(userProfile)
        router.replace(dashboardRoute)
      }
    }
  }, [userProfile, loading, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  )
}
