import { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Registrarse | Latuxamx',
  description: 'Crea tu cuenta para gestionar tus eventos',
}

export default function RegisterPage() {
  return <RegisterForm />
}
