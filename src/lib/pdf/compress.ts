import { formatFileSize } from '../utils.ts'
import { loadPdf } from './load.ts'
import { savePdf } from './save.ts'

export type CompressResult = {
  bytes: Uint8Array
  originalSize: number
  outputSize: number
}

/**
 * Re-saves a PDF with object streams.
 * pdf-lib does not recompress images or fonts, so many files will not shrink.
 * Keep this module separate so a browser-compatible compressor can replace it later.
 */
export async function compressPdf(file: File): Promise<CompressResult> {
  const document = await loadPdf(file)
  if (document.getPageCount() === 0) {
    throw new Error('This PDF has no pages.')
  }
  const bytes = await savePdf(document)
  return {
    bytes,
    originalSize: file.size,
    outputSize: bytes.byteLength,
  }
}

export function describeCompression(originalSize: number, outputSize: number): string {
  if (outputSize < originalSize) {
    const saved = originalSize - outputSize
    return `The new file is ${formatFileSize(saved)} smaller. Images and embedded fonts were not recompressed, so a smaller result is not guaranteed.`
  }
  if (outputSize === originalSize) {
    return 'The file size stayed the same. Re-saving this PDF did not make it smaller.'
  }
  const growth = outputSize - originalSize
  return `The new file is ${formatFileSize(growth)} larger. Re-saving did not compress this PDF. Keep the original if you want the smaller file.`
}
