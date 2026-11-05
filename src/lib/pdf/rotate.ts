import { degrees } from 'pdf-lib'
import { loadPdf } from './load.ts'
import { parsePageRanges } from './ranges.ts'
import { savePdf } from './save.ts'

export type RotationDegrees = 90 | 180 | 270

function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360
}

export async function rotatePdf(
  file: File,
  rotation: RotationDegrees,
  selection: 'all' | string,
): Promise<Uint8Array> {
  const document = await loadPdf(file)
  const total = document.getPageCount()
  if (total === 0) {
    throw new Error('This PDF has no pages to rotate.')
  }

  const targets = selection === 'all' ? document.getPageIndices() : parsePageRanges(selection, total)
  if (targets.length === 0) {
    throw new Error('Select at least one page to rotate.')
  }

  const seen = new Set<number>()
  for (const index of targets) {
    if (!Number.isInteger(index) || index < 0 || index >= total) {
      throw new Error('A selected page is outside this document.')
    }
    if (seen.has(index)) continue
    seen.add(index)
    const page = document.getPage(index)
    const next = (normalizeAngle(page.getRotation().angle) + rotation) % 360
    page.setRotation(degrees(next))
  }

  return savePdf(document)
}
