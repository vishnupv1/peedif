import { downloadName } from '../pdf/download.ts'
import { assertPageCount, MAX_RENDER_PAGES, withPdfDocument } from '../pdf/pdfjs-document.ts'
import { renderPageJpeg } from './render-page.ts'

const PPTX_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

function bytesToDataUrl(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk))
  }
  return `data:image/jpeg;base64,${btoa(binary)}`
}

export async function pdfToPpt(data: ArrayBuffer, originalName?: string): Promise<{
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

  const { default: PptxGenJS } = await import('pptxgenjs')
  const pptx = new PptxGenJS()
  const slideWidth = Math.max(...pages.map((page) => page.width / 72))
  const slideHeight = Math.max(...pages.map((page) => page.height / 72))
  pptx.defineLayout({ name: 'PDF', width: slideWidth, height: slideHeight })
  pptx.layout = 'PDF'

  for (const page of pages) {
    const imageWidth = page.width / 72
    const imageHeight = page.height / 72
    const scale = Math.min(slideWidth / imageWidth, slideHeight / imageHeight)
    const width = imageWidth * scale
    const height = imageHeight * scale
    const slide = pptx.addSlide()
    slide.addImage({
      data: bytesToDataUrl(page.bytes),
      x: (slideWidth - width) / 2,
      y: (slideHeight - height) / 2,
      w: width,
      h: height,
    })
  }

  const output = await pptx.write({ outputType: 'arraybuffer' })
  return {
    bytes: new Uint8Array(output as ArrayBuffer),
    filename: downloadName(originalName, 'pptx'),
    mimeType: PPTX_MIME,
  }
}
