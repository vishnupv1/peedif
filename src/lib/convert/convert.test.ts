import { describe, expect, it } from 'vitest'
import { excelToPdf } from './excel-to-pdf.ts'
import { blocksFromHtml } from './html-blocks.ts'
import { htmlStringToPdf } from './html-to-pdf.ts'
import { validateCodeInput } from './qr-barcode.ts'
import { textsFromSlideXml } from './slide-text.ts'
import { assertLanguagePair } from './translate.ts'
import { assertWebpageUrl } from './webpage.ts'
import { cloneBytes } from '../pdf/download.ts'
import { linesFromTextItems } from '../pdf/text-items.ts'
import { validateDocxFile } from '../pdf/validate.ts'

describe('text grouping', () => {
  it('keeps items on the same line together and reads left to right', () => {
    const lines = linesFromTextItems([
      { text: 'World', x: 40, y: 100 },
      { text: 'Hello', x: 10, y: 100 },
      { text: 'Next', x: 10, y: 80 },
    ])
    expect(lines).toEqual(['Hello World', 'Next'])
  })
})

describe('html blocks', () => {
  it('reads headings, paragraphs, and table cells', () => {
    const blocks = blocksFromHtml('<h1>Title</h1><p>Hello</p><table><tr><td>A</td><td>B</td></tr></table><script>secret()</script>')
    expect(blocks.map((block) => block.text)).toEqual(['Title', 'Hello', 'A | B'])
  })
})

describe('slide text', () => {
  it('reads text runs from slide xml', () => {
    expect(textsFromSlideXml('<a:t>Hello</a:t><a:t> &amp; bye</a:t>')).toEqual(['Hello', '& bye'])
  })
})

describe('translation languages', () => {
  it('requires two different supported languages', () => {
    expect(() => assertLanguagePair('en', 'es')).not.toThrow()
    expect(() => assertLanguagePair('en', 'en')).toThrow(/different target language/i)
    expect(() => assertLanguagePair('en', 'xx')).toThrow(/supported language/i)
  })
})

describe('webpage addresses', () => {
  it('accepts http addresses and rejects other protocols', () => {
    expect(assertWebpageUrl('https://example.com/path').hostname).toBe('example.com')
    expect(() => assertWebpageUrl('javascript:alert(1)')).toThrow(/http and https/i)
    expect(() => assertWebpageUrl('example.com')).toThrow(/full web address/i)
  })
})

describe('code input', () => {
  it('checks barcode shapes before drawing', () => {
    expect(validateCodeInput('qr', 'hello')).toBe('hello')
    expect(validateCodeInput('code39', 'ab-1')).toBe('AB-1')
    expect(() => validateCodeInput('ean13', '123')).toThrow(/12 or 13/)
    expect(() => validateCodeInput('qr', '')).toThrow(/Enter the text/)
  })
})

describe('office and spreadsheet conversion', () => {
  it('recognizes a docx zip and rejects a zip that is not a word file', async () => {
    const { default: JSZip } = await import('jszip')
    const docx = new JSZip()
    docx.file('word/document.xml', '<w:document/>')
    const docxBytes = await docx.generateAsync({ type: 'uint8array' })
    const docxFile = new File([cloneBytes(docxBytes)], 'note.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    expect(await validateDocxFile(docxFile)).toBeNull()

    const other = new JSZip()
    other.file('xl/workbook.xml', '<workbook/>')
    const otherBytes = await other.generateAsync({ type: 'uint8array' })
    const otherFile = new File([cloneBytes(otherBytes)], 'sheet.docx', { type: '' })
    expect(await validateDocxFile(otherFile)).toMatch(/not a Word file/)
  })

  it('writes spreadsheet rows into a pdf', async () => {
    const { utils, write } = await import('xlsx')
    const book = utils.book_new()
    utils.book_append_sheet(book, utils.aoa_to_sheet([['Name', 'Qty'], ['Paper', '2']]), 'Stock')
    const bytes = write(book, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer
    const pdf = await excelToPdf(bytes, 'stock.xlsx')
    expect(pdf.filename).toBe('stock.pdf')
    expect(String.fromCharCode(...pdf.bytes.slice(0, 5))).toBe('%PDF-')
  })

  it('writes html text into a pdf', async () => {
    const pdf = await htmlStringToPdf('<p>Hello friend</p>', 'note.html')
    expect(pdf.filename).toBe('note.pdf')
    expect(String.fromCharCode(...pdf.bytes.slice(0, 5))).toBe('%PDF-')
  })
})
