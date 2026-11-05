import { PDFDocument } from 'pdf-lib'
import { loadPdf } from './load.ts'
import { parsePageRanges } from './ranges.ts'
import { savePdf } from './save.ts'

export async function splitPdf(file: File, rangeInput: string): Promise<Uint8Array> {
  const source = await loadPdf(file)
  const indices = parsePageRanges(rangeInput, source.getPageCount())
  const document = await PDFDocument.create()
  const pages = await document.copyPages(source, indices)
  for (const page of pages) document.addPage(page)
  return savePdf(document)
}
