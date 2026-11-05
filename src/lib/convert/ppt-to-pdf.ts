import { downloadName } from '../pdf/download.ts'
import { renderBlocks, type TextBlock } from '../pdf/text-layout.ts'
import { slideOrder, textsFromSlideXml } from './slide-text.ts'

export async function pptToPdf(data: ArrayBuffer, originalName?: string): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  const { default: JSZip } = await import('jszip')
  const zip = await JSZip.loadAsync(data)
  const slides = slideOrder(Object.keys(zip.files))
  if (slides.length === 0) throw new Error('This PowerPoint file has no slides.')

  const blocks: TextBlock[] = []
  for (const [index, path] of slides.entries()) {
    const xml = await zip.file(path)?.async('string')
    const lines = textsFromSlideXml(xml ?? '')
    const content = lines.length > 0 ? lines : ['This slide has no readable text.']
    content.forEach((text, lineIndex) => {
      blocks.push({ text, size: 12, breakBefore: index > 0 && lineIndex === 0 })
    })
  }

  const readable = blocks.some((block) => block.text !== 'This slide has no readable text.')
  if (!readable) {
    throw new Error('This presentation has no readable text. Slide artwork is not reproduced.')
  }

  const bytes = await renderBlocks(blocks)
  return { bytes, filename: downloadName(originalName, 'pdf'), mimeType: 'application/pdf' }
}
