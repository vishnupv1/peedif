import { useId, useRef, useState, type DragEvent } from 'react'
import { cn } from '../../lib/utils.ts'

type FileDropzoneProps = {
  accept: string
  multiple?: boolean
  disabled?: boolean
  label: string
  hint: string
  onFiles: (files: File[]) => void
}

export function FileDropzone({ accept, multiple = false, disabled = false, label, hint, onFiles }: FileDropzoneProps) {
  const inputId = useId()
  const hintId = useId()
  const depth = useRef(0)
  const [dragging, setDragging] = useState(false)

  const takeFiles = (list: FileList | null) => {
    if (disabled || !list || list.length === 0) return
    onFiles(Array.from(list))
  }

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (disabled) return
    depth.current += 1
    setDragging(true)
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    depth.current -= 1
    if (depth.current <= 0) {
      depth.current = 0
      setDragging(false)
    }
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    depth.current = 0
    setDragging(false)
    takeFiles(event.dataTransfer.files)
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'rounded-2xl border border-dashed bg-gradient-to-br from-[#F4F0FF] via-white to-[#FFF4EA] px-6 py-10 text-center focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-foreground',
        dragging ? 'border-[#6E59E6]' : 'border-[#CDBFF5]',
        disabled && 'opacity-60',
      )}
    >
      <input
        id={inputId}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={label}
        aria-describedby={hintId}
        onChange={(event) => {
          takeFiles(event.target.files)
          event.target.value = ''
        }}
      />
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[#5b48c9]',
          disabled && 'pointer-events-none',
        )}
      >
        Browse files
      </label>
      <p className="mt-3 text-sm text-foreground">or drop {multiple ? 'files' : 'a file'} here</p>
      <p id={hintId} className="mt-2 text-sm text-muted">
        {hint}
      </p>
    </div>
  )
}
