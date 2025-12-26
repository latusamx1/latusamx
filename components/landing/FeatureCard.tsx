/**
 * Card de característica reutilizable
 */

'use client'

import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'pink'
}

export function FeatureCard({ icon: Icon, title, description, color = 'blue' }: FeatureCardProps) {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
    }
    return colors[color] || colors.blue
  }

  const colors = getColorClasses(color)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${colors.text}`} />
      </div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
