'use client'

interface SalesChartProps {
  data?: Array<{ day: string; value: number }>
}

const defaultData = [
  { day: 'Lun', value: 60 },
  { day: 'Mar', value: 75 },
  { day: 'Mié', value: 50 },
  { day: 'Jue', value: 85 },
  { day: 'Vie', value: 65 },
  { day: 'Sáb', value: 90 },
  { day: 'Dom', value: 100 },
]

export default function SalesChart({ data = defaultData }: SalesChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ventas por Día</h3>
            <p className="text-sm text-gray-500">Últimos 7 días</p>
          </div>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
            +8.2%
          </span>
        </div>
      </div>
      <div className="p-6">
        {/* Chart */}
        <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded flex items-end justify-around gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
