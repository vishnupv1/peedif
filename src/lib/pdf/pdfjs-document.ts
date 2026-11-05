import type { PDFDocumentProxy } from 'pdfjs-dist'
import { linesFromTextItems, rowsFromTextItems, type PositionedText } from './text-items.ts'

export const MAX_RENDER_PAGES = 30
export const MAX_TEXT_PAGES = 100

type PdfjsModule = typeof import('pdfjs-dist')

let pdfjsPromise: Promise<PdfjsModule> | null = null

async function loadPdfjs(): Promise<PdfjsModule> {
  pdfjsPromise ??= (async () => {
    const pdfjs = await import('pdfjs-dist')
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default
    return pdfjs
  })()
  return pdfjsPromise
}

export function assertPageCount(count: number, max: number): void {
  if (count < 1) throw new Error('This PDF has no pages.')
  if (count > max) {
    throw new Error(`This PDF has ${count} pages. This tool can handle up to ${max} pages at a time.`)
  }
}

export async function withPdfDocument<T>(data: ArrayBuffer, run: (document: PDFDocumentProxy) => Promise<T>): Promise<T> {
  const pdfjs = await loadPdfjs()
  const copy = new Uint8Array(data.byteLength)
  copy.set(new Uint8Array(data))
  let document: PDFDocumentProxy
  try {
    document = await pdfjs.getDocument({ data: copy }).promise
  } catch (error) {
    const name = error instanceof Error ? error.name : ''
    if (name === 'PasswordException' || error instanceof pdfjs.PasswordException) {
      throw new Error('This PDF is password protected and cannot be opened.')
    }
    throw new Error('This PDF could not be read. It may be damaged.')
  }
  try {
    return await run(document)
  } finally {
    await document.cleanup()
  }
}

async function extractPages<T>(data: ArrayBuffer, map: (items: PositionedText[]) => T): Promise<T[]> {
  return withPdfDocument(data, async (document) => {
    assertPageCount(document.numPages, MAX_TEXT_PAGES)
    const pages: T[] = []
    for (let number = 1; number <= document.numPages; number += 1) {
      const page = await document.getPage(number)
      const content = await page.getTextContent()
      const items: PositionedText[] = []
      for (const item of content.items) {
        if (!('str' in item) || !item.str.trim()) continue
        const x = item.transform[4]
        const y = item.transform[5]
        if (x === undefined || y === undefined) continue
        items.push({ text: item.str, x, y })
      }
      pages.push(map(items))
      page.cleanup()
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    return pages
  })
}

export function extractPageLines(data: ArrayBuffer): Promise<string[][]> {
  return extractPages(data, linesFromTextItems)
}

export function extractPageRows(data: ArrayBuffer): Promise<string[][][]> {
  return extractPages(data, rowsFromTextItems)
}

export function hasExtractableText(pages: Array<string[] | string[][]>): boolean {
  return pages.some((page) =>
    page.some((entry) => (typeof entry === 'string' ? entry.trim().length > 0 : entry.some((cell) => cell.trim()))),
  )
}
