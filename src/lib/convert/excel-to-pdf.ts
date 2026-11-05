import { PDFDocument, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib'
import { downloadName } from '../pdf/download.ts'
import { savePdf } from '../pdf/save.ts'
import { toWinAnsi, wrapText } from '../pdf/text-layout.ts'

const PAGE_WIDTH = 841.89
const PAGE_HEIGHT = 595.28
const MARGIN = 36
const MAX_ROWS = 1000
const MAX_COLUMNS = 20

type SheetRows = {
  name: string
  rows: string[][]
  truncated: boolean
}

function columnWidths(rows: string[][], font: PDFFont): number[] {
  const count = Math.min(MAX_COLUMNS, Math.max(0, ...rows.map((row) => row.length)))
  const widths = Array.from({ length: count }, () => 40)
  for (const row of rows.slice(0, 40)) {
    row.slice(0, count).forEach((cell, index) => {
      const sample = toWinAnsi(cell).slice(0, 48) || ' '
      const width = Math.min(150, font.widthOfTextAtSize(sample, 9) + 10)
      const current = widths[index] ?? 40
      widths[index] = Math.max(current, width)
    })
  }
  return widths
}

function groupsFor(widths: number[], available: number): number[][] {
  const groups: number[][] = []
  let current: number[] = []
  let used = 0
  widths.forEach((width, index) => {
    if (current.length > 0 && used + width > available) {
      groups.push(current)
      current = []
      used = 0
    }
    current.push(index)
    used += width
  })
  if (current.length > 0) groups.push(current)
  return groups
}

export async function excelToPdf(data: ArrayBuffer, originalName?: string): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  const { read, utils } = await import('xlsx')
  const workbook = read(data, { type: 'array' })
  const sheets: SheetRows[] = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name]
    const grid = sheet ? (utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' }) as unknown[][]) : []
    const rows = grid
      .map((row) => (Array.isArray(row) ? row : []).slice(0, MAX_COLUMNS).map((cell) => String(cell ?? '')))
      .filter((row) => row.some((cell) => cell.trim()))
    return { name, rows: rows.slice(0, MAX_ROWS), truncated: rows.length > MAX_ROWS }
  }).filter((sheet) => sheet.rows.length > 0)

  if (sheets.length === 0) throw new Error('This spreadsheet has no rows to convert.')

  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const available = PAGE_WIDTH - MARGIN * 2
  let page: PDFPage | null = null
  let y = 0

  const nextPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    y = PAGE_HEIGHT - MARGIN
  }

  const write = (text: string, size: number, x: number) => {
    if (!page || y < MARGIN) nextPage()
    page?.drawText(text, { x, y, size, font })
  }

  sheets.forEach((sheet, sheetIndex) => {
    if (sheetIndex === 0) nextPage()
    else nextPage()
    write(toWinAnsi(sheet.name).slice(0, 40) || 'Sheet', 14, MARGIN)
    y -= 22
    const widths = columnWidths(sheet.rows, font)
    const groups = groupsFor(widths, available)
    groups.forEach((group, groupIndex) => {
      if (groupIndex > 0) nextPage()
      for (const row of sheet.rows) {
        if (y < MARGIN + 12) nextPage()
        let x = MARGIN
        for (const index of group) {
          const width = widths[index] ?? 40
          const cell = wrapText(row[index] ?? '', font, 9, Math.max(12, width - 8))[0] ?? ''
          write(cell, 9, x)
          x += width
        }
        y -= 14
      }
    })
    if (sheet.truncated) {
      y -= 8
      write('Only the first 1000 rows were included.', 9, MARGIN)
      y -= 14
    }
  })

  const bytes = await savePdf(pdf)
  return { bytes, filename: downloadName(originalName, 'pdf'), mimeType: 'application/pdf' }
}
