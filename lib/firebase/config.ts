'use client'

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Inicializar solo en el cliente
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

if (typeof window !== 'undefined') {
  // Singleton: evita "Firebase App already exists"
  app = getApps().length ? getApp() : initializeApp(firebaseConfig)

  // Servicios básicos
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db }
export default app
