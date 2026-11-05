import { PDFDocument } from 'pdf-lib'
import { hasPdfSignature, readFileHeader } from './validate.ts'

export async function loadPdf(file: File): Promise<PDFDocument> {
  const header = await readFileHeader(file, 5)
  if (!hasPdfSignature(header)) {
    throw new Error(`"${file.name}" is not a valid PDF file.`)
  }

  try {
    const bytes = await file.arrayBuffer()
    const document = await PDFDocument.load(bytes)
    document.getPageCount()
    return document
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (/encrypt/i.test(message)) {
      throw new Error(`"${file.name}" is encrypted. Remove the password and try again.`)
    }
    throw new Error(`"${file.name}" could not be opened. It may be corrupted or use an unsupported PDF feature.`)
  }
}
