import { PDFDocument, StandardFonts } from 'pdf-lib'
import { savePdf } from '../pdf/save.ts'
import { toWinAnsi } from '../pdf/text-layout.ts'

export type CodeFormat = 'qr' | 'code128' | 'ean13' | 'upca' | 'code39'
export type CodeOutput = 'png' | 'pdf'

const BARCODE_FORMAT: Record<Exclude<CodeFormat, 'qr'>, string> = {
  code128: 'CODE128',
  ean13: 'EAN13',
  upca: 'UPC',
  code39: 'CODE39',
}

export function validateCodeInput(format: CodeFormat, value: string): string {
  const text = value.trim()
  if (!text) throw new Error('Enter the text or number to encode.')
  if (format === 'qr') {
    if (text.length > 1500) throw new Error('QR text must be 1500 characters or fewer.')
    return text
  }
  if (format === 'ean13' && !/^\d{12,13}$/.test(text)) throw new Error('EAN-13 needs 12 or 13 digits.')
  if (format === 'upca' && !/^\d{11,12}$/.test(text)) throw new Error('UPC-A needs 11 or 12 digits.')
  if (format === 'code39' && !/^[0-9A-Z .\-$/+%]+$/i.test(text)) {
    throw new Error('Code 39 can use letters, numbers, spaces, and - . $ / + %.')
  }
  if (format === 'code128' && (text.length > 80 || [...text].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) > 126))) {
    throw new Error('Code 128 can use up to 80 standard keyboard characters.')
  }
  return format === 'code39' ? text.toUpperCase() : text
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? ''
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

async function canvasToPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('The code could not be created.'))), 'image/png')
  })
  return new Uint8Array(await blob.arrayBuffer())
}

async function drawCode(format: CodeFormat, text: string): Promise<Uint8Array> {
  if (format === 'qr') {
    const { toDataURL } = await import('qrcode')
    const url = await toDataURL(text, { margin: 1, width: 512, errorCorrectionLevel: 'M' })
    return dataUrlToBytes(url)
  }
  const { default: JsBarcode } = await import('jsbarcode')
  const canvas = document.createElement('canvas')
  let valid = true
  try {
    JsBarcode(canvas, text, {
      format: BARCODE_FORMAT[format],
      displayValue: true,
      margin: 16,
      height: 120,
      valid: (ok: boolean) => {
        valid = ok
      },
    })
  } catch {
    throw new Error('That value is not valid for this barcode.')
  }
  if (!valid) throw new Error('That value is not valid for this barcode.')
  return canvasToPng(canvas)
}

async function pngToPdf(png: Uint8Array, caption: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const image = await pdf.embedPng(png)
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const label = caption.length <= 80 ? toWinAnsi(caption) : ''
  const margin = 36
  const captionHeight = label ? 28 : 0
  const page = pdf.addPage([image.width + margin * 2, image.height + margin * 2 + captionHeight])
  page.drawImage(image, { x: margin, y: margin + captionHeight, width: image.width, height: image.height })
  if (label) {
    const width = font.widthOfTextAtSize(label, 12)
    page.drawText(label, { x: Math.max(margin, (page.getWidth() - width) / 2), y: 16, size: 12, font })
  }
  return savePdf(pdf)
}

export async function createCode(format: CodeFormat, value: string, output: CodeOutput): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
  preview: Uint8Array
}> {
  const text = validateCodeInput(format, value)
  const preview = await drawCode(format, text)
  if (output === 'png') {
    return { bytes: preview, filename: `${format}.png`, mimeType: 'image/png', preview }
  }
  const bytes = await pngToPdf(preview, text)
  return { bytes, filename: `${format}.pdf`, mimeType: 'application/pdf', preview }
}
