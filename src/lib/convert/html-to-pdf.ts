import { downloadName } from '../pdf/download.ts'
import { renderBlocks } from '../pdf/text-layout.ts'
import { blocksFromHtml } from './html-blocks.ts'

export async function htmlStringToPdf(html: string, originalName?: string): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  const blocks = blocksFromHtml(html)
  if (blocks.length === 0) throw new Error('This HTML has no text to convert.')
  const bytes = await renderBlocks(blocks)
  return { bytes, filename: downloadName(originalName, 'pdf'), mimeType: 'application/pdf' }
}

export async function htmlFileToPdf(file: File): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  return htmlStringToPdf(await file.text(), file.name)
}
