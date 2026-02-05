import { z } from 'zod'

export const descuentoSchema = z.object({
  codigo: z
    .string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(20, 'El código no puede exceder 20 caracteres')
    .regex(/^[A-Z0-9]+$/, 'El código solo puede contener letras mayúsculas y números')
    .transform((val) => val.toUpperCase()),
  descripcion: z
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  tipo: z.enum(['porcentaje', 'monto']),
  valor: z
    .number()
    .min(1, 'El valor debe ser mayor a 0'),
  usosMaximos: z
    .number()
    .min(1, 'Debe permitir al menos 1 uso')
    .optional()
    .nullable(),
  fechaInicio: z.date(),
  fechaFin: z.date(),
  activo: z.boolean(),
  eventosAplicables: z.array(z.string()).optional(),
}).refine((data) => {
  // Validar que el valor de porcentaje no sea mayor a 100
  if (data.tipo === 'porcentaje' && data.valor > 100) {
    return false
  }
  return true
}, {
  message: 'El porcentaje no puede ser mayor a 100%',
  path: ['valor'],
}).refine((data) => {
  // Validar que la fecha de fin sea posterior a la de inicio
  return data.fechaFin > data.fechaInicio
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['fechaFin'],
})

export type DescuentoFormData = z.infer<typeof descuentoSchema>
