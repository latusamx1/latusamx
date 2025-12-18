/**
 * Header público para páginas no autenticadas
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Calendar, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Inicio', icon: null },
    { href: '/eventos', label: 'Eventos', icon: Ticket },
    { href: '/reservas', label: 'Reservar Mesa', icon: Calendar },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-xl">
            BT
          </div>
          <span className="hidden font-bold text-xl sm:inline-block">
            <span className="text-gray-900">Big </span>
            <span className="text-red-600">Texas</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 transition-colors hover:text-red-600"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">Iniciar Sesión</Button>
          </Link>
          <Link href="/register">
            <Button>Registrarse</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-lg font-medium text-gray-700 transition-colors hover:text-red-600 py-2"
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{link.label}</span>
                  </Link>
                )
              })}

              <div className="border-t pt-4 space-y-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Registrarse</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
