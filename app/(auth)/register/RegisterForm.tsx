'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User, Phone } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { InputWithIcon } from '@/components/auth/InputWithIcon'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/lib/hooks/useAuth'
import { registerSchema, RegisterFormData } from '@/lib/validations/auth'

export function RegisterForm() {
  const { register: registerUser, loginGoogle, loginGithub, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        telefono: data.telefono,
        rol: 'cliente',
      })
    } catch (error) {
      // Error ya manejado en useAuth con toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await loginGoogle()
    } catch (error) {
      // Error ya manejado en useAuth
    }
  }

  const handleGithubSignIn = async () => {
    try {
      await loginGithub()
    } catch (error) {
      // Error ya manejado en useAuth
    }
  }

  return (
    <AuthLayout
      type="register"
      title="Crea tu cuenta"
      subtitle="Comienza gratis, sin tarjeta de crédito"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nombre */}
          <InputWithIcon
            id="nombre"
            label="Nombre completo"
            type="text"
            icon={User}
            placeholder="Juan Pérez"
            error={errors.nombre?.message}
            {...register('nombre')}
          />

          {/* Email */}
          <InputWithIcon
            id="email"
            label="Correo Electrónico"
            type="email"
            icon={Mail}
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Teléfono */}
          <InputWithIcon
            id="telefono"
            label="Teléfono"
            type="tel"
            icon={Phone}
            placeholder="+52 123 456 7890"
            error={errors.telefono?.message}
            {...register('telefono')}
          />

          {/* Password */}
          <PasswordInput
            id="password"
            label="Contraseña"
            placeholder="••••••••"
            helperText="Mínimo 8 caracteres, incluye mayúscula, minúscula y número"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Confirm Password */}
          <PasswordInput
            id="confirmPassword"
            label="Confirmar Contraseña"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {/* Terms */}
          <div className="flex items-start">
            <Checkbox id="terms" {...register('terms')} />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
              Acepto los{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Política de Privacidad
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600 -mt-4">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>

          {/* Social Auth */}
          <SocialAuthButtons
            onGoogleSignIn={handleGoogleSignIn}
            onGithubSignIn={handleGithubSignIn}
            isLoading={isSubmitting || isLoading}
          />
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
