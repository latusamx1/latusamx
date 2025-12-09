import { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Registrarse | CRM BBQ Josué',
  description: 'Crea tu cuenta para gestionar tus eventos',
}

export default function RegisterPage() {
  return <RegisterForm />
}
