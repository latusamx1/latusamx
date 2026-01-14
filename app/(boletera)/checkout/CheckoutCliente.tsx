'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/stores/cartStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations/checkout.schema'
import { toast } from 'sonner'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { PublicFooter } from '@/components/landing/PublicFooter'
import CheckoutBreadcrumb from './components/CheckoutBreadcrumb'
import ContactInfoStep from './components/ContactInfoStep'
import PaymentMethodStep from './components/PaymentMethodStep'
import BillingInfoStep from './components/BillingInfoStep'
import CheckoutSummary from './components/CheckoutSummary'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCliente() {
  const router = useRouter()
  const { items, getSubtotal, getDescuento, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardName: '',
      needInvoice: false,
      rfc: '',
      company: '',
      address: '',
      acceptTerms: false,
    },
    mode: 'onChange',
  })

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrito')
    }
  }, [items.length, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  // Cálculos
  const subtotal = getSubtotal()
  const cargoPorServicio = subtotal * 0.1
  const descuento = getDescuento()
  const total = subtotal + cargoPorServicio - descuento

  const steps = [
    { number: 1, title: 'Información de Contacto', component: ContactInfoStep },
    { number: 2, title: 'Método de Pago', component: PaymentMethodStep },
    { number: 3, title: 'Facturación (Opcional)', component: BillingInfoStep },
  ]

  const currentStepData = steps[currentStep - 1]

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = []

    switch (step) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phone']
        break
      case 2:
        fieldsToValidate = ['paymentMethod', 'cardNumber', 'cardExpiry', 'cardCvv', 'cardName']
        break
      case 3:
        fieldsToValidate = ['needInvoice', 'rfc', 'company', 'address']
        break
    }

    const result = await form.trigger(fieldsToValidate)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    } else {
      toast.error('Por favor completa todos los campos requeridos')
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)

    try {
      const { db } = await import('@/lib/firebase/config')
      const { collection, addDoc, Timestamp } = await import('firebase/firestore')
      const { useAuthStore } = await import('@/lib/stores/authStore')

      const user = useAuthStore.getState().user

      // Crear la orden en Firestore
      const ordenData = {
        userId: user?.uid || 'guest',
        eventoId: items[0]?.eventoId || '',
        items: items.map(item => ({
          tipoTicketId: item.tipoTicketId,
          nombre: item.tipoTicketNombre,
          precio: item.precio,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad,
        })),
        subtotal,
        descuento,
        total,
        codigoDescuento: null,
        metodoPago: data.paymentMethod,
        estado: 'pagada',
        datosComprador: {
          nombre: `${data.firstName} ${data.lastName}`,
          email: data.email,
          telefono: data.phone,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        pagadoAt: Timestamp.now(),
      }

      // Crear orden en Firestore
      const ordenRef = await addDoc(collection(db!, 'ordenes'), ordenData)
      console.log('Orden creada con ID:', ordenRef.id)

      // Generar tickets individuales
      const ticketsPromises = items.flatMap(item => {
        return Array.from({ length: item.cantidad }).map(async (_, index) => {
          const ticketData = {
            ordenId: ordenRef.id,
            eventoId: item.eventoId,
            tipoTicketId: item.tipoTicketId,
            tipoTicket: item.tipoTicketNombre,
            precio: item.precio,
            qrCode: `TICKET-${ordenRef.id}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            usado: false,
            createdAt: Timestamp.now(),
          }
          const ticketRef = await addDoc(collection(db!, 'tickets'), ticketData)
          console.log('Ticket creado:', ticketRef.id)
          return ticketRef
        })
      })

      // Esperar a que se creen todos los tickets
      await Promise.all(ticketsPromises)
      console.log('Todos los tickets creados exitosamente')

      // Limpiar carrito
      clearCart()

      // Mostrar mensaje de éxito
      toast.success('¡Compra realizada con éxito! Redirigiendo...')

      // Pequeña espera para que el usuario vea el mensaje
      await new Promise(resolve => setTimeout(resolve, 500))

      // Redirigir a página de confirmación con el ID de la orden
      console.log('Redirigiendo a confirmación con orden ID:', ordenRef.id)
      router.push(`/confirmacion/${ordenRef.id}`)
    } catch (error: any) {
      console.error('Error al procesar la compra:', error)
      toast.error(error?.message || 'Hubo un error al procesar tu compra. Intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  const StepComponent = currentStepData.component

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <CheckoutBreadcrumb />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Steps */}
            <div className="lg:col-span-2">
              {/* Steps Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            currentStep >= step.number
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {step.number}
                        </div>
                        <div className="ml-3 hidden md:block">
                          <p
                            className={`text-sm font-medium ${
                              currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                            }`}
                          >
                            Paso {step.number}
                          </p>
                          <p className="text-xs text-gray-500">{step.title}</p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-4 ${
                            currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentStepData.title}
                </h2>
                <StepComponent form={form} />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <div>
                  {currentStep === 1 ? (
                    <Button variant="outline" asChild>
                      <Link href="/carrito">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al carrito
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handlePrevious} type="button">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                  )}
                </div>

                <div>
                  {currentStep < steps.length ? (
                    <Button onClick={handleNext} type="button">
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || !form.watch('acceptTerms')}
                      className="min-w-[200px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>Pagar {formatPrice(total)}</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CheckoutSummary
                items={items}
                subtotal={subtotal}
                cargoPorServicio={cargoPorServicio}
                descuento={descuento}
                total={total}
              />
            </div>
          </div>
        </form>
      </div>

      <PublicFooter />
    </div>
  )
}
