import { Award } from 'lucide-react'

interface PointsCardProps {
  points: number
  nextLevel?: {
    name: string
    pointsNeeded: number
  }
}

export default function PointsCard({ points, nextLevel }: PointsCardProps) {
  const defaultNextLevel = {
    name: 'Nivel Oro',
    pointsNeeded: 750,
  }

  const level = nextLevel || defaultNextLevel
  const totalPoints = points + level.pointsNeeded
  const percentage = (points / totalPoints) * 100

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-6 h-6" />
        <h3 className="font-bold">EventPro Points</h3>
      </div>
      <p className="text-3xl font-bold mb-2">{points.toLocaleString()} pts</p>
      <p className="text-sm opacity-90 mb-4">Estás cerca de tu próxima recompensa!</p>
      <div className="bg-white/20 rounded-full h-2 mb-2">
        <div className="bg-white rounded-full h-2" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs opacity-90">
        Faltan {level.pointsNeeded.toLocaleString()} puntos para {level.name}
      </p>
    </div>
  )
}
