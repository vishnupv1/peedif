import { useCallback, useEffect, useRef, useState } from 'react'
import { createId } from '../lib/utils.ts'
import { validateImageFile, validatePdfFile } from '../lib/pdf/validate.ts'
import type { DocumentFile, FileKind } from '../types/pdf.ts'

function revokePreviews(items: DocumentFile[]) {
  for (const item of items) {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
  }
}

export function usePdfFiles(
  kind: FileKind,
  multiple: boolean,
  validate?: (file: File) => Promise<string | null>,
) {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const filesRef = useRef<DocumentFile[]>([])

  useEffect(() => {
    filesRef.current = files
  }, [files])

  const addFiles = useCallback(
    async (incoming: File[]) => {
      if (incoming.length === 0) return
      const nextErrors: string[] = []
      const accepted: DocumentFile[] = []
      let ignoredExtra = false

      for (const file of incoming) {
        if (!multiple && accepted.length === 1) {
          ignoredExtra = true
          break
        }
        const check = validate ?? (kind === 'image' ? validateImageFile : validatePdfFile)
        const error = await check(file)
        if (error) {
          nextErrors.push(error)
          continue
        }
        const item: DocumentFile = {
          id: createId(),
          file,
          name: file.name,
          size: file.size,
        }
        if (kind === 'image') item.previewUrl = URL.createObjectURL(file)
        accepted.push(item)
      }

      if (ignoredExtra) {
        nextErrors.push('Only one file can be used. Extra files were ignored.')
      }
      setErrors(nextErrors)
      setFiles((current) => {
        if (!multiple) {
          if (accepted.length === 0) return current
          revokePreviews(current)
          return accepted.slice(0, 1)
        }
        return [...current, ...accepted]
      })
    },
    [kind, multiple, validate],
  )

  const removeFile = useCallback((id: string) => {
    setFiles((current) => {
      const target = current.find((file) => file.id === id)
      if (target) revokePreviews([target])
      return current.filter((file) => file.id !== id)
    })
  }, [])

  const moveFile = useCallback((id: string, direction: 'up' | 'down') => {
    setFiles((current) => {
      const index = current.findIndex((file) => file.id === id)
      const target = index + (direction === 'up' ? -1 : 1)
      if (index < 0 || target < 0 || target >= current.length) return current
      const next = current.slice()
      const [item] = next.splice(index, 1)
      if (!item) return current
      next.splice(target, 0, item)
      return next
    })
  }, [])

  useEffect(() => {
    return () => revokePreviews(filesRef.current)
  }, [])

  return { files, errors, addFiles, removeFile, moveFile }
}
