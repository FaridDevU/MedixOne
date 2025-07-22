import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={cn(
          'block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-blue-500 focus:ring-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500',
          'px-3 py-2 resize-vertical',
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
          className
        )}
        {...props}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  )
}
