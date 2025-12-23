import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Variables para almacenar las instancias
let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

// Función para inicializar Firebase
function initializeFirebase(): FirebaseApp {
  // Validar que todas las variables de entorno estén configuradas
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error('❌ Firebase no está configurado correctamente. Variables faltantes:', {
      apiKey: !!firebaseConfig.apiKey,
      authDomain: !!firebaseConfig.authDomain,
      projectId: !!firebaseConfig.projectId,
    })
    throw new Error(
      '❌ Firebase no está configurado correctamente. Verifica tu archivo .env.local'
    )
  }

  // Si ya está inicializado, devolver la app existente
  if (app) {
    return app
  }

  // Inicializar Firebase (evitar múltiples inicializaciones)
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    return app
  } catch (error) {
    console.error('Error al inicializar Firebase:', error)
    throw error
  }
}

// Función para obtener Auth
function getAuthInstance(): Auth {
  if (!authInstance) {
    const app = initializeFirebase()
    authInstance = getAuth(app)
  }
  return authInstance
}

// Función para obtener Firestore
function getDbInstance(): Firestore {
  if (!dbInstance) {
    const app = initializeFirebase()
    dbInstance = getFirestore(app)
  }
  return dbInstance
}

// Exportar servicios de Firebase usando getters
export const auth = new Proxy({} as Auth, {
  get(_, prop) {
    return getAuthInstance()[prop as keyof Auth]
  },
})

export const db = new Proxy({} as Firestore, {
  get(_, prop) {
    return getDbInstance()[prop as keyof Firestore]
  },
})

// Exportar la app
export default initializeFirebase()
