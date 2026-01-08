interface CapacityIndicatorProps {
  current: number
  max: number
  label?: string
}

export default function CapacityIndicator({
  current,
  max,
  label = 'Aforo Actual',
}: CapacityIndicatorProps) {
  const percentage = (current / max) * 100
  const displayValue = `${current}/${max}`

  let barColor = 'bg-blue-600'
  if (percentage >= 90) {
    barColor = 'bg-red-600'
  } else if (percentage >= 75) {
    barColor = 'bg-orange-600'
  } else if (percentage >= 50) {
    barColor = 'bg-yellow-600'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
        <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
