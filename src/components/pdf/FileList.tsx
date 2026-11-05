import { ChevronDown, ChevronUp, Trash } from 'lucide-react'
import { formatFileSize } from '../../lib/utils.ts'
import type { DocumentFile } from '../../types/pdf.ts'
import { Button } from '../ui/button.tsx'

type FileListProps = {
  files: DocumentFile[]
  onRemove: (id: string) => void
  onMove?: (id: string, direction: 'up' | 'down') => void
}

export function FileList({ files, onRemove, onMove }: FileListProps) {
  if (files.length === 0) return null

  return (
    <ul aria-label="Selected files" className="max-h-96 divide-y divide-border overflow-y-auto rounded-lg border border-border bg-surface">
      {files.map((file, index) => (
        <li key={file.id} className="flex items-center gap-2 px-3 py-2">
          <span className="w-6 shrink-0 text-sm text-muted">{index + 1}</span>
          {file.previewUrl ? (
            <img
              src={file.previewUrl}
              alt=""
              className="size-12 shrink-0 rounded-md border border-border bg-surface-muted object-contain"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-foreground">{file.name}</p>
            <p className="text-sm text-muted">{formatFileSize(file.size)}</p>
          </div>
          <div className="flex shrink-0 items-center">
            {onMove ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Move ${file.name} up`}
                  disabled={index === 0}
                  onClick={() => onMove(file.id, 'up')}
                >
                  <ChevronUp className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Move ${file.name} down`}
                  disabled={index === files.length - 1}
                  onClick={() => onMove(file.id, 'down')}
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </Button>
              </>
            ) : null}
            <Button variant="ghost" size="icon" aria-label={`Remove ${file.name}`} onClick={() => onRemove(file.id)}>
              <Trash className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
