import { cloneBytes, downloadName } from '../pdf/download.ts'
import { assertPageCount, withPdfDocument } from '../pdf/pdfjs-document.ts'
import { hasPdfSignature } from '../pdf/validate.ts'
import { renderBlocks, type TextBlock } from '../pdf/text-layout.ts'
import { renderPageJpeg } from './render-page.ts'

export const OCR_PAGE_LIMIT = 10

async function recognizePages(file: File): Promise<string[]> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng', 1, {
    workerPath: '/tesseract/worker.min.js',
    corePath: '/tesseract-core',
    langPath: '/tessdata',
    gzip: true,
    workerBlobURL: false,
  })

  try {
    const header = new Uint8Array(await file.slice(0, 5).arrayBuffer())
    if (!hasPdfSignature(header)) {
      const result = await worker.recognize(file)
      return [result.data.text ?? '']
    }

    return await withPdfDocument(await file.arrayBuffer(), async (document) => {
      assertPageCount(document.numPages, OCR_PAGE_LIMIT)
      const pages: string[] = []
      for (let number = 1; number <= document.numPages; number += 1) {
        const page = await document.getPage(number)
        const rendered = await renderPageJpeg(page)
        const result = await worker.recognize(new Blob([cloneBytes(rendered.bytes)], { type: 'image/jpeg' }))
        pages.push(result.data.text ?? '')
        page.cleanup()
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
      return pages
    })
  } finally {
    await worker.terminate()
  }
}

export async function ocrToPdf(file: File): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  let pages: string[]
  try {
    pages = await recognizePages(file)
  } catch (error) {
    if (error instanceof Error && /password|could not be read|no pages|can handle up to/i.test(error.message)) throw error
    throw new Error('Text recognition failed. Try a clearer page.')
  }

  if (!pages.some((page) => page.trim())) throw new Error('No text was recognized.')
  const blocks: TextBlock[] = pages.map((page, index) => ({
    text: page.trim() || 'No text was recognized on this page.',
    size: 11,
    breakBefore: index > 0,
  }))
  return {
    bytes: await renderBlocks(blocks),
    filename: downloadName(file.name, 'pdf'),
    mimeType: 'application/pdf',
  }
}
