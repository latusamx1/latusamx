interface AvatarProps {
  initials: string
  name?: string
  role?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'purple' | 'green' | 'amber'
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
}

export default function Avatar({
  initials,
  name,
  role,
  size = 'md',
  color = 'blue',
}: AvatarProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeMap[size]} ${colorMap[color]} rounded-full flex items-center justify-center font-semibold`}
      >
        {initials}
      </div>
      {(name || role) && (
        <div className="flex-1 min-w-0">
          {name && (
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          )}
          {role && (
            <p className="text-xs text-gray-500 truncate">{role}</p>
          )}
        </div>
      )}
    </div>
  )
}
