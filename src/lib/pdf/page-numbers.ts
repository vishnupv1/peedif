import { degrees, rgb, StandardFonts } from 'pdf-lib'
import { loadPdf } from './load.ts'
import {
  layoutPageNumber,
  PAGE_NUMBER_FONT_SIZE,
  type PageNumberPosition,
} from './page-number-layout.ts'
import { savePdf } from './save.ts'

export type PageNumberOptions = {
  position: PageNumberPosition
  startNumber: number
  skipFirstPage: boolean
}

export async function addPageNumbers(file: File, options: PageNumberOptions): Promise<Uint8Array> {
  if (!Number.isInteger(options.startNumber) || options.startNumber < 0) {
    throw new Error('Enter a starting number of 0 or greater.')
  }

  const document = await loadPdf(file)
  const pages = document.getPages()
  if (pages.length === 0) {
    throw new Error('This PDF has no pages to number.')
  }

  const font = await document.embedFont(StandardFonts.Helvetica)
  const fontSize = PAGE_NUMBER_FONT_SIZE
  const color = rgb(32 / 255, 32 / 255, 31 / 255)
  let printed = 0

  for (let index = 0; index < pages.length; index += 1) {
    if (options.skipFirstPage && index === 0) continue
    const page = pages[index]
    if (!page) continue
    const text = String(options.startNumber + printed)
    printed += 1
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    const { width, height } = page.getSize()
    const placement = layoutPageNumber({
      pageWidth: width,
      pageHeight: height,
      pageRotation: page.getRotation().angle,
      textWidth,
      fontSize,
      position: options.position,
    })
    page.drawText(text, {
      x: placement.x,
      y: placement.y,
      size: fontSize,
      font,
      color,
      rotate: degrees(placement.rotate),
    })
  }

  if (printed === 0) {
    throw new Error('There are no pages left to number. Turn off "Skip the first page" or use a document with more pages.')
  }

  return savePdf(document)
}
