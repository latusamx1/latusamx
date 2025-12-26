/**
 * Sección de estadísticas
 */

'use client'

export function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Eventos Creados' },
    { value: '500K+', label: 'Tickets Vendidos' },
    { value: '50K+', label: 'Reservas Activas' },
    { value: '98%', label: 'Satisfacción' },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
