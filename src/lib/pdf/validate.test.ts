import { describe, expect, it } from 'vitest'
import { bytesToFile, makePdfFile, PNG_1X1 } from '../../test/pdf-fixtures.ts'
import { validateImageFile, validatePdfFile } from './validate.ts'

describe('validatePdfFile', () => {
  it('accepts a PDF signature with an empty or generic mime type', async () => {
    const pdf = await makePdfFile('notes.pdf', [[200, 200]])
    expect(await validatePdfFile(pdf)).toBeNull()
    const generic = bytesToFile(new Uint8Array(await pdf.arrayBuffer()), 'notes.pdf', '')
    expect(await validatePdfFile(generic)).toBeNull()
    const octet = bytesToFile(new Uint8Array(await pdf.arrayBuffer()), 'notes.pdf', 'application/octet-stream')
    expect(await validatePdfFile(octet)).toBeNull()
  })

  it('rejects the wrong mime type even when the name ends in pdf', async () => {
    const png = bytesToFile(PNG_1X1, 'scan.pdf', 'image/png')
    expect(await validatePdfFile(png)).toMatch(/not a PDF/i)
  })

  it('rejects a PDF mime type when the signature is missing', async () => {
    const text = bytesToFile(new TextEncoder().encode('hello'), 'notes.pdf', 'application/pdf')
    expect(await validatePdfFile(text)).toMatch(/PDF signature/i)
  })

  it('rejects empty and oversized files', async () => {
    const empty = new File([], 'empty.pdf', { type: 'application/pdf' })
    expect(await validatePdfFile(empty)).toMatch(/empty/i)
    const pdf = await makePdfFile('big.pdf', [[120, 120]])
    expect(await validatePdfFile(pdf, 20)).toMatch(/over the/i)
  })
})

describe('validateImageFile', () => {
  it('accepts PNG and rejects other image types', async () => {
    expect(await validateImageFile(bytesToFile(PNG_1X1, 'dot.png', 'image/png'))).toBeNull()
    const gif = bytesToFile(new TextEncoder().encode('GIF89a'), 'anim.gif', 'image/gif')
    expect(await validateImageFile(gif)).toMatch(/not a JPG or PNG/i)
  })

  it('rejects a mime type that disagrees with the file signature', async () => {
    expect(await validateImageFile(bytesToFile(PNG_1X1, 'dot.jpg', 'image/jpeg'))).toMatch(/not a valid PNG/i)
  })
})
