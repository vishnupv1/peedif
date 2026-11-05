export function cloneBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(new ArrayBuffer(bytes.byteLength))
  copy.set(bytes)
  return copy
}

export function toFileBlob(bytes: Uint8Array, mimeType = 'application/pdf'): Blob {
  return new Blob([cloneBytes(bytes)], { type: mimeType })
}

export function toPdfBlob(bytes: Uint8Array): Blob {
  return toFileBlob(bytes, 'application/pdf')
}

export function downloadName(originalName: string | undefined, extension: string): string {
  const base = originalName?.replace(/\.[^.]+$/u, '').trim()
  return `${base || 'document'}.${extension.replace(/^\./, '')}`
}

export function outputFilename(originalName: string | undefined, suffix: string): string {
  const trimmed = originalName?.replace(/\.pdf$/i, '').trim()
  const base = trimmed ? trimmed : 'document'
  return `${base}-${suffix}.pdf`
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  try {
    document.body.append(link)
    link.click()
    link.remove()
  } catch {
    URL.revokeObjectURL(url)
    throw new Error('The file could not be downloaded. Try again.')
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}
