import { downloadName } from '../pdf/download.ts'
import { assertPageCount, MAX_RENDER_PAGES, withPdfDocument } from '../pdf/pdfjs-document.ts'
import { renderPageJpeg } from './render-page.ts'

export async function pdfToJpg(data: ArrayBuffer, originalName?: string): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  const pages = await withPdfDocument(data, async (document) => {
    assertPageCount(document.numPages, MAX_RENDER_PAGES)
    const rendered = []
    for (let number = 1; number <= document.numPages; number += 1) {
      const page = await document.getPage(number)
      rendered.push(await renderPageJpeg(page))
      page.cleanup()
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    return rendered
  })

  const first = pages[0]
  if (!first) throw new Error('This PDF has no pages.')
  if (pages.length === 1) {
    return { bytes: first.bytes, filename: downloadName(originalName, 'jpg'), mimeType: 'image/jpeg' }
  }

  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  pages.forEach((page, index) => {
    zip.file(`page-${index + 1}.jpg`, page.bytes)
  })
  const bytes = await zip.generateAsync({ type: 'uint8array' })
  const base = downloadName(originalName, 'zip').replace(/\.zip$/i, '')
  return { bytes, filename: `${base}-pages.zip`, mimeType: 'application/zip' }
}
