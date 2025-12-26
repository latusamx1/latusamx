/**
 * Header para dashboard con información de usuario y logout
 */

'use client'

import { Menu, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/hooks/useAuth'
import { useUserRole } from '@/lib/hooks/usePermissions'
import { ROL_LABELS, ROL_COLORS } from '@/types/roles.types'

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { userProfile, logout } = useAuth()
  const userRole = useUserRole()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* Menu Button - Mobile */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo - Mobile */}
        <div className="flex items-center space-x-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-sm">
            BT
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Role Badge */}
        {userRole && (
          <Badge variant="outline" className={ROL_COLORS[userRole]}>
            {ROL_LABELS[userRole]}
          </Badge>
        )}

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-fit h-fit p-2 rounded-full">
              <div className="flex w-fit h-fit p-3 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                {userProfile?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userProfile?.nombre}</p>
                <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
