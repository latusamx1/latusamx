import { z } from 'zod'

// Schema para información de contacto
export const contactInfoSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido').regex(/^\+?[\d\s()-]+$/, 'Formato de teléfono inválido'),
})

// Schema para información de pago
export const paymentInfoSchema = z.object({
  paymentMethod: z.enum(['card', 'paypal', 'mercadopago'], {
    required_error: 'Selecciona un método de pago',
  }),
  // Campos de tarjeta (opcionales si no se selecciona card)
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  cardName: z.string().optional(),
}).superRefine((data, ctx) => {
  // Si el método de pago es tarjeta, validar campos de tarjeta
  if (data.paymentMethod === 'card') {
    if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 13) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Número de tarjeta inválido',
        path: ['cardNumber'],
      })
    }
    if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Fecha de vencimiento inválida (MM/AA)',
        path: ['cardExpiry'],
      })
    }
    if (!data.cardCvv || data.cardCvv.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV inválido',
        path: ['cardCvv'],
      })
    }
    if (!data.cardName || data.cardName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nombre en la tarjeta requerido',
        path: ['cardName'],
      })
    }
  }
})

// Schema para información de facturación (opcional)
export const billingInfoSchema = z.object({
  needInvoice: z.boolean().optional().default(false),
  rfc: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
}).superRefine((data, ctx) => {
  // Si requiere factura, validar campos
  if (data.needInvoice) {
    if (!data.rfc || data.rfc.length < 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'RFC inválido',
        path: ['rfc'],
      })
    }
    if (!data.company || data.company.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Razón social requerida',
        path: ['company'],
      })
    }
    if (!data.address || data.address.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Dirección fiscal requerida',
        path: ['address'],
      })
    }
  }
})

// Schema completo del checkout
export const checkoutSchema = z.object({
  ...contactInfoSchema.shape,
  ...paymentInfoSchema.shape,
  ...billingInfoSchema.shape,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
})

export type ContactInfo = z.infer<typeof contactInfoSchema>
export type PaymentInfo = z.infer<typeof paymentInfoSchema>
export type BillingInfo = z.infer<typeof billingInfoSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
