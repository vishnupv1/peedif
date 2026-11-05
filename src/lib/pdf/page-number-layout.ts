export type PageNumberPosition = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center'

export type QuarterTurn = 0 | 90 | 180 | 270

export type PageNumberPlacement = {
  x: number
  y: number
  rotate: QuarterTurn
}

export const PAGE_NUMBER_MARGIN = 28
export const PAGE_NUMBER_FONT_SIZE = 11

export function normalizeQuarterTurn(angle: number): QuarterTurn {
  const normalized = ((Math.round(angle) % 360) + 360) % 360
  if (normalized === 90 || normalized === 180 || normalized === 270) return normalized
  return 0
}

/**
 * Places an upright page number in viewer space.
 * PDF page rotation is clockwise. pdf-lib text rotation is counter-clockwise,
 * so the text rotation matches the page rotation and stays readable.
 */
export function layoutPageNumber(input: {
  pageWidth: number
  pageHeight: number
  pageRotation: number
  textWidth: number
  fontSize: number
  position: PageNumberPosition
}): PageNumberPlacement {
  const width = input.pageWidth
  const height = input.pageHeight
  const textWidth = input.textWidth
  const fontSize = input.fontSize
  const margin = PAGE_NUMBER_MARGIN
  const rotation = normalizeQuarterTurn(input.pageRotation)

  if (rotation === 0) {
    const yBottom = margin
    const yTop = height - margin - fontSize
    if (input.position === 'bottom-left') return { x: margin, y: yBottom, rotate: 0 }
    if (input.position === 'bottom-right') return { x: width - margin - textWidth, y: yBottom, rotate: 0 }
    if (input.position === 'top-center') return { x: (width - textWidth) / 2, y: yTop, rotate: 0 }
    return { x: (width - textWidth) / 2, y: yBottom, rotate: 0 }
  }

  if (rotation === 90) {
    const xBottom = width - margin
    const xTop = margin + fontSize
    if (input.position === 'bottom-left') return { x: xBottom, y: margin, rotate: 90 }
    if (input.position === 'bottom-right') return { x: xBottom, y: height - margin - textWidth, rotate: 90 }
    if (input.position === 'top-center') return { x: xTop, y: (height - textWidth) / 2, rotate: 90 }
    return { x: xBottom, y: (height - textWidth) / 2, rotate: 90 }
  }

  if (rotation === 180) {
    const yBottom = height - margin
    const yTop = margin + fontSize
    if (input.position === 'bottom-left') return { x: width - margin, y: yBottom, rotate: 180 }
    if (input.position === 'bottom-right') return { x: margin + textWidth, y: yBottom, rotate: 180 }
    if (input.position === 'top-center') return { x: (width + textWidth) / 2, y: yTop, rotate: 180 }
    return { x: (width + textWidth) / 2, y: yBottom, rotate: 180 }
  }

  const xBottom = margin
  const xTop = width - margin - fontSize
  if (input.position === 'bottom-left') return { x: xBottom, y: height - margin, rotate: 270 }
  if (input.position === 'bottom-right') return { x: xBottom, y: margin + textWidth, rotate: 270 }
  if (input.position === 'top-center') return { x: xTop, y: (height + textWidth) / 2, rotate: 270 }
  return { x: xBottom, y: (height + textWidth) / 2, rotate: 270 }
}
