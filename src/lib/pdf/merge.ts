import { PDFDocument } from 'pdf-lib'
import { loadPdf } from './load.ts'
import { savePdf } from './save.ts'

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error('Add at least two PDF files to merge.')
  }

  const merged = await PDFDocument.create()
  for (const file of files) {
    try {
      const source = await loadPdf(file)
      if (source.getPageCount() === 0) {
        throw new Error(`"${file.name}" has no pages to merge.`)
      }
      const pages = await merged.copyPages(source, source.getPageIndices())
      for (const page of pages) merged.addPage(page)
    } catch (error) {
      if (error instanceof Error && error.message.includes(`"${file.name}"`)) throw error
      throw new Error(`"${file.name}" could not be merged. It may be corrupted or use an unsupported PDF feature.`)
    }
  }

  return savePdf(merged)
}
