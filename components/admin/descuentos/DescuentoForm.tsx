'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { descuentoSchema, type DescuentoFormData } from '@/lib/validations/descuento.schema'
import { CodigoDescuento } from '@/types'
import { Tag, Calendar, Percent, DollarSign, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
import { format } from 'date-fns'

interface DescuentoFormProps {
  descuento?: CodigoDescuento | null
  open: boolean
  onClose: () => void
  onSubmit: (data: DescuentoFormData) => Promise<void>
  isSubmitting?: boolean
}

export default function DescuentoForm({
  descuento,
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: DescuentoFormProps) {
  const isEditing = !!descuento

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DescuentoFormData>({
    resolver: zodResolver(descuentoSchema),
    defaultValues: {
      codigo: '',
      descripcion: '',
      tipo: 'porcentaje',
      valor: 10,
      usosMaximos: null,
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      activo: true,
      eventosAplicables: [],
    },
  })

  const tipoDescuento = watch('tipo')

  // Resetear formulario cuando cambia el descuento o se abre el modal
  useEffect(() => {
    if (open) {
      if (descuento) {
        const fechaInicio = descuento.fechaInicio instanceof Date
          ? descuento.fechaInicio
          : (descuento.fechaInicio as any)?.toDate?.() || new Date(descuento.fechaInicio)
        const fechaFin = descuento.fechaFin instanceof Date
          ? descuento.fechaFin
          : (descuento.fechaFin as any)?.toDate?.() || new Date(descuento.fechaFin)

        reset({
          codigo: descuento.codigo,
          descripcion: (descuento as any).descripcion || '',
          tipo: descuento.tipo,
          valor: descuento.valor,
          usosMaximos: descuento.usosMaximos || null,
          fechaInicio,
          fechaFin,
          activo: descuento.activo,
          eventosAplicables: descuento.eventosAplicables || [],
        })
      } else {
        reset({
          codigo: '',
          descripcion: '',
          tipo: 'porcentaje',
          valor: 10,
          usosMaximos: null,
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          activo: true,
          eventosAplicables: [],
        })
      }
    }
  }, [descuento, open, reset])

  const handleFormSubmit = async (data: DescuentoFormData) => {
    await onSubmit(data)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // Helper para formatear fecha para input date
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ''
    return format(date, 'yyyy-MM-dd')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            {isEditing ? 'Editar Código' : 'Nuevo Código de Descuento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Código */}
          <div>
            <Label htmlFor="codigo">
              Código <span className="text-red-500">*</span>
            </Label>
            <Input
              id="codigo"
              placeholder="Ej: SUMMER2024"
              {...register('codigo')}
              className={`uppercase ${errors.codigo ? 'border-red-500' : ''}`}
              disabled={isEditing}
            />
            <p className="text-xs text-gray-500 mt-1">Solo letras mayúsculas y números</p>
            {errors.codigo && (
              <p className="text-sm text-red-600 mt-1">{errors.codigo.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              rows={2}
              placeholder="Ej: 20% de descuento en eventos de verano"
              {...register('descripcion')}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600 mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Tipo y Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo de Descuento</Label>
              <Select
                value={watch('tipo')}
                onValueChange={(value) => setValue('tipo', value as 'porcentaje' | 'monto')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porcentaje">
                    <span className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Porcentaje
                    </span>
                  </SelectItem>
                  <SelectItem value="monto">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Monto fijo
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valor">
                Valor <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                {tipoDescuento === 'porcentaje' ? (
                  <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                ) : (
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
                <Input
                  id="valor"
                  type="number"
                  min={1}
                  max={tipoDescuento === 'porcentaje' ? 100 : undefined}
                  placeholder={tipoDescuento === 'porcentaje' ? '20' : '50'}
                  className={`${tipoDescuento === 'monto' ? 'pl-10' : ''} ${errors.valor ? 'border-red-500' : ''}`}
                  {...register('valor', { valueAsNumber: true })}
                />
              </div>
              {errors.valor && (
                <p className="text-sm text-red-600 mt-1">{errors.valor.message}</p>
              )}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fechaInicio">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Inicio
              </Label>
              <Input
                id="fechaInicio"
                type="date"
                value={formatDateForInput(watch('fechaInicio'))}
                onChange={(e) => setValue('fechaInicio', new Date(e.target.value))}
                className={errors.fechaInicio ? 'border-red-500' : ''}
              />
              {errors.fechaInicio && (
                <p className="text-sm text-red-600 mt-1">{errors.fechaInicio.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fechaFin">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Fin
              </Label>
              <Input
                id="fechaFin"
                type="date"
                value={formatDateForInput(watch('fechaFin'))}
                onChange={(e) => setValue('fechaFin', new Date(e.target.value))}
                className={errors.fechaFin ? 'border-red-500' : ''}
              />
              {errors.fechaFin && (
                <p className="text-sm text-red-600 mt-1">{errors.fechaFin.message}</p>
              )}
            </div>
          </div>

          {/* Usos Máximos */}
          <div>
            <Label htmlFor="usosMaximos">Límite de Usos (opcional)</Label>
            <Input
              id="usosMaximos"
              type="number"
              min={1}
              placeholder="Sin límite"
              {...register('usosMaximos', {
                setValueAs: (v) => (v === '' ? null : parseInt(v, 10)),
              })}
            />
            <p className="text-xs text-gray-500 mt-1">Dejar vacío para usos ilimitados</p>
          </div>

          {/* Activo */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="activo"
              checked={watch('activo')}
              onCheckedChange={(checked) => setValue('activo', !!checked)}
            />
            <Label htmlFor="activo" className="cursor-pointer">
              Código activo
            </Label>
          </div>

          <DialogFooter className="gap-2 pt-4">
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
                'Crear Código'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
