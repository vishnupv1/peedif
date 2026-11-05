import { downloadName } from '../pdf/download.ts'
import { renderBlocks } from '../pdf/text-layout.ts'

export async function wordToPdf(data: ArrayBuffer, originalName?: string): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer: data })
  const lines = result.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) throw new Error('This Word document has no text to convert.')
  const bytes = await renderBlocks(lines.map((text) => ({ text, size: 11 })))
  return { bytes, filename: downloadName(originalName, 'pdf'), mimeType: 'application/pdf' }
}
