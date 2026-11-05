import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createId(): string {
  return crypto.randomUUID()
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${Math.round(bytes)} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function toUserMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.trim()
    if (message && message.length < 280 && !message.includes('    at ')) {
      return message
    }
  }
  return 'Something went wrong while processing the file. Try a different document.'
}
