import { z } from 'zod'

export const venueSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  direccion: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  ciudad: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  estado: z
    .string()
    .min(2, 'El estado debe tener al menos 2 caracteres')
    .max(100, 'El estado no puede exceder 100 caracteres'),
  codigoPostal: z
    .string()
    .min(4, 'El código postal debe tener al menos 4 caracteres')
    .max(10, 'El código postal no puede exceder 10 caracteres'),
  capacidad: z
    .number()
    .min(1, 'La capacidad debe ser al menos 1 persona')
    .max(100000, 'La capacidad no puede exceder 100,000 personas'),
  ubicacion: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  estadoVenue: z.enum(['activo', 'inactivo', 'mantenimiento']),
  telefono: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional(),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  sitioWeb: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
})

export type VenueFormData = z.infer<typeof venueSchema>
