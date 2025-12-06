import { Metadata } from 'next'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | Latuxamx',
  description: 'Recupera el acceso a tu cuenta',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
