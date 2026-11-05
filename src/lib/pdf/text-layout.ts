import { PDFDocument, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib'
import { savePdf } from './save.ts'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 48

export function toWinAnsi(text: string): string {
  const replaced = text
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2022/g, '*')
  let out = ''
  for (const char of replaced) {
    const code = char.charCodeAt(0)
    if (code === 0x0a || code === 0x0d || code === 0x09) {
      out += ' '
      continue
    }
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa1 && code <= 0xff)) out += char
    else out += '?'
  }
  return out
}

export function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const clean = toWinAnsi(text).trim()
  if (!clean) return []
  const words = clean.split(/\s+/)
  const lines: string[] = []
  let current = ''

  const pushLongWord = (word: string) => {
    let piece = ''
    for (const char of word) {
      const trial = piece + char
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) piece = trial
      else {
        if (piece) lines.push(piece)
        piece = char
      }
    }
    current = piece
  }

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next
      continue
    }
    if (current) lines.push(current)
    if (font.widthOfTextAtSize(word, size) <= maxWidth) current = word
    else pushLongWord(word)
  }
  if (current) lines.push(current)
  return lines
}

export type TextBlock = {
  text: string
  size?: number
  breakBefore?: boolean
}

export async function renderBlocks(blocks: TextBlock[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const maxWidth = PAGE_WIDTH - MARGIN * 2
  let page: PDFPage | null = null
  let y = 0

  const nextPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    y = PAGE_HEIGHT - MARGIN
  }

  const writeLine = (line: string, size: number) => {
    if (!page || y < MARGIN + size) nextPage()
    page?.drawText(line, { x: MARGIN, y, size, font })
    y -= size + 4
  }

  nextPage()
  for (const block of blocks) {
    if (block.breakBefore) nextPage()
    const size = block.size ?? 11
    const lines = wrapText(block.text, font, size, maxWidth)
    if (lines.length === 0) {
      y -= size + 4
      continue
    }
    for (const line of lines) writeLine(line, size)
    y -= 4
  }

  if (pdf.getPageCount() === 0) throw new Error('Nothing could be written to the PDF.')
  return savePdf(pdf)
}
