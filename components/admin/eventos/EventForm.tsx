'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventoSchema, type EventoFormData, type TipoTicketFormData } from '@/lib/validations/evento.schema'
import { Evento, Venue } from '@/types'
import { uploadImage, CLOUDINARY_FOLDERS, deleteImage } from '@/lib/cloudinary/client'
import { Info, Calendar, Ticket, Settings, Plus, X, UploadCloud, Loader2 } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface EventFormProps {
  evento?: Evento
  venues: Venue[]
  onSubmit: (data: EventoFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
  isSubmitting?: boolean
}

export default function EventForm({
  evento,
  venues,
  onSubmit,
  onCancel,
  submitLabel = 'Crear Evento',
  isSubmitting = false,
}: EventFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(evento?.imagenPortada || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: evento
      ? {
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          categoria: evento.categoria,
          fecha: evento.fecha instanceof Date ? evento.fecha : evento.fecha?.toDate?.() || new Date(),
          fechaFin: evento.fechaFin
            ? evento.fechaFin instanceof Date
              ? evento.fechaFin
              : evento.fechaFin?.toDate?.()
            : undefined,
          horaInicio: evento.horaInicio,
          horaFin: evento.horaFin || undefined,
          venueId: evento.venueId,
          tiposTickets: evento.tiposTickets?.map((t, index) => ({
            id: t.id,
            nombre: t.nombre,
            descripcion: t.descripcion || '',
            precio: t.precio,
            cantidad: t.cantidad,
            disponibles: t.disponibles,
            orden: index,
          })) || [],
          estado: evento.estado || 'borrador',
          destacado: evento.destacado || false,
          tags: evento.tags || [],
          imagenPortada: evento.imagenPortada,
          imagenPublicId: evento.imagenPublicId,
        }
      : {
          titulo: '',
          descripcion: '',
          categoria: 'concierto',
          fecha: new Date(),
          horaInicio: '',
          venueId: '',
          tiposTickets: [],
          estado: 'borrador',
          destacado: false,
          tags: [],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tiposTickets',
  })

  const watchTiposTickets = watch('tiposTickets')
  const watchEstado = watch('estado')

  // Calcular resumen
  const totalTickets = watchTiposTickets?.reduce((sum, t) => sum + (t.cantidad || 0), 0) || 0
  const precioPromedio =
    watchTiposTickets && watchTiposTickets.length > 0
      ? watchTiposTickets.reduce((sum, t) => sum + (t.precio || 0), 0) / watchTiposTickets.length
      : 0
  const ingresoPotencial =
    watchTiposTickets?.reduce((sum, t) => sum + (t.precio || 0) * (t.cantidad || 0), 0) || 0

  // Manejar upload de imagen
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setImageFile(file)
  }

  // Agregar tipo de ticket
  const handleAddTicket = () => {
    append({
      nombre: '',
      descripcion: '',
      precio: 0,
      cantidad: 0,
      orden: fields.length,
    })
  }

  // Submit del formulario
  const handleFormSubmit = async (data: EventoFormData) => {
    try {
      // Si hay una nueva imagen, subirla primero
      if (imageFile) {
        setUploadingImage(true)
        try {
          const uploadResult = await uploadImage(imageFile, {
            folder: 'EVENTOS',
          })

          // Si había una imagen anterior, eliminarla
          if (evento?.imagenPublicId) {
            try {
              await deleteImage(evento.imagenPublicId)
            } catch (error) {
              console.error('Error deleting old image:', error)
            }
          }

          data.imagenPortada = uploadResult.secureUrl
          data.imagenPublicId = uploadResult.publicId
        } catch (error: any) {
          toast.error(error.message || 'Error al subir la imagen')
          setUploadingImage(false)
          return
        }
        setUploadingImage(false)
      }

      // Asignar disponibles igual a cantidad para nuevos tickets
      data.tiposTickets = data.tiposTickets.map((ticket) => ({
        ...ticket,
        id: ticket.id || `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        disponibles: ticket.disponibles ?? ticket.cantidad,
      }))

      await onSubmit(data)
    } catch (error: any) {
      console.error('Error en submit:', error)
      toast.error(error.message || 'Error al guardar el evento')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información Básica */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-600" />
          Información Básica
        </h3>

        <div className="space-y-4">
          {/* Nombre del Evento */}
          <div>
            <Label htmlFor="titulo">
              Nombre del Evento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ej: Festival de Música 2024"
              {...register('titulo')}
              className={errors.titulo ? 'border-red-500' : ''}
            />
            {errors.titulo && (
              <p className="text-sm text-red-600 mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="categoria">
              Categoría <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch('categoria')}
              onValueChange={(value) => setValue('categoria', value as any)}
            >
              <SelectTrigger className={errors.categoria ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concierto">Concierto</SelectItem>
                <SelectItem value="deportes">Deportes</SelectItem>
                <SelectItem value="teatro">Teatro</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-sm text-red-600 mt-1">{errors.categoria.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              rows={4}
              placeholder="Describe tu evento, incluye detalles importantes para los asistentes..."
              {...register('descripcion')}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 100 caracteres ({watch('descripcion')?.length || 0}/100)
            </p>
            {errors.descripcion && (
              <p className="text-sm text-red-600 mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Upload de Imagen */}
          <div>
            <Label>
              Imagen del Evento <span className="text-red-500">*</span>
            </Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setImagePreview(null)
                      setImageFile(null)
                      setValue('imagenPortada', undefined)
                      setValue('imagenPublicId', undefined)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click para subir o arrastra una imagen
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG o WEBP (max. 10MB)</p>
                </div>
              )}
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {!imagePreview && !evento?.imagenPortada && (
              <p className="text-sm text-red-600 mt-1">La imagen es requerida</p>
            )}
          </div>
        </div>
      </div>

      {/* Fecha y Ubicación */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Fecha y Ubicación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha de Inicio */}
          <div>
            <Label htmlFor="fecha">
              Fecha de Inicio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fecha"
              type="date"
              {...register('fecha', {
                setValueAs: (v) => (v ? new Date(v) : undefined),
              })}
              className={errors.fecha ? 'border-red-500' : ''}
            />
            {errors.fecha && (
              <p className="text-sm text-red-600 mt-1">{errors.fecha.message}</p>
            )}
          </div>

          {/* Hora de Inicio */}
          <div>
            <Label htmlFor="horaInicio">
              Hora de Inicio <span className="text-red-500">*</span>
            </Label>
            <Input
              id="horaInicio"
              type="time"
              {...register('horaInicio')}
              className={errors.horaInicio ? 'border-red-500' : ''}
            />
            {errors.horaInicio && (
              <p className="text-sm text-red-600 mt-1">{errors.horaInicio.message}</p>
            )}
          </div>

          {/* Fecha de Finalización */}
          <div>
            <Label htmlFor="fechaFin">Fecha de Finalización</Label>
            <Input
              id="fechaFin"
              type="date"
              {...register('fechaFin', {
                setValueAs: (v) => (v ? new Date(v) : null),
              })}
              className={errors.fechaFin ? 'border-red-500' : ''}
            />
            {errors.fechaFin && (
              <p className="text-sm text-red-600 mt-1">{errors.fechaFin.message}</p>
            )}
          </div>

          {/* Hora de Finalización */}
          <div>
            <Label htmlFor="horaFin">Hora de Finalización</Label>
            <Input id="horaFin" type="time" {...register('horaFin')} />
          </div>
        </div>

        {/* Venue */}
        <div className="mt-4">
          <Label htmlFor="venueId">
            Lugar del Evento <span className="text-red-500">*</span>
          </Label>
          <Select value={watch('venueId')} onValueChange={(value) => setValue('venueId', value)}>
            <SelectTrigger className={errors.venueId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecciona un lugar" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.venueId && (
            <p className="text-sm text-red-600 mt-1">{errors.venueId.message}</p>
          )}
        </div>
      </div>

      {/* Tipos de Tickets */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Ticket className="w-5 h-5 mr-2 text-blue-600" />
            Tipos de Tickets
          </h3>
          <Button type="button" onClick={handleAddTicket} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Agregar Ticket
          </Button>
        </div>

        <div className="space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay tipos de tickets. Agrega al menos uno.
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded-lg p-4 relative">
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`tiposTickets.${index}.nombre`}>Nombre</Label>
                  <Input
                    id={`tiposTickets.${index}.nombre`}
                    placeholder="Ej: General"
                    {...register(`tiposTickets.${index}.nombre`)}
                    className={errors.tiposTickets?.[index]?.nombre ? 'border-red-500' : ''}
                  />
                  {errors.tiposTickets?.[index]?.nombre && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.tiposTickets[index]?.nombre?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`tiposTickets.${index}.precio`}>Precio ($)</Label>
                  <Input
                    id={`tiposTickets.${index}.precio`}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register(`tiposTickets.${index}.precio`, { valueAsNumber: true })}
                    className={errors.tiposTickets?.[index]?.precio ? 'border-red-500' : ''}
                  />
                  {errors.tiposTickets?.[index]?.precio && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.tiposTickets[index]?.precio?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`tiposTickets.${index}.cantidad`}>Cantidad</Label>
                  <Input
                    id={`tiposTickets.${index}.cantidad`}
                    type="number"
                    placeholder="0"
                    {...register(`tiposTickets.${index}.cantidad`, { valueAsNumber: true })}
                    className={errors.tiposTickets?.[index]?.cantidad ? 'border-red-500' : ''}
                  />
                  {errors.tiposTickets?.[index]?.cantidad && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.tiposTickets[index]?.cantidad?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <Label htmlFor={`tiposTickets.${index}.descripcion`}>Descripción</Label>
                <Input
                  id={`tiposTickets.${index}.descripcion`}
                  placeholder="Beneficios y detalles de este ticket"
                  {...register(`tiposTickets.${index}.descripcion`)}
                />
              </div>
            </div>
          ))}

          {errors.tiposTickets && typeof errors.tiposTickets.message === 'string' && (
            <p className="text-sm text-red-600">{errors.tiposTickets.message}</p>
          )}
        </div>
      </div>

      {/* Configuración Adicional */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Configuración Adicional
        </h3>

        <div className="space-y-4">
          {/* Estado */}
          <div>
            <Label htmlFor="estado">Estado del evento</Label>
            <Select value={watch('estado')} onValueChange={(value) => setValue('estado', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="publicado">Publicado</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evento Destacado */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="destacado"
              checked={watch('destacado')}
              onCheckedChange={(checked) => setValue('destacado', !!checked)}
            />
            <Label htmlFor="destacado" className="cursor-pointer">
              Marcar como evento destacado
            </Label>
          </div>
        </div>
      </div>

      {/* Vista Previa */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Tickets</span>
            <span className="font-medium text-gray-900">{totalTickets.toLocaleString('es-MX')}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tipos de Ticket</span>
            <span className="font-medium text-gray-900">{fields.length}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Precio Promedio</span>
            <span className="font-medium text-gray-900">
              ${precioPromedio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
            <span className="text-gray-600">Ingreso Potencial</span>
            <span className="font-bold text-green-600">
              ${ingresoPotencial.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || uploadingImage}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || uploadingImage} className="flex-1">
          {uploadingImage ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subiendo imagen...
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
