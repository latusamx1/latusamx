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

// Inicializar Firebase (evitar múltiples inicializaciones)
let app: FirebaseApp
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error('Error al inicializar Firebase:', error)
  throw error
}

// Inicializar servicios de Firebase
let authInstance: Auth
let dbInstance: Firestore

try {
  authInstance = getAuth(app)
  dbInstance = getFirestore(app)
} catch (error) {
  console.error('Error al inicializar servicios de Firebase:', error)
  throw error
}

// Exportar servicios de Firebase
export const auth: Auth = authInstance
export const db: Firestore = dbInstance

export default app
