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
        // Establecer cookie de sesión para el middleware
        document.cookie = `__session=${firebaseUser.uid}; path=/; max-age=604800; SameSite=Lax`

        // Obtener perfil del usuario
        const profile = await getUserProfile(firebaseUser.uid)
        setUserProfile(profile)
      } else {
        // Eliminar cookie de sesión si no hay usuario
        document.cookie = '__session=; path=/; max-age=0'
        setUserProfile(null)
      }

      setLoading(false)
      setInitialized(true)
    })

    return () => unsubscribe()
  }, [setUser, setUserProfile, setLoading, setInitialized])

  // Helper para redirigir según el rol del usuario
  const redirectByRole = async (uid: string) => {
    const profile = await getUserProfile(uid)

    if (!profile) {
      // Si no hay perfil, redirigir a una página de error o configuración
      router.push('/dashboard/cliente')
      return
    }

    // Mapeo de roles a rutas
    const roleRoutes: Record<string, string> = {
      admin: '/dashboard/admin',
      host: '/dashboard/host',
      cliente: '/dashboard/cliente',
    }

    const route = roleRoutes[profile.rol] || '/dashboard/cliente'
    router.push(route)
  }

  // Login con email y contraseña
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const userCredential = await loginWithEmail(email, password)

      // Establecer cookie de sesión para el middleware
      document.cookie = `__session=${userCredential.user.uid}; path=/; max-age=604800; SameSite=Lax`

      toast.success('¡Bienvenido de vuelta!')
      await redirectByRole(userCredential.user.uid)
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
      const userCredential = await loginWithGoogle()

      // Establecer cookie de sesión para el middleware
      document.cookie = `__session=${userCredential.user.uid}; path=/; max-age=604800; SameSite=Lax`

      toast.success('¡Bienvenido!')
      await redirectByRole(userCredential.user.uid)
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
      const userCredential = await loginWithGithub()

      // Establecer cookie de sesión para el middleware
      document.cookie = `__session=${userCredential.user.uid}; path=/; max-age=604800; SameSite=Lax`

      toast.success('¡Bienvenido!')
      await redirectByRole(userCredential.user.uid)
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
      const user = await registerWithEmail(data)

      // Establecer cookie de sesión para el middleware
      document.cookie = `__session=${user.uid}; path=/; max-age=604800; SameSite=Lax`

      toast.success('¡Cuenta creada exitosamente!')
      await redirectByRole(user.uid)
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

      // Eliminar cookie de sesión
      document.cookie = '__session=; path=/; max-age=0'

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
