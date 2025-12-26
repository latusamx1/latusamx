import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación (pero no verificamos rol aquí)
const protectedRoutes = ['/eventos', '/reservas', '/configuracion']

// Rutas de autenticación (no accesibles si ya está autenticado)
const authRoutes = ['/login', '/register']

// Rutas públicas
const publicRoutes = ['/', '/test-conexion']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener el token de autenticación de las cookies
  const sessionCookie = request.cookies.get('__session')
  const isAuthenticated = !!sessionCookie

  // Permitir acceso a todas las rutas de dashboard si está autenticado
  // La verificación de rol se hace en el cliente
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Si está autenticado, permitir acceso (el cliente redirigirá si el rol no coincide)
    return NextResponse.next()
  }

  // Si la ruta requiere autenticación y no está autenticado
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si la ruta es de autenticación y ya está autenticado
  if (authRoutes.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
}
