'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { venueSchema, type VenueFormData } from '@/lib/validations/venue.schema'
import { Venue } from '@/types'
import { Building2, MapPin, Users, Phone, Mail, Globe, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface VenueFormProps {
  venue?: Venue | null
  open: boolean
  onClose: () => void
  onSubmit: (data: VenueFormData) => Promise<void>
  isSubmitting?: boolean
}

export default function VenueForm({
  venue,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: VenueFormProps) {
  const isEditing = !!venue

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
      capacidad: 100,
      estadoVenue: 'activo',
      telefono: '',
      email: '',
      sitioWeb: '',
      descripcion: '',
    },
  })

  // Resetear formulario cuando cambia el venue o se abre/cierra el modal
  useEffect(() => {
    if (open) {
      if (venue) {
        reset({
          nombre: venue.nombre,
          direccion: venue.direccion,
          ciudad: venue.ciudad,
          estado: venue.estado,
          codigoPostal: venue.codigoPostal,
          capacidad: venue.capacidad,
          ubicacion: venue.ubicacion,
          estadoVenue: venue.estadoVenue || 'activo',
          telefono: venue.telefono || '',
          email: venue.email || '',
          sitioWeb: venue.sitioWeb || '',
          descripcion: venue.descripcion || '',
        })
      } else {
        reset({
          nombre: '',
          direccion: '',
          ciudad: '',
          estado: '',
          codigoPostal: '',
          capacidad: 100,
          estadoVenue: 'activo',
          telefono: '',
          email: '',
          sitioWeb: '',
          descripcion: '',
        })
      }
    }
  }, [venue, open, reset])

  const handleFormSubmit = async (data: VenueFormData) => {
    await onSubmit(data)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            {isEditing ? 'Editar Venue' : 'Nuevo Venue'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              Información Básica
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nombre">
                  Nombre del Venue <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: EventPro Polanco"
                  {...register('nombre')}
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  rows={2}
                  placeholder="Breve descripción del venue..."
                  {...register('descripcion')}
                  className={errors.descripcion ? 'border-red-500' : ''}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-600 mt-1">{errors.descripcion.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="capacidad">
                  Capacidad <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="capacidad"
                    type="number"
                    min={1}
                    placeholder="1000"
                    className={`pl-10 ${errors.capacidad ? 'border-red-500' : ''}`}
                    {...register('capacidad', { valueAsNumber: true })}
                  />
                </div>
                {errors.capacidad && (
                  <p className="text-sm text-red-600 mt-1">{errors.capacidad.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estadoVenue">Estado Operativo</Label>
                <Select
                  value={watch('estadoVenue')}
                  onValueChange={(value) => setValue('estadoVenue', value as any)}
                >
                  <SelectTrigger className={errors.estadoVenue ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Ubicación
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="direccion">
                  Dirección <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="direccion"
                  placeholder="Av. Masaryk 111, Col. Polanco"
                  {...register('direccion')}
                  className={errors.direccion ? 'border-red-500' : ''}
                />
                {errors.direccion && (
                  <p className="text-sm text-red-600 mt-1">{errors.direccion.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ciudad">
                  Ciudad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ciudad"
                  placeholder="Ciudad de México"
                  {...register('ciudad')}
                  className={errors.ciudad ? 'border-red-500' : ''}
                />
                {errors.ciudad && (
                  <p className="text-sm text-red-600 mt-1">{errors.ciudad.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="estado">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estado"
                  placeholder="CDMX"
                  {...register('estado')}
                  className={errors.estado ? 'border-red-500' : ''}
                />
                {errors.estado && (
                  <p className="text-sm text-red-600 mt-1">{errors.estado.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="codigoPostal">
                  Código Postal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigoPostal"
                  placeholder="11560"
                  {...register('codigoPostal')}
                  className={errors.codigoPostal ? 'border-red-500' : ''}
                />
                {errors.codigoPostal && (
                  <p className="text-sm text-red-600 mt-1">{errors.codigoPostal.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Información de Contacto
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="telefono"
                    placeholder="+52 55 1234 5678"
                    className="pl-10"
                    {...register('telefono')}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-sm text-red-600 mt-1">{errors.telefono.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contacto@venue.com"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="sitioWeb">Sitio Web</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="sitioWeb"
                    placeholder="https://www.venue.com"
                    className="pl-10"
                    {...register('sitioWeb')}
                  />
                </div>
                {errors.sitioWeb && (
                  <p className="text-sm text-red-600 mt-1">{errors.sitioWeb.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Crear Venue'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
