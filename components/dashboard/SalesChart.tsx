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
  const hasData = data && data.length > 0
  const maxValue = hasData ? Math.max(...data.map((d) => d.value)) : 100
  const totalVentas = hasData ? data.reduce((sum, d) => sum + d.value, 0) : 0
  const hasRealSales = totalVentas > 0

  // Calcular tendencia
  const calcularTendencia = () => {
    if (!hasData || data.length < 2) return '+0.0%'
    const mitad = Math.floor(data.length / 2)
    const primeraParteVentas = data.slice(0, mitad).reduce((sum, d) => sum + d.value, 0)
    const segundaParteVentas = data.slice(mitad).reduce((sum, d) => sum + d.value, 0)

    if (primeraParteVentas === 0) return '+100%'
    const cambio = ((segundaParteVentas - primeraParteVentas) / primeraParteVentas) * 100
    return `${cambio >= 0 ? '+' : ''}${cambio.toFixed(1)}%`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ventas por Día</h3>
            <p className="text-sm text-gray-500">Últimos 7 días</p>
          </div>
          {hasRealSales && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
              {calcularTendencia()}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        {hasRealSales ? (
          <div className="h-64 bg-linear-to-t from-blue-50 to-transparent rounded flex items-end justify-around gap-2">
            {data.map((item, index) => {
              const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '100%' }}>
                    {item.value > 0 && (
                      <>
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 cursor-pointer group relative"
                          style={{ height: `${height}%`, minHeight: item.value > 0 ? '4px' : '0' }}
                          title={`$${item.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${item.value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{item.day}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-500 text-sm">Sin ventas en los últimos 7 días</p>
              <p className="text-gray-400 text-xs mt-1">Las ventas aparecerán aquí cuando haya transacciones</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
