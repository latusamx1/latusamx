/**
 * Header público para landing page y páginas no autenticadas
 */

'use client'

import Link from 'next/link'
import { LogOut, Menu, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useUserRole } from '@/lib/hooks/usePermissions'
import { Badge } from '../ui/badge'
import { ROL_COLORS, ROL_LABELS } from '@/types/roles.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { userProfile, logout } = useAuth()
  const userRole = useUserRole()

  const handleLogout = async () => {
    await logout()
  }

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
            <a href="/eventos" className="text-gray-600 hover:text-gray-900 transition-colors">
              Eventos
            </a>
            <a href="#reservas" className="text-gray-600 hover:text-gray-900 transition-colors">
              Reservas
            </a>
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Características
            </a>

            {userRole && (
              <Badge variant="outline" className={ROL_COLORS[userRole]}>
                {ROL_LABELS[userRole]}
              </Badge>
            )}
            {
              userProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative w-fit h-fit p-2 rounded-full">
                      <div className="flex w-fit h-fit px-3 py-2 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {userProfile?.nombre?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile?.nombre}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/register">
                  <Button>Comenzar</Button>
                </Link>
              </>
            }

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
