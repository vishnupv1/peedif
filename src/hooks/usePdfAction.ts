import { useCallback, useRef, useState } from 'react'
import { toFileBlob } from '../lib/pdf/download.ts'
import { toUserMessage } from '../lib/utils.ts'

export type ProcessingState = 'idle' | 'processing' | 'success' | 'error'

export type PdfActionOutput = {
  bytes: Uint8Array
  filename: string
  mimeType?: string
  message?: string
  originalSize?: number
  outputSize?: number
}

export type PdfActionResult = {
  blob: Blob
  filename: string
  originalSize?: number
  outputSize?: number
}

export function usePdfAction() {
  const [status, setStatus] = useState<ProcessingState>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [result, setResult] = useState<PdfActionResult | null>(null)
  const running = useRef(false)
  const runId = useRef(0)

  const reset = useCallback(() => {
    runId.current += 1
    running.current = false
    setStatus('idle')
    setMessage(null)
    setResult(null)
  }, [])

  const fail = useCallback((text: string) => {
    runId.current += 1
    running.current = false
    setStatus('error')
    setMessage(text)
    setResult(null)
  }, [])

  const run = useCallback(async (action: () => Promise<PdfActionOutput>, processingMessage = 'Working on your file…') => {
    if (running.current) return
    running.current = true
    const id = ++runId.current
    setStatus('processing')
    setMessage(processingMessage)
    setResult(null)
    try {
      const output = await action()
      if (id !== runId.current) return
      setResult({
        blob: toFileBlob(output.bytes, output.mimeType),
        filename: output.filename,
        originalSize: output.originalSize,
        outputSize: output.outputSize,
      })
      setStatus('success')
      setMessage(output.message ?? 'Your file is ready to download.')
    } catch (error) {
      if (id !== runId.current) return
      if (import.meta.env.DEV && error instanceof Error) {
        console.error(error.message)
      }
      setStatus('error')
      setMessage(toUserMessage(error))
    } finally {
      if (id === runId.current) running.current = false
    }
  }, [])

  return { status, message, result, run, reset, fail }
}
