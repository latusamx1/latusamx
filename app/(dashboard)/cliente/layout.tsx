import { PublicFooter } from '@/components/landing/PublicFooter'
import { PublicHeader } from '@/components/landing/PublicHeader'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi Cuenta | Big Texas BBQ',
  description: 'Dashboard del cliente',
}

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader/>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
      <PublicFooter/>
    </>
  )
}
