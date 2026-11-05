import { type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils.ts'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-faint',
        className,
      )}
      {...props}
    />
  )
}
