'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { InputWithIcon } from '@/components/auth/InputWithIcon'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { sendPasswordResetEmail } from '@/lib/firebase/auth'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(data.email)
      setEmailSent(true)
      toast.success('Email enviado', {
        description: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
      })
    } catch (error: any) {
      console.error('Error al enviar email de recuperación:', error)

      // Mensajes de error específicos
      if (error.code === 'auth/user-not-found') {
        toast.error('Usuario no encontrado', {
          description: 'No existe una cuenta con este correo electrónico',
        })
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email inválido', {
          description: 'Por favor verifica el formato del email',
        })
      } else {
        toast.error('Error al enviar email', {
          description: 'Ocurrió un error. Por favor intenta de nuevo',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <AuthLayout
        title="Email Enviado"
        subtitle="Revisa tu bandeja de entrada"
        type="login"
      >
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Email enviado exitosamente
          </h3>
          <p className="text-gray-600 mb-4">
            Hemos enviado un email a <strong>{getValues('email')}</strong> con instrucciones
            para restablecer tu contraseña.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Si no recibes el email en los próximos minutos, revisa tu carpeta de spam.
          </p>

          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Volver al inicio de sesión
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Enviar de nuevo
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Ingresa tu email para recibir instrucciones"
      type="login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Te enviaremos un email con un enlace para restablecer tu
            contraseña.
          </p>
        </div>

        <InputWithIcon
          label="Correo Electrónico"
          type="email"
          icon={Mail}
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Enviando...' : 'Enviar Email de Recuperación'}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
