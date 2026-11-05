import { PDFDocument } from 'pdf-lib'
import { isJpeg, isPng } from './validate.ts'
import { savePdf } from './save.ts'

export const IMAGE_PAGE_WIDTH = 595.28
export const IMAGE_PAGE_HEIGHT = 841.89
export const IMAGE_PAGE_MARGIN = 36

export function fitImageOnPage(imageWidth: number, imageHeight: number) {
  const maxWidth = IMAGE_PAGE_WIDTH - IMAGE_PAGE_MARGIN * 2
  const maxHeight = IMAGE_PAGE_HEIGHT - IMAGE_PAGE_MARGIN * 2
  const scale = Math.min(maxWidth / imageWidth, maxHeight / imageHeight)
  const width = imageWidth * scale
  const height = imageHeight * scale
  return {
    width,
    height,
    x: (IMAGE_PAGE_WIDTH - width) / 2,
    y: (IMAGE_PAGE_HEIGHT - height) / 2,
  }
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error('Add at least one JPG or PNG image.')
  }

  const document = await PDFDocument.create()
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer())
    try {
      const image = isPng(bytes) ? await document.embedPng(bytes) : isJpeg(bytes) ? await document.embedJpg(bytes) : null
      if (!image) {
        throw new Error(`"${file.name}" is not a JPG or PNG image.`)
      }
      const fitted = fitImageOnPage(image.width, image.height)
      const page = document.addPage([IMAGE_PAGE_WIDTH, IMAGE_PAGE_HEIGHT])
      page.drawImage(image, fitted)
    } catch (error) {
      if (error instanceof Error && error.message.includes(file.name)) throw error
      throw new Error(`"${file.name}" could not be added to the PDF.`)
    }
  }

  return savePdf(document)
}
