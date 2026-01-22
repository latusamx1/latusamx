'use client'

import { DiagnosticoAuth } from '../seed/diagnostico-auth'
import { DiagnosticoFirebase } from '../seed/diagnostico'
import { TestPermissions } from '../test-permissions'

export default function DiagnosticoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">🔍 Diagnóstico del Sistema</h1>
          <p className="text-gray-600 mt-1">Verifica el estado de Firebase y permisos</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <DiagnosticoAuth />
        <DiagnosticoFirebase />
        <TestPermissions />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📚 Recursos Útiles</h3>
          <div className="space-y-2 text-sm">
            <a
              href="https://console.firebase.google.com/project/latusamx/firestore/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              → Abrir Reglas de Firestore en Firebase Console
            </a>
            <a
              href="https://console.firebase.google.com/project/latusamx/firestore/data"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              → Ver Datos en Firestore Database
            </a>
            <a
              href="/admin/seed"
              className="block text-blue-600 hover:underline"
            >
              → Ir a Herramientas de Seed
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
