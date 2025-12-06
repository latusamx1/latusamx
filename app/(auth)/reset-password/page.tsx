import { Metadata } from 'next'
import { ResetPasswordForm } from './ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | Latuxamx',
  description: 'Crea una nueva contraseña para tu cuenta',
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
