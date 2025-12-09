import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center text-white px-4">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
          <span className="text-4xl font-bold">BT</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4">CRM BBQ Josué</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Sistema completo para venta de tickets y gestión de eventos
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button size="lg" variant="secondary" className="w-48 h-12 text-base">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              className="w-48 h-12 text-base bg-white text-blue-600 hover:bg-white/90"
            >
              Registrarse
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-white/80">
          <Link href="/test-conexion" className="hover:text-white underline">
            Página de pruebas
          </Link>
        </div>
      </div>
    </div>
  )
}
