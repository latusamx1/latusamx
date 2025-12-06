'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'
import { verifyResetCode, confirmNewPassword } from '@/lib/firebase/auth'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const oobCode = searchParams.get('oobCode') // Código de Firebase

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Verificar el código al cargar
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setCodeError('Código de verificación no encontrado')
        setIsVerifying(false)
        return
      }

      try {
        const userEmail = await verifyResetCode(oobCode)
        setEmail(userEmail)
        setIsVerifying(false)
      } catch (error: any) {
        console.error('Error al verificar código:', error)
        setCodeError(error.message || 'El enlace es inválido o ha expirado')
        setIsVerifying(false)
      }
    }

    verifyCode()
  }, [oobCode])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) {
      toast.error('Código inválido')
      return
    }

    setIsLoading(true)
    try {
      await confirmNewPassword(oobCode, data.password)
      setPasswordChanged(true)
      toast.success('Contraseña restablecida', {
        description: 'Tu contraseña ha sido cambiada exitosamente',
      })

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error)
      toast.error('Error al restablecer contraseña', {
        description: error.message || 'Por favor intenta de nuevo',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Estado de verificación
  if (isVerifying) {
    return (
      <AuthLayout
        title="Verificando"
        subtitle="Verificando tu enlace de recuperación..."
        type="login"
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando enlace...</p>
        </div>
      </AuthLayout>
    )
  }

  // Error en el código
  if (codeError) {
    return (
      <AuthLayout
        title="Enlace Inválido"
        subtitle="No se pudo verificar tu enlace"
        type="login"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enlace inválido o expirado
          </h3>
          <p className="text-gray-600 mb-6">{codeError}</p>

          <div className="space-y-3">
            <Button type="button" onClick={() => router.push('/forgot-password')} className="w-full">
              Solicitar nuevo enlace
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  // Contraseña cambiada exitosamente
  if (passwordChanged) {
    return (
      <AuthLayout
        title="¡Listo!"
        subtitle="Tu contraseña ha sido restablecida"
        type="login"
      >
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contraseña restablecida exitosamente
          </h3>
          <p className="text-gray-600 mb-6">
            Tu contraseña ha sido cambiada. Redirigiendo al inicio de sesión...
          </p>

          <Button type="button" onClick={() => router.push('/login')} className="w-full">
            Ir al inicio de sesión
          </Button>
        </div>
      </AuthLayout>
    )
  }

  // Formulario de nueva contraseña
  return (
    <AuthLayout
      title="Nueva Contraseña"
      subtitle={`Restableciendo contraseña para ${email}`}
      type="login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Consejo:</strong> Usa una contraseña segura con al menos 8 caracteres,
            incluyendo mayúsculas, minúsculas y números.
          </p>
        </div>

        <PasswordInput
          label="Nueva Contraseña"
          placeholder="••••••••"
          error={errors.password?.message}
          helperText="Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
          {...register('password')}
        />

        <PasswordInput
          label="Confirmar Nueva Contraseña"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
        </Button>
      </form>
    </AuthLayout>
  )
}
