import { LucideIcon, ChevronRight } from 'lucide-react'

interface QuickActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: 'blue' | 'purple'
  href: string
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    hover: 'hover:border-blue-500 hover:bg-blue-50',
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    hover: 'hover:border-purple-500 hover:bg-purple-50',
  },
}

export default function QuickActionCard({
  icon: Icon,
  title,
  description,
  color,
  href,
}: QuickActionCardProps) {
  const config = colorConfig[color]

  return (
    <button
      onClick={() => (window.location.href = href)}
      className={`p-6 bg-white border-2 border-gray-200 rounded-lg ${config.hover} transition text-left w-full`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${config.icon}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  )
}
