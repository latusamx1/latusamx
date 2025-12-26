/**
 * Landing Page Principal - Diseño basado en designs/screens/index.html
 */

'use client'

import { PublicHeader } from '@/components/landing/PublicHeader'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { CTASection } from '@/components/landing/CTASection'
import { StatsSection } from '@/components/landing/StatsSection'
import { PublicFooter } from '@/components/landing/PublicFooter'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicHeader />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <StatsSection />
      <PublicFooter />
    </div>
  )
}
