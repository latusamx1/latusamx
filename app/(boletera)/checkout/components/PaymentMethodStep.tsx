'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormData } from '@/lib/validations/checkout.schema'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, DollarSign } from 'lucide-react'

interface PaymentMethodStepProps {
  form: UseFormReturn<CheckoutFormData>
}

export default function PaymentMethodStep({ form }: PaymentMethodStepProps) {
  const { register, formState: { errors }, watch, setValue } = form
  const paymentMethod = watch('paymentMethod')

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '')
    value = value.replace(/(\d{4})/g, '$1 ').trim()
    setValue('cardNumber', value)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setValue('cardExpiry', value)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setValue('cardCvv', value)
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <Label>
          Método de Pago <span className="text-red-500">*</span>
        </Label>

        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setValue('paymentMethod', value as 'card' | 'paypal' | 'mercadopago')}
        >
          {/* Tarjeta de Crédito/Débito */}
          <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
              <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
              <span className="font-medium">Tarjeta de Crédito / Débito</span>
            </Label>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-1 bg-blue-50 rounded">VISA</span>
              <span className="px-2 py-1 bg-red-50 rounded">MC</span>
            </div>
          </div>

          {/* PayPal */}
          <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center flex-1 cursor-pointer">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              <span className="font-medium">PayPal</span>
            </Label>
          </div>

          {/* Mercado Pago */}
          <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
            <RadioGroupItem value="mercadopago" id="mercadopago" />
            <Label htmlFor="mercadopago" className="flex items-center flex-1 cursor-pointer">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.35 3.745-2.995 6.705-6.38 7.133-2.153.272-4.256-.544-5.748-2.229-.41-.463-.165-1.18.425-1.244l.115-.013c.486-.053.932.265 1.181.687.915 1.548 2.847 2.243 4.61 1.658 1.955-.648 3.282-2.607 3.12-4.607-.146-1.795-1.558-3.248-3.346-3.44-1.246-.133-2.45.306-3.317 1.207-.236.245-.613.253-.859.018l-.013-.013c-.246-.235-.253-.622-.017-.868 1.128-1.172 2.726-1.793 4.394-1.706 2.34.122 4.302 1.944 4.835 4.417z" fill="#009EE3"/>
              </svg>
              <span className="font-medium">Mercado Pago</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Card Details (only show if card is selected) */}
      {paymentMethod === 'card' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">
              Número de Tarjeta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cardNumber"
              {...register('cardNumber')}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={errors.cardNumber ? 'border-red-500' : ''}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">
                Fecha de Vencimiento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardExpiry"
                {...register('cardExpiry')}
                onChange={handleExpiryChange}
                placeholder="MM/AA"
                maxLength={5}
                className={errors.cardExpiry ? 'border-red-500' : ''}
              />
              {errors.cardExpiry && (
                <p className="text-sm text-red-500">{errors.cardExpiry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardCvv">
                CVV <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardCvv"
                {...register('cardCvv')}
                onChange={handleCvvChange}
                placeholder="123"
                maxLength={4}
                type="password"
                className={errors.cardCvv ? 'border-red-500' : ''}
              />
              {errors.cardCvv && (
                <p className="text-sm text-red-500">{errors.cardCvv.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">
              Nombre en la Tarjeta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cardName"
              {...register('cardName')}
              placeholder="JUAN PEREZ"
              className={errors.cardName ? 'border-red-500' : ''}
            />
            {errors.cardName && (
              <p className="text-sm text-red-500">{errors.cardName.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">Pago seguro</p>
            <p className="text-sm text-blue-700 mt-1">
              Tu información de pago está protegida con encriptación de 256 bits
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
