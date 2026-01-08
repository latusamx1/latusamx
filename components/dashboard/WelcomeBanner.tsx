interface WelcomeBannerProps {
  userName: string
  message?: string
}

export default function WelcomeBanner({ userName, message }: WelcomeBannerProps) {
  const defaultMessage = `Bienvenido a tu centro de control. Aquí puedes gestionar tus tickets, reservas y preferencias.`

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
      <h2 className="text-2xl font-bold mb-2">Hola, {userName}!</h2>
      <p className="opacity-90">{message || defaultMessage}</p>
    </div>
  )
}
