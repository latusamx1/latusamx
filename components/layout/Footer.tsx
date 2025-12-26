/**
 * Footer global con links y contacto
 */

'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Navegación': [
      { href: '/', label: 'Inicio' },
      { href: '/eventos', label: 'Eventos' },
      { href: '/reservas', label: 'Reservar Mesa' },
    ],
    'Legal': [
      { href: '/terminos', label: 'Términos y Condiciones' },
      { href: '/privacidad', label: 'Política de Privacidad' },
      { href: '/cookies', label: 'Política de Cookies' },
    ],
    'Soporte': [
      { href: '/ayuda', label: 'Centro de Ayuda' },
      { href: '/contacto', label: 'Contacto' },
      { href: '/faq', label: 'Preguntas Frecuentes' },
    ],
  }

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-fit w-fit p-2 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-xl">
                LATUSAMX
              </div>
            </div>
            
            {/* Contacto */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-600" />
                <span>+52 123-123-1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-600" />
                <span>latusamx1@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>Monterrey, Nuevo Leon, Mexico</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} LATUSAMX. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/terminos" className="hover:text-red-600 transition-colors">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-red-600 transition-colors">
              Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-red-600 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
