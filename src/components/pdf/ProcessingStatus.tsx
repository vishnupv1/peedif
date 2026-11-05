import { cn } from '../../lib/utils.ts'
import type { ProcessingState } from '../../hooks/usePdfAction.ts'

export function ProcessingStatus({ status, message }: { status: ProcessingState; message?: string | null }) {
  if (status === 'idle' || !message) return null
  const isError = status === 'error'

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6',
        isError ? 'border-danger-border bg-danger-surface text-danger' : 'border-border bg-surface text-foreground',
      )}
    >
      {status === 'processing' ? (
        <span
          className="mt-1 size-4 shrink-0 animate-spin rounded-full border-2 border-border border-t-foreground motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : null}
      <p>{message}</p>
    </div>
  )
}
