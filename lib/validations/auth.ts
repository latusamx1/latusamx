import { z } from 'zod'

/**
 * Schema de validación para Login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('El correo electrónico no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  remember: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Schema de validación para Registro
 */
export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres'),
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('El correo electrónico no es válido'),
    telefono: z
      .string()
      .min(1, 'El teléfono es requerido')
      .regex(/^[\d\s\+\-\(\)]+$/, 'El teléfono solo puede contener números y símbolos válidos')
      .min(10, 'El teléfono debe tener al menos 10 dígitos'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Schema de validación para recuperar contraseña
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('El correo electrónico no es válido'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

/**
 * Schema de validación para restablecer contraseña
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
