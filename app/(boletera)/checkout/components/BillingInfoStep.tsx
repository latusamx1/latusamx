'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormData } from '@/lib/validations/checkout.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

interface BillingInfoStepProps {
  form: UseFormReturn<CheckoutFormData>
}

export default function BillingInfoStep({ form }: BillingInfoStepProps) {
  const { register, formState: { errors }, watch, setValue } = form
  const needInvoice = watch('needInvoice')
  const acceptTerms = watch('acceptTerms')

  return (
    <div className="space-y-6">
      {/* Invoice Toggle */}
      <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4">
        <Checkbox
          id="needInvoice"
          checked={needInvoice}
          onCheckedChange={(checked) => setValue('needInvoice', checked as boolean)}
        />
        <Label htmlFor="needInvoice" className="cursor-pointer font-medium">
          Requiero factura
        </Label>
      </div>

      {/* Invoice Fields (only show if needInvoice is true) */}
      {needInvoice && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="rfc">
              RFC <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rfc"
              {...register('rfc')}
              placeholder="XAXX010101000"
              maxLength={13}
              className={errors.rfc ? 'border-red-500' : ''}
            />
            {errors.rfc && (
              <p className="text-sm text-red-500">{errors.rfc.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">
              Razón Social <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="Mi Empresa S.A. de C.V."
              className={errors.company ? 'border-red-500' : ''}
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Dirección Fiscal <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Calle, Número, Colonia, Ciudad, Estado, C.P."
              rows={3}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Nota:</span> La factura se enviará a tu correo electrónico
              dentro de las próximas 24 horas.
            </p>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
            className={errors.acceptTerms ? 'border-red-500' : ''}
          />
          <div className="flex-1">
            <Label htmlFor="acceptTerms" className="cursor-pointer font-normal">
              Acepto los{' '}
              <a href="/terminos" target="_blank" className="text-blue-600 hover:underline font-medium">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="/privacidad" target="_blank" className="text-blue-600 hover:underline font-medium">
                política de privacidad
              </a>{' '}
              <span className="text-red-500">*</span>
            </Label>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 mt-1">{errors.acceptTerms.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-gray-900">Información importante:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>Recibirás tus tickets por correo electrónico inmediatamente después del pago</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>Los tickets incluyen un código QR único que será escaneado en el evento</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>Puedes presentar tus tickets desde tu dispositivo móvil o impresos</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">⚠</span>
            <span>Los tickets no son reembolsables una vez procesada la compra</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
