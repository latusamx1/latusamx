'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../stores/authStore'
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithGithub,
  registerWithEmail,
  logout as firebaseLogout,
  resetPassword,
  getUserProfile,
  onAuthChanged,
  RegisterData,
} from '../firebase/auth'
import { toast } from 'sonner'

export function useAuth() {
  const router = useRouter()
  const { user, userProfile, isLoading, isInitialized, setUser, setUserProfile, setLoading, setInitialized, reset } = useAuthStore()

  // Inicializar listener de autenticación
  useEffect(() => {
    const unsubscribe = onAuthChanged(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Obtener perfil del usuario
        const profile = await getUserProfile(firebaseUser.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
      setInitialized(true)
    })

    return () => unsubscribe()
  }, [setUser, setUserProfile, setLoading, setInitialized])

  // Login con email y contraseña
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      await loginWithEmail(email, password)
      toast.success('¡Bienvenido de vuelta!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Login con Google
  const loginGoogle = async () => {
    try {
      setLoading(true)
      await loginWithGoogle()
      toast.success('¡Bienvenido!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Login con GitHub
  const loginGithub = async () => {
    try {
      setLoading(true)
      await loginWithGithub()
      toast.success('¡Bienvenido!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Registro
  const register = async (data: RegisterData) => {
    try {
      setLoading(true)
      await registerWithEmail(data)
      toast.success('¡Cuenta creada exitosamente!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      await firebaseLogout()
      reset()
      toast.success('Sesión cerrada')
      router.push('/login')
    } catch (error: any) {
      toast.error('Error al cerrar sesión')
      throw error
    }
  }

  // Recuperar contraseña
  const forgotPassword = async (email: string) => {
    try {
      await resetPassword(email)
      toast.success('Correo de recuperación enviado')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  return {
    user,
    userProfile,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    loginGoogle,
    loginGithub,
    register,
    logout,
    forgotPassword,
  }
}
