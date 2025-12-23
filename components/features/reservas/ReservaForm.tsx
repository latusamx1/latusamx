/**
 * Formulario para crear/editar reserva de mesa
 */

'use client'

import { useState } from 'react'
import { Calendar, Users, Clock, Cake, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ReservaFormProps {
  sucursalId: string
  onSubmit?: (data: ReservaData) => void
  loading?: boolean
}

interface ReservaData {
  fecha: string
  hora: string
  personas: number
  nombre: string
  telefono: string
  email: string
  ocasion?: string
  esCumpleanos: boolean
  comentarios?: string
}

const OCASIONES = ['Cumpleaños', 'Aniversario', 'Cita romántica', 'Negocios', 'Familiar', 'Otro']

export function ReservaForm({ sucursalId, onSubmit, loading = false }: ReservaFormProps) {
  const [formData, setFormData] = useState<ReservaData>({
    fecha: '',
    hora: '',
    personas: 2,
    nombre: '',
    telefono: '',
    email: '',
    ocasion: '',
    esCumpleanos: false,
    comentarios: '',
  })

  const [selectedOcasiones, setSelectedOcasiones] = useState<string[]>([])

  const handleChange = (field: keyof ReservaData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleOcasion = (ocasion: string) => {
    setSelectedOcasiones((prev) => {
      if (prev.includes(ocasion)) {
        return prev.filter((o) => o !== ocasion)
      } else {
        return [...prev, ocasion]
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        ...formData,
        ocasion: selectedOcasiones.join(', '),
      })
    }
  }

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fecha y Hora */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-600" />
            Fecha y Hora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                min={today}
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="hora">Hora *</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => handleChange('hora', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Número de Personas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-red-600" />
            Número de Personas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleChange('personas', Math.max(1, formData.personas - 1))}
            >
              -
            </Button>
            <span className="text-2xl font-bold w-16 text-center">{formData.personas}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleChange('personas', Math.min(20, formData.personas + 1))}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Datos de Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+58 424-123-4567"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ocasión Especial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-red-600" />
            Ocasión Especial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cumpleaños */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cumpleanos"
              checked={formData.esCumpleanos}
              onChange={(e) => handleChange('esCumpleanos', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="cumpleanos" className="flex items-center gap-2 cursor-pointer">
              <Cake className="h-4 w-4 text-pink-600" />
              Es un cumpleaños
            </Label>
          </div>

          {/* Tags de Ocasión */}
          <div>
            <Label className="mb-2 block">Tipo de ocasión</Label>
            <div className="flex flex-wrap gap-2">
              {OCASIONES.map((ocasion) => (
                <Badge
                  key={ocasion}
                  variant={selectedOcasiones.includes(ocasion) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleOcasion(ocasion)}
                >
                  {ocasion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Comentarios */}
          <div>
            <Label htmlFor="comentarios">Comentarios adicionales</Label>
            <textarea
              id="comentarios"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Alergias, preferencias de mesa, decoración especial..."
              value={formData.comentarios}
              onChange={(e) => handleChange('comentarios', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botón Submit */}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Procesando...' : 'Confirmar Reserva'}
      </Button>
    </form>
  )
}
