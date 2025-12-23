/**
 * Plano visual de mesas del restaurante
 */

'use client'

import { useState } from 'react'
import { Users, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Mesa {
  id: string
  numero: number
  capacidad: number
  area: 'interior' | 'exterior' | 'terraza' | 'vip'
  estado: 'disponible' | 'reservada' | 'ocupada'
  posicion: {
    x: number
    y: number
  }
  forma: 'cuadrada' | 'redonda' | 'rectangular'
}

interface MesaPlanoProps {
  mesas: Mesa[]
  onSelectMesa?: (mesaId: string) => void
  selectedMesaId?: string
  readonly?: boolean
}

const AREA_COLORS = {
  interior: 'bg-blue-100 border-blue-300',
  exterior: 'bg-green-100 border-green-300',
  terraza: 'bg-yellow-100 border-yellow-300',
  vip: 'bg-purple-100 border-purple-300',
}

const AREA_LABELS = {
  interior: 'Interior',
  exterior: 'Exterior',
  terraza: 'Terraza',
  vip: 'VIP',
}

export function MesaPlano({ mesas, onSelectMesa, selectedMesaId, readonly = false }: MesaPlanoProps) {
  const [hoveredMesa, setHoveredMesa] = useState<string | null>(null)

  const handleMesaClick = (mesa: Mesa) => {
    if (!readonly && mesa.estado === 'disponible' && onSelectMesa) {
      onSelectMesa(mesa.id)
    }
  }

  const getMesaEstilos = (mesa: Mesa) => {
    const isSelected = mesa.id === selectedMesaId
    const isHovered = mesa.id === hoveredMesa
    const isDisponible = mesa.estado === 'disponible'

    let baseClasses = 'relative flex flex-col items-center justify-center border-2 transition-all cursor-pointer'

    // Forma
    if (mesa.forma === 'redonda') {
      baseClasses += ' rounded-full'
    } else if (mesa.forma === 'rectangular') {
      baseClasses += ' rounded-lg'
    } else {
      baseClasses += ' rounded-md'
    }

    // Tamaño según capacidad
    const size = mesa.capacidad <= 2 ? 'w-16 h-16' : mesa.capacidad <= 4 ? 'w-20 h-20' : 'w-24 h-24'
    baseClasses += ` ${size}`

    // Color según estado
    if (isSelected) {
      baseClasses += ' bg-red-500 border-red-700 text-white scale-110 shadow-lg'
    } else if (mesa.estado === 'disponible') {
      baseClasses += ' bg-white border-gray-300 hover:border-red-500 hover:shadow-md'
      if (isHovered) {
        baseClasses += ' border-red-400 shadow-md'
      }
    } else if (mesa.estado === 'reservada') {
      baseClasses += ' bg-yellow-100 border-yellow-400 cursor-not-allowed opacity-60'
    } else {
      baseClasses += ' bg-gray-200 border-gray-400 cursor-not-allowed opacity-60'
    }

    return baseClasses
  }

  // Agrupar mesas por área
  const mesasPorArea = mesas.reduce(
    (acc, mesa) => {
      if (!acc[mesa.area]) {
        acc[mesa.area] = []
      }
      acc[mesa.area].push(mesa)
      return acc
    },
    {} as Record<string, Mesa[]>
  )

  return (
    <div className="space-y-6">
      {/* Leyenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded" />
              <span>Reservada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded" />
              <span>Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 border-2 border-red-700 rounded" />
              <span>Seleccionada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plano por Áreas */}
      {Object.entries(mesasPorArea).map(([area, mesasArea]) => (
        <Card key={area} className={AREA_COLORS[area as keyof typeof AREA_COLORS]}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{AREA_LABELS[area as keyof typeof AREA_LABELS]}</span>
              <Badge variant="outline">
                {mesasArea.filter((m) => m.estado === 'disponible').length} disponibles
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[300px] bg-white/50 rounded-lg p-6">
              {/* Grid de Mesas */}
              <div className="flex flex-wrap gap-4 justify-center">
                {mesasArea.map((mesa) => (
                  <div
                    key={mesa.id}
                    className={getMesaEstilos(mesa)}
                    onClick={() => handleMesaClick(mesa)}
                    onMouseEnter={() => setHoveredMesa(mesa.id)}
                    onMouseLeave={() => setHoveredMesa(null)}
                    title={`Mesa ${mesa.numero} - ${mesa.capacidad} personas - ${mesa.estado}`}
                  >
                    {/* Número de Mesa */}
                    <span className="font-bold text-sm">#{mesa.numero}</span>

                    {/* Capacidad */}
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <Users className="w-3 h-3" />
                      <span>{mesa.capacidad}</span>
                    </div>

                    {/* Check si está seleccionada */}
                    {mesa.id === selectedMesaId && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Info de Mesa Seleccionada */}
      {selectedMesaId && (
        <Card className="border-red-500 border-2">
          <CardContent className="pt-6">
            {(() => {
              const mesaSeleccionada = mesas.find((m) => m.id === selectedMesaId)
              if (!mesaSeleccionada) return null

              return (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Mesa seleccionada</p>
                    <p className="text-lg font-bold text-gray-900">
                      Mesa #{mesaSeleccionada.numero} - {AREA_LABELS[mesaSeleccionada.area]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Capacidad</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                      <Users className="w-5 h-5" />
                      {mesaSeleccionada.capacidad} personas
                    </p>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
