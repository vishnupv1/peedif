import { PDFDocument, StandardFonts } from 'pdf-lib'
import { cloneBytes } from '../lib/pdf/download.ts'
import { savePdf } from '../lib/pdf/save.ts'

export function bytesToFile(bytes: Uint8Array, name: string, type: string): File {
  return new File([cloneBytes(bytes)], name, { type })
}

export async function makePdfFile(name: string, sizes: Array<[number, number]>, label?: string): Promise<File> {
  const document = await PDFDocument.create()
  const font = label ? await document.embedFont(StandardFonts.Helvetica) : undefined
  sizes.forEach(([width, height], index) => {
    const page = document.addPage([width, height])
    if (label && font) {
      page.drawText(`${label}-${index + 1}`, { x: 12, y: 12, size: 12, font })
    }
  })
  return bytesToFile(await savePdf(document), name, 'application/pdf')
}

export const PNG_1X1 = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
  (char) => char.charCodeAt(0),
)
