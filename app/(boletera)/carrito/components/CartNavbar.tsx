import Link from 'next/link'

export default function CartNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">BT</span>
            </div>
            <span className="ml-3 font-bold text-gray-900">Big Texas BBQ</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
