import { useEffect, useState } from 'react'
import { loadPdf } from '../lib/pdf/load.ts'
import { toUserMessage } from '../lib/utils.ts'

export function usePdfDocument(file: File | null) {
  const [state, setState] = useState<{
    file: File | null
    pageCount: number | null
    error: string | null
  }>({ file: null, pageCount: null, error: null })

  useEffect(() => {
    if (!file) return
    let cancelled = false
    loadPdf(file)
      .then((document) => {
        if (!cancelled) setState({ file, pageCount: document.getPageCount(), error: null })
      })
      .catch((caught: unknown) => {
        if (!cancelled) setState({ file, pageCount: null, error: toUserMessage(caught) })
      })
    return () => {
      cancelled = true
    }
  }, [file])

  const ready = file !== null && state.file === file
  return {
    pageCount: ready ? state.pageCount : null,
    error: ready ? state.error : null,
    loading: file !== null && !ready,
  }
}
