/**
 * Selector de horarios disponibles para reservas
 */

'use client'

import { useState } from 'react'
import { Clock, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TimeSlot {
  hora: string
  disponible: boolean
  mesasDisponibles: number
}

interface TimeSlotPickerProps {
  fecha: Date
  slots: TimeSlot[]
  onSelectSlot?: (hora: string) => void
  selectedSlot?: string
}

export function TimeSlotPicker({ fecha, slots, onSelectSlot, selectedSlot }: TimeSlotPickerProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.disponible && onSelectSlot) {
      onSelectSlot(slot.hora)
    }
  }

  const formatFecha = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  // Agrupar slots por periodo del día
  const agruparPorPeriodo = (slots: TimeSlot[]) => {
    const grupos: Record<string, TimeSlot[]> = {
      almuerzo: [],
      tarde: [],
      cena: [],
    }

    slots.forEach((slot) => {
      const hora = parseInt(slot.hora.split(':')[0])
      if (hora >= 11 && hora < 15) {
        grupos.almuerzo.push(slot)
      } else if (hora >= 15 && hora < 18) {
        grupos.tarde.push(slot)
      } else {
        grupos.cena.push(slot)
      }
    })

    return grupos
  }

  const slotsAgrupados = agruparPorPeriodo(slots)

  const PERIODO_LABELS = {
    almuerzo: '🍽️ Almuerzo',
    tarde: '☕ Tarde',
    cena: '🌙 Cena',
  }

  const totalDisponibles = slots.filter((s) => s.disponible).length

  return (
    <div className="space-y-6">
      {/* Header con Fecha */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              Horarios Disponibles
            </CardTitle>
            <Badge variant={totalDisponibles > 0 ? 'default' : 'destructive'}>
              {totalDisponibles} disponibles
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 capitalize">{formatFecha(fecha)}</p>
        </CardContent>
      </Card>

      {/* Slots por Período */}
      {Object.entries(slotsAgrupados).map(([periodo, periodSlots]) => {
        if (periodSlots.length === 0) return null

        const disponiblesEnPeriodo = periodSlots.filter((s) => s.disponible).length

        return (
          <Card key={periodo}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {PERIODO_LABELS[periodo as keyof typeof PERIODO_LABELS]}
                </CardTitle>
                <Badge variant="outline">{disponiblesEnPeriodo} disponibles</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {periodSlots.map((slot) => {
                  const isSelected = slot.hora === selectedSlot
                  const isHovered = slot.hora === hoveredSlot

                  return (
                    <button
                      key={slot.hora}
                      type="button"
                      onClick={() => handleSlotClick(slot)}
                      onMouseEnter={() => setHoveredSlot(slot.hora)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      disabled={!slot.disponible}
                      className={cn(
                        'relative p-4 rounded-lg border-2 transition-all text-center',
                        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                        slot.disponible
                          ? 'cursor-pointer hover:border-red-500 hover:shadow-md'
                          : 'cursor-not-allowed opacity-50',
                        isSelected
                          ? 'bg-red-500 border-red-700 text-white shadow-lg scale-105'
                          : slot.disponible
                            ? 'bg-white border-gray-300'
                            : 'bg-gray-100 border-gray-300',
                        isHovered && !isSelected && slot.disponible && 'border-red-400 shadow-md'
                      )}
                    >
                      {/* Hora */}
                      <div className={cn('font-bold text-lg', isSelected ? 'text-white' : 'text-gray-900')}>
                        {slot.hora}
                      </div>

                      {/* Mesas disponibles */}
                      {slot.disponible && (
                        <div
                          className={cn(
                            'text-xs mt-1',
                            isSelected ? 'text-white/90' : 'text-gray-600'
                          )}
                        >
                          {slot.mesasDisponibles} mesas
                        </div>
                      )}

                      {/* No disponible */}
                      {!slot.disponible && (
                        <div className="text-xs mt-1 text-red-600 font-medium">No disponible</div>
                      )}

                      {/* Check si está seleccionado */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Sin horarios disponibles */}
      {totalDisponibles === 0 && (
        <Card className="border-red-300">
          <CardContent className="pt-6 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-900 font-semibold mb-1">
              No hay horarios disponibles para esta fecha
            </p>
            <p className="text-sm text-gray-600">Por favor selecciona otra fecha</p>
          </CardContent>
        </Card>
      )}

      {/* Horario Seleccionado */}
      {selectedSlot && (
        <Card className="border-red-500 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horario seleccionado</p>
                <p className="text-xl font-bold text-gray-900">{selectedSlot}</p>
              </div>
              <div className="text-right">
                {(() => {
                  const slot = slots.find((s) => s.hora === selectedSlot)
                  if (!slot) return null
                  return (
                    <>
                      <p className="text-sm text-gray-600">Mesas disponibles</p>
                      <p className="text-xl font-bold text-gray-900">{slot.mesasDisponibles}</p>
                    </>
                  )
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
