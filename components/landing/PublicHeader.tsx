/**
 * Header público para landing page y páginas no autenticadas
 */

'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-fit h-fit p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">LATUSAMX</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#eventos" className="text-gray-600 hover:text-gray-900 transition-colors">
              Eventos
            </a>
            <a href="#reservas" className="text-gray-600 hover:text-gray-900 transition-colors">
              Reservas
            </a>
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Características
            </a>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <Button>Comenzar</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            <a
              href="#eventos"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Eventos
            </a>
            <a
              href="#reservas"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reservas
            </a>
            <a
              href="#features"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Características
            </a>
            <Link
              href="/login"
              className="block text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link href="/register" className="block">
              <Button className="w-full">Comenzar</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
