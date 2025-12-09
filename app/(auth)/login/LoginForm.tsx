'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { InputWithIcon } from '@/components/auth/InputWithIcon'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/lib/hooks/useAuth'
import { loginSchema, LoginFormData } from '@/lib/validations/auth'

export function LoginForm() {
  const { login, loginGoogle, loginGithub, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
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
      type="login"
      title="Bienvenido de nuevo"
      subtitle="Ingresa a tu cuenta para continuar"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Password */}
          <PasswordInput
            id="password"
            label="Contraseña"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember" {...register('remember')} />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600 cursor-pointer select-none"
              >
                Recordarme
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          {/* Social Auth */}
          <SocialAuthButtons
            onGoogleSignIn={handleGoogleSignIn}
            onGithubSignIn={handleGithubSignIn}
            isLoading={isSubmitting || isLoading}
          />
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Regístrate gratis
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
