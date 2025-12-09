'use client'

import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  helperText?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => setShowPassword((prev) => !prev)

    return (
      <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className={cn('w-5 h-5', error ? 'text-red-400' : 'text-gray-400')} />
          </div>
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'flex h-11 w-full rounded-md border bg-white pl-10 pr-12 py-2 text-sm',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent',
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
