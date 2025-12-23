import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
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
function validateConfig() {
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
}

// Inicializar Firebase solo en el cliente
function initializeFirebaseApp(): FirebaseApp {
  // Validar configuración
  validateConfig()

  // Si ya existe una app inicializada, retornarla
  const apps = getApps()
  if (apps.length > 0) {
    return apps[0]
  }

  // Inicializar nueva app
  return initializeApp(firebaseConfig)
}

// Exportar app - se inicializa al importar este módulo
export const app = initializeFirebaseApp()

// Exportar auth - se inicializa al importar este módulo
export const auth: Auth = getAuth(app)

// Exportar db - se inicializa al importar este módulo
export const db: Firestore = getFirestore(app)

export default app
