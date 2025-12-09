'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: LucideIcon
  error?: string
  helperText?: string
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ label, icon: Icon, error, helperText, className, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={cn('w-5 h-5', error ? 'text-red-400' : 'text-gray-400')} />
          </div>
          <input
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-md border bg-white pl-10 pr-3 py-2 text-sm',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent',
              error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    )
  }
)

InputWithIcon.displayName = 'InputWithIcon'
