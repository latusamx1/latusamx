import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: 'blue' | 'purple' | 'green' | 'amber' | 'red'
  trend?: {
    value: string
    direction: 'up' | 'down'
    label: string
  }
  subtitle?: string
}

const iconColorMap = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
}

const trendColorMap = {
  up: 'text-green-600',
  down: 'text-amber-600',
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  trend,
  subtitle,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 flex items-center ${trendColorMap[trend.direction]}`}>
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              <span>{trend.value}</span> {trend.label}
            </p>
          )}
          {subtitle && !trend && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColorMap[iconColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
