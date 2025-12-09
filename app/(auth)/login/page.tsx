import { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | CRM BBQ Josué',
  description: 'Ingresa a tu cuenta para gestionar tus eventos',
}

export default function LoginPage() {
  return <LoginForm />
}
