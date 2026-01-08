'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormData } from '@/lib/validations/checkout.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ContactInfoStepProps {
  form: UseFormReturn<CheckoutFormData>
}

export default function ContactInfoStep({ form }: ContactInfoStepProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="Juan"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Apellido <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Pérez"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="juan@ejemplo.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
        <p className="text-sm text-gray-500">
          Recibirás la confirmación de tu compra en este correo
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">
          Teléfono / WhatsApp <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          {...register('phone')}
          placeholder="+52 123 456 7890"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
        <p className="text-sm text-gray-500">
          Te contactaremos por este medio en caso de ser necesario
        </p>
      </div>
    </div>
  )
}
