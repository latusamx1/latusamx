/**
 * Footer público para landing page
 */

'use client'

export function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-fit h-fit p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LATUSAMX</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">La solución completa para eventos y reservas</p>
          </div>

          {/* Producto */}
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#eventos" className="hover:text-white">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#reservas" className="hover:text-white">
                  Reservas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Soporte
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Sistema de Gestión. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
