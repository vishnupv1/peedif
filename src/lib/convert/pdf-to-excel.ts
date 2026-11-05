import { downloadName } from '../pdf/download.ts'
import { extractPageRows, hasExtractableText } from '../pdf/pdfjs-document.ts'

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export async function pdfToExcel(data: ArrayBuffer, originalName?: string): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  const pages = await extractPageRows(data)
  if (!hasExtractableText(pages)) {
    throw new Error('This PDF has no text that can be copied into a spreadsheet.')
  }

  const rows: string[][] = []
  pages.forEach((pageRows, index) => {
    rows.push([`Page ${index + 1}`])
    if (pageRows.length === 0) rows.push(['No extractable text'])
    else rows.push(...pageRows)
    rows.push([])
  })

  const { utils, write } = await import('xlsx')
  const sheet = utils.aoa_to_sheet(rows)
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, 'PDF')
  const output = write(book, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer
  return { bytes: new Uint8Array(output), filename: downloadName(originalName, 'xlsx'), mimeType: XLSX_MIME }
}
