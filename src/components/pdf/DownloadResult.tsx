import { useState } from 'react'
import { downloadBlob } from '../../lib/pdf/download.ts'
import { formatFileSize, toUserMessage } from '../../lib/utils.ts'
import { Button } from '../ui/button.tsx'

function downloadLabel(filename: string): string {
  const extension = filename.split('.').pop()?.toUpperCase()
  if (!extension || extension === 'PDF') return 'Download PDF'
  return `Download ${extension}`
}

type DownloadResultProps = {
  blob: Blob
  filename: string
  originalSize?: number
  outputSize?: number
}

export function DownloadResult({ blob, filename, originalSize, outputSize }: DownloadResultProps) {
  const [error, setError] = useState<string | null>(null)
  const showSizes = originalSize !== undefined && outputSize !== undefined

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      {showSizes ? (
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">Original size</dt>
            <dd className="mt-1 text-foreground">{formatFileSize(originalSize)}</dd>
          </div>
          <div>
            <dt className="text-muted">Result size</dt>
            <dd className="mt-1 text-foreground">{formatFileSize(outputSize)}</dd>
          </div>
        </dl>
      ) : null}
      <Button
        className={showSizes ? 'mt-4 w-full sm:w-auto' : 'w-full sm:w-auto'}
        onClick={() => {
          try {
            downloadBlob(blob, filename)
            setError(null)
          } catch (caught) {
            setError(toUserMessage(caught))
          }
        }}
      >
        {downloadLabel(filename)}
      </Button>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
