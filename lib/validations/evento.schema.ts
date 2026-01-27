import { z } from 'zod'

/**
 * Schema de validación para Tipo de Ticket
 */
export const tipoTicketSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  cantidad: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  disponibles: z.number().int().min(0).optional(),
  ventaMinima: z.number().int().min(1).optional(),
  ventaMaxima: z.number().int().min(1).optional(),
  orden: z.number().int().min(0).optional(),
})

/**
 * Schema de validación para crear/editar evento
 */
export const eventoSchema = z.object({
  // Información Básica
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  descripcion: z.string().min(100, 'La descripción debe tener al menos 100 caracteres'),
  categoria: z.enum(['concierto', 'deportes', 'teatro', 'festival', 'otro'], {
    required_error: 'Selecciona una categoría',
  }),
  imagen: z.string().optional(),
  imagenPortada: z.string().optional(),
  imagenPublicId: z.string().optional(),

  // Fecha y Ubicación
  fecha: z.date({
    required_error: 'La fecha es requerida',
    invalid_type_error: 'Fecha inválida',
  }),
  fechaFin: z.date().optional().nullable(),
  horaInicio: z.string().min(1, 'La hora de inicio es requerida'),
  horaFin: z.string().optional(),
  venueId: z.string().min(1, 'Selecciona un lugar'),

  // Tipos de Tickets
  tiposTickets: z.array(tipoTicketSchema).min(1, 'Debe haber al menos un tipo de ticket'),

  // Configuración Adicional
  estado: z.enum(['borrador', 'publicado', 'pausado', 'cancelado', 'finalizado']).default('borrador'),
  destacado: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),
  artistas: z.array(z.string()).optional(),
})
  .refine(
    (data) => {
      // Si hay fecha fin, debe ser posterior a fecha inicio
      if (data.fechaFin && data.fecha) {
        return data.fechaFin >= data.fecha
      }
      return true
    },
    {
      message: 'La fecha de finalización debe ser posterior a la fecha de inicio',
      path: ['fechaFin'],
    }
  )
  .refine(
    (data) => {
      // Si hay hora fin, validar que sea posterior a hora inicio (si es el mismo día)
      if (data.horaFin && data.horaInicio && !data.fechaFin) {
        const [horaInicio, minInicio] = data.horaInicio.split(':').map(Number)
        const [horaFin, minFin] = data.horaFin.split(':').map(Number)
        const minutosInicio = horaInicio * 60 + minInicio
        const minutosFin = horaFin * 60 + minFin
        return minutosFin > minutosInicio
      }
      return true
    },
    {
      message: 'La hora de finalización debe ser posterior a la hora de inicio',
      path: ['horaFin'],
    }
  )

export type TipoTicketFormData = z.infer<typeof tipoTicketSchema>
export type EventoFormData = z.infer<typeof eventoSchema>
