import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  User,
  UserCredential,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

// Tipos
export interface RegisterData {
  email: string
  password: string
  nombre: string
  telefono?: string
  rol?: 'admin' | 'host' | 'cliente'
}

export interface UserProfile {
  uid: string
  email: string
  nombre: string
  rol: 'admin' | 'host' | 'cliente'
  telefono?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Iniciar sesión con email y contraseña
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Registrar nuevo usuario
 */
export const registerWithEmail = async (data: RegisterData): Promise<User> => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    const user = userCredential.user

    // Actualizar perfil con nombre
    await updateProfile(user, {
      displayName: data.nombre,
    })

    // Crear documento en Firestore
    const userProfile: Omit<UserProfile, 'uid'> = {
      email: data.email,
      nombre: data.nombre,
      rol: data.rol || 'cliente',
      telefono: data.telefono,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    }

    await setDoc(doc(db, 'usuarios', user.uid), userProfile)

    return user
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Iniciar sesión con Google
 */
export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account',
    })
    const userCredential = await signInWithPopup(auth, provider)

    // Verificar si el usuario ya existe en Firestore
    const userProfile = await getUserProfile(userCredential.user.uid)

    // Si no existe, crear perfil
    if (!userProfile) {
      const newUserProfile: Omit<UserProfile, 'uid'> = {
        email: userCredential.user.email || '',
        nombre: userCredential.user.displayName || 'Usuario',
        rol: 'cliente',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      }

      await setDoc(doc(db, 'usuarios', userCredential.user.uid), newUserProfile)
    }

    return userCredential
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Iniciar sesión con GitHub
 */
export const loginWithGithub = async (): Promise<UserCredential> => {
  try {
    const provider = new GithubAuthProvider()
    provider.setCustomParameters({
      allow_signup: 'true',
    })
    const userCredential = await signInWithPopup(auth, provider)

    // Verificar si el usuario ya existe en Firestore
    const userProfile = await getUserProfile(userCredential.user.uid)

    // Si no existe, crear perfil
    if (!userProfile) {
      const newUserProfile: Omit<UserProfile, 'uid'> = {
        email: userCredential.user.email || '',
        nombre: userCredential.user.displayName || 'Usuario',
        rol: 'cliente',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      }

      await setDoc(doc(db, 'usuarios', userCredential.user.uid), newUserProfile)
    }

    return userCredential
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Cerrar sesión
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error('Error al cerrar sesión')
  }
}

/**
 * Enviar email de recuperación de contraseña
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Verificar código de reset de contraseña
 */
export const verifyResetCode = async (code: string): Promise<string> => {
  try {
    const email = await verifyPasswordResetCode(auth, code)
    return email
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Confirmar cambio de contraseña con código
 */
export const confirmNewPassword = async (
  code: string,
  newPassword: string
): Promise<void> => {
  try {
    await confirmPasswordReset(auth, code, newPassword)
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Obtener perfil de usuario desde Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    console.log('🔍 getUserProfile - db:', { db, type: typeof db, uid })
    const docRef = doc(db, 'usuarios', uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        uid,
        ...docSnap.data(),
      } as UserProfile
    }

    return null
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    return null
  }
}

/**
 * Observer de cambios de autenticación
 */
export const onAuthChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Obtener usuario actual
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

/**
 * Mensajes de error en español
 */
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'El correo electrónico no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Ya existe una cuenta con este correo',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/requires-recent-login': 'Vuelve a iniciar sesión para continuar',
    'auth/invalid-action-code': 'El enlace de recuperación es inválido o ha expirado',
    'auth/expired-action-code': 'El enlace de recuperación ha expirado',
  }

  return errorMessages[errorCode] || 'Error de autenticación'
}
