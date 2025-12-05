import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
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
 * Recuperar contraseña
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code))
  }
}

/**
 * Obtener perfil de usuario desde Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
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
  }

  return errorMessages[errorCode] || 'Error de autenticación'
}
