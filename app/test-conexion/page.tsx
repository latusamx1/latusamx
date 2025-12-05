'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Loader2, Upload } from 'lucide-react'
import { db, auth } from '@/lib/firebase/config'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { ImageUpload } from '@/components/shared/ImageUpload'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
}

export default function TestConexionPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Conexión Firebase', status: 'pending', message: 'Verificando...' },
    { name: 'Conexión Firestore', status: 'pending', message: 'Verificando...' },
    { name: 'Autenticación Firebase', status: 'pending', message: 'Verificando...' },
    { name: 'CRUD Firestore', status: 'pending', message: 'Verificando...' },
    { name: 'Cloudinary Upload', status: 'pending', message: 'Verificando...' },
  ])

  const [imageUrl, setImageUrl] = useState('')
  const [imagePublicId, setImagePublicId] = useState('')

  const updateTest = (index: number, status: TestResult['status'], message: string) => {
    setTests((prev) =>
      prev.map((test, i) => (i === index ? { ...test, status, message } : test))
    )
  }

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    // Test 1: Conexión Firebase
    try {
      if (auth && db) {
        updateTest(0, 'success', '✅ Firebase inicializado correctamente')
      } else {
        updateTest(0, 'error', '❌ Firebase no está inicializado')
      }
    } catch (error: any) {
      updateTest(0, 'error', `❌ Error: ${error.message}`)
    }

    // Test 2: Conexión Firestore
    try {
      const usuariosRef = collection(db, 'usuarios')
      const snapshot = await getDocs(usuariosRef)
      updateTest(
        1,
        'success',
        `✅ Firestore conectado - ${snapshot.size} usuarios encontrados`
      )
    } catch (error: any) {
      updateTest(1, 'error', `❌ Error Firestore: ${error.message}`)
    }

    // Test 3: Autenticación Firebase
    try {
      // Intentar login con credenciales de prueba
      const testEmail = 'admin@sistema.com'
      const testPassword = 'Admin123!' // Asegúrate de haber creado este usuario

      try {
        await signInWithEmailAndPassword(auth, testEmail, testPassword)
        updateTest(
          2,
          'success',
          `✅ Autenticación exitosa como ${auth.currentUser?.email}`
        )
        // Cerrar sesión después de probar
        await signOut(auth)
      } catch (authError: any) {
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password') {
          updateTest(
            2,
            'error',
            '⚠️ Usuario de prueba no encontrado. Crea un usuario admin@sistema.com con password Admin123!'
          )
        } else {
          throw authError
        }
      }
    } catch (error: any) {
      updateTest(2, 'error', `❌ Error Auth: ${error.message}`)
    }

    // Test 4: CRUD Firestore
    try {
      const testCollection = collection(db, 'test_temporal')

      // Crear documento
      const docRef = await addDoc(testCollection, {
        test: true,
        timestamp: new Date(),
        message: 'Test de escritura',
      })

      // Leer documento
      const snapshot = await getDocs(testCollection)
      const found = snapshot.docs.find((d) => d.id === docRef.id)

      if (found) {
        // Eliminar documento
        await deleteDoc(doc(db, 'test_temporal', docRef.id))
        updateTest(4, 'success', '✅ CRUD completo: Crear, Leer y Eliminar funcionan')
      } else {
        updateTest(3, 'error', '❌ No se pudo leer el documento creado')
      }
    } catch (error: any) {
      updateTest(3, 'error', `❌ Error CRUD: ${error.message}`)
    }
  }

  const handleImageUpload = (url: string, publicId: string) => {
    setImageUrl(url)
    setImagePublicId(publicId)
    updateTest(4, 'success', '✅ Cloudinary funcionando correctamente')
  }

  const handleImageRemove = () => {
    setImageUrl('')
    setImagePublicId('')
    updateTest(4, 'pending', 'Sube una imagen para probar')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Test de Conexión - Sistema BBQ Josué
          </h1>
          <p className="text-gray-600">
            Verificando que Firebase y Cloudinary estén configurados correctamente
          </p>
        </div>

        {/* Tests de Firebase */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tests Automáticos</h2>
          <div className="space-y-4">
            {tests.slice(0, 4).map((test, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {test.status === 'pending' && (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  )}
                  {test.status === 'success' && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {test.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                  <p
                    className={`text-sm mt-1 ${
                      test.status === 'success'
                        ? 'text-green-600'
                        : test.status === 'error'
                          ? 'text-red-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {test.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={runTests}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Ejecutar Tests Nuevamente
          </button>
        </div>

        {/* Test de Cloudinary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Test Manual - Cloudinary Upload
          </h2>

          <div className="mb-4">
            <div
              className={`flex items-start gap-3 p-4 border border-gray-200 rounded-lg ${
                tests[4].status === 'success' ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {tests[4].status === 'pending' && <Upload className="h-5 w-5 text-gray-400" />}
                {tests[4].status === 'success' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Cloudinary Upload</h3>
                <p
                  className={`text-sm mt-1 ${
                    tests[4].status === 'success' ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {tests[4].message}
                </p>
              </div>
            </div>
          </div>

          <ImageUpload
            value={imageUrl}
            onChange={handleImageUpload}
            onRemove={handleImageRemove}
            folder="EVENTOS"
            preview={{
              width: 400,
              height: 300,
              aspectRatio: '4/3',
            }}
            placeholder="Arrastra una imagen aquí o haz clic para seleccionar"
          />

          {imageUrl && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                <strong>URL:</strong>
              </p>
              <p className="text-xs text-gray-500 break-all mb-2">{imageUrl}</p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Public ID:</strong>
              </p>
              <p className="text-xs text-gray-500 break-all">{imagePublicId}</p>
            </div>
          )}
        </div>

        {/* Información de Configuración */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📊 Información de Configuración
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Firebase Project ID:</span>
              <span className="font-mono text-gray-900">
                {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'No configurado'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Firebase Auth Domain:</span>
              <span className="font-mono text-gray-900 text-xs">
                {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'No configurado'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Cloudinary Cloud Name:</span>
              <span className="font-mono text-gray-900">
                {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'No configurado'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">App URL:</span>
              <span className="font-mono text-gray-900">
                {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
              </span>
            </div>
          </div>
        </div>

        {/* Enlaces útiles */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Enlaces Útiles</h2>
          <div className="space-y-2">
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              → Firebase Console
            </a>
            <a
              href="https://cloudinary.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              → Cloudinary Dashboard
            </a>
            <a
              href="/"
              className="block text-blue-600 hover:text-blue-800 hover:underline"
            >
              → Volver a Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
