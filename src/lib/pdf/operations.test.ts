import { PDFArray, PDFDocument, PDFRawStream, PDFRef } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import { bytesToFile, makePdfFile, PNG_1X1 } from '../../test/pdf-fixtures.ts'
import { compressPdf } from './compress.ts'
import { fitImageOnPage, imagesToPdf } from './images-to-pdf.ts'
import { loadPdf } from './load.ts'
import { mergePdfs } from './merge.ts'
import { addPageNumbers } from './page-numbers.ts'
import { rotatePdf } from './rotate.ts'
import { splitPdf } from './split.ts'

async function inflatePdfBytes(bytes: Uint8Array): Promise<string> {
  if (bytes.length >= 2 && bytes[0] === 0x78) {
    const stream = new DecompressionStream('deflate')
    const writer = stream.writable.getWriter()
    const copy = new Uint8Array(bytes.byteLength)
    copy.set(bytes)
    await writer.write(copy)
    await writer.close()
    const inflated = await new Response(stream.readable).arrayBuffer()
    return new TextDecoder('latin1').decode(inflated)
  }
  return new TextDecoder('latin1').decode(bytes)
}

async function drawnText(bytes: Uint8Array): Promise<string> {
  const document = await PDFDocument.load(bytes)
  const parts: string[] = []
  for (const page of document.getPages()) {
    const contents = page.node.Contents()
    const entries = contents instanceof PDFArray ? contents.asArray() : contents ? [contents] : []
    for (const entry of entries) {
      const stream = entry instanceof PDFRef ? document.context.lookup(entry) : entry
      if (stream instanceof PDFRawStream) parts.push(await inflatePdfBytes(stream.getContents()))
    }
  }
  return parts.join('\n')
}

function encryptedPdfBytes(): Uint8Array {
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Count 0 /Kids [] >>\nendobj\n',
    '3 0 obj\n<< /Filter /Standard /V 1 /R 2 >>\nendobj\n',
  ]
  let body = '%PDF-1.4\n'
  const offsets = [0]
  for (const object of objects) {
    offsets.push(body.length)
    body += object
  }
  const xrefStart = body.length
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let index = 1; index < offsets.length; index += 1) {
    xref += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Encrypt 3 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return new TextEncoder().encode(body + xref + trailer)
}

async function pageSizes(bytes: Uint8Array): Promise<Array<[number, number]>> {
  const document = await PDFDocument.load(bytes)
  return document.getPages().map((page) => {
    const { width, height } = page.getSize()
    return [width, height]
  })
}

describe('mergePdfs', () => {
  it('merges files in the listed order', async () => {
    const wide = await makePdfFile('wide.pdf', [[300, 100]])
    const tall = await makePdfFile('tall.pdf', [[100, 400]])
    const bytes = await mergePdfs([tall, wide])
    expect(String.fromCharCode(...bytes.slice(0, 5))).toBe('%PDF-')
    expect(await pageSizes(bytes)).toEqual([
      [100, 400],
      [300, 100],
    ])
  })

  it('requires two files and reports a bad file by name', async () => {
    const one = await makePdfFile('only.pdf', [[100, 100]])
    await expect(mergePdfs([one])).rejects.toThrow(/at least two/i)
    const junk = bytesToFile(new TextEncoder().encode('%PDF-1.4\nbad'), 'broken.pdf', 'application/pdf')
    await expect(mergePdfs([one, junk])).rejects.toThrow(/broken\.pdf/)
  })
})

describe('splitPdf', () => {
  it('extracts the requested pages and rejects a bad range', async () => {
    const file = await makePdfFile('pages.pdf', [
      [100, 100],
      [180, 180],
      [240, 120],
    ])
    const bytes = await splitPdf(file, '1, 3')
    expect(await pageSizes(bytes)).toEqual([
      [100, 100],
      [240, 120],
    ])
    await expect(splitPdf(file, '5-2')).rejects.toThrow(/reversed/i)
    await expect(splitPdf(file, '4')).rejects.toThrow(/outside this document/i)
  })
})

describe('compressPdf', () => {
  it('returns a PDF and the real output size', async () => {
    const file = await makePdfFile('source.pdf', [[200, 200]])
    const result = await compressPdf(file)
    expect(result.originalSize).toBe(file.size)
    expect(result.outputSize).toBe(result.bytes.byteLength)
    expect(String.fromCharCode(...result.bytes.slice(0, 5))).toBe('%PDF-')
    const document = await PDFDocument.load(result.bytes)
    expect(document.getPageCount()).toBe(1)
  })
})

describe('imagesToPdf', () => {
  it('fits an image on the page without changing its aspect ratio', () => {
    const wide = fitImageOnPage(2000, 1000)
    expect(wide.width / wide.height).toBeCloseTo(2, 5)
    expect(wide.x).toBeCloseTo(36, 5)
    expect(wide.width).toBeLessThanOrEqual(595.28 - 72 + 0.01)

    const tall = fitImageOnPage(100, 400)
    expect(tall.width / tall.height).toBeCloseTo(0.25, 5)
    expect(tall.height).toBeLessThanOrEqual(841.89 - 72 + 0.01)
  })

  it('creates one page per image', async () => {
    const png = bytesToFile(PNG_1X1, 'dot.png', 'image/png')
    const bytes = await imagesToPdf([png, png])
    const document = await PDFDocument.load(bytes)
    expect(document.getPageCount()).toBe(2)
    await expect(imagesToPdf([])).rejects.toThrow(/at least one/i)
  })
})

describe('rotatePdf', () => {
  it('rotates every page or only the selected pages', async () => {
    const file = await makePdfFile('turn.pdf', [
      [200, 100],
      [200, 100],
    ])
    const all = await PDFDocument.load(await rotatePdf(file, 90, 'all'))
    expect(all.getPage(0).getRotation().angle).toBe(90)
    expect(all.getPage(1).getRotation().angle).toBe(90)

    const selected = await PDFDocument.load(await rotatePdf(file, 180, '2'))
    expect(selected.getPage(0).getRotation().angle).toBe(0)
    expect(selected.getPage(1).getRotation().angle).toBe(180)

    const again = await PDFDocument.load(await rotatePdf(bytesToFile(await rotatePdf(file, 90, '1'), 'once.pdf', 'application/pdf'), 90, '1'))
    expect(again.getPage(0).getRotation().angle).toBe(180)
  })
})

describe('addPageNumbers', () => {
  it('draws numbers, honors the start value, and can skip the first page', async () => {
    const file = await makePdfFile('count.pdf', [
      [200, 200],
      [200, 200],
    ])
    const numbered = await addPageNumbers(file, {
      position: 'bottom-center',
      startNumber: 1,
      skipFirstPage: false,
    })
    const text = await drawnText(numbered)
    expect(text).toContain('<31> Tj')
    expect(text).toContain('<32> Tj')
    expect(text).toContain('28 Tm')
    expect((await PDFDocument.load(numbered)).getPageCount()).toBe(2)

    const skipped = await addPageNumbers(file, {
      position: 'top-center',
      startNumber: 5,
      skipFirstPage: true,
    })
    const skippedText = await drawnText(skipped)
    expect(skippedText).toContain('<35> Tj')
    expect(skippedText).not.toContain('<36> Tj')

    await expect(
      addPageNumbers(await makePdfFile('one.pdf', [[200, 200]]), {
        position: 'bottom-left',
        startNumber: 1,
        skipFirstPage: true,
      }),
    ).rejects.toThrow(/no pages left/i)
    await expect(
      addPageNumbers(file, { position: 'bottom-right', startNumber: -1, skipFirstPage: false }),
    ).rejects.toThrow(/starting number/i)
  })
})

describe('loadPdf', () => {
  it('explains encrypted and corrupted files', async () => {
    const secret = bytesToFile(encryptedPdfBytes(), 'secret.pdf', 'application/pdf')
    await expect(loadPdf(secret)).rejects.toThrow(/encrypted/i)

    const corrupt = bytesToFile(new TextEncoder().encode('%PDF-1.4\nnot-a-pdf'), 'corrupt.pdf', 'application/pdf')
    await expect(loadPdf(corrupt)).rejects.toThrow(/could not be opened/i)
  })
})
