import type { PDFPageProxy } from 'pdfjs-dist'

export type RenderedPage = {
  bytes: Uint8Array
  width: number
  height: number
}

async function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('A page could not be rendered.'))),
      'image/jpeg',
      0.85,
    )
  })
  return new Uint8Array(await blob.arrayBuffer())
}

export async function renderPageJpeg(page: PDFPageProxy): Promise<RenderedPage> {
  const base = page.getViewport({ scale: 1 })
  const scale = Math.min(1.5, 1800 / Math.max(base.width, 1))
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.floor(viewport.width))
  canvas.height = Math.max(1, Math.floor(viewport.height))
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) throw new Error('A page could not be rendered.')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  await page.render({ canvas, canvasContext: context, viewport }).promise
  const bytes = await canvasToJpeg(canvas)
  canvas.width = 0
  canvas.height = 0
  return { bytes, width: base.width, height: base.height }
}
