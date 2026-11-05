import { MAX_FILE_SIZE_BYTES } from '../../types/pdf.ts'
import { formatFileSize } from '../utils.ts'

export async function readFileHeader(file: File, length: number): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(0, length).arrayBuffer())
}

export function hasPdfSignature(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  )
}

export function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
}

export function isZip(bytes: Uint8Array): boolean {
  return bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)
}

export function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
}

function sizeError(file: File, maxSize: number): string | null {
  if (file.size <= 0) return `"${file.name}" is empty.`
  if (file.size > maxSize) {
    return `"${file.name}" is ${formatFileSize(file.size)}, which is over the ${formatFileSize(maxSize)} limit.`
  }
  return null
}

function isAllowedPdfMime(mime: string): boolean {
  return mime === '' || mime === 'application/pdf' || mime === 'application/x-pdf' || mime === 'application/octet-stream'
}

export async function validatePdfFile(file: File, maxSize = MAX_FILE_SIZE_BYTES): Promise<string | null> {
  const sized = sizeError(file, maxSize)
  if (sized) return sized
  if (!isAllowedPdfMime(file.type.toLowerCase())) {
    return `"${file.name}" is not a PDF. This tool accepts PDF files only.`
  }
  const header = await readFileHeader(file, 5)
  if (!hasPdfSignature(header)) {
    return `"${file.name}" is not a valid PDF. The file does not have a PDF signature.`
  }
  return null
}

export async function validateImageFile(file: File, maxSize = MAX_FILE_SIZE_BYTES): Promise<string | null> {
  const sized = sizeError(file, maxSize)
  if (sized) return sized
  const header = await readFileHeader(file, 8)
  const jpeg = isJpeg(header)
  const png = isPng(header)
  if (!jpeg && !png) {
    return `"${file.name}" is not a JPG or PNG image.`
  }
  const mime = file.type.toLowerCase()
  if (mime && mime !== 'application/octet-stream') {
    const jpegMime = mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/pjpeg'
    const pngMime = mime === 'image/png' || mime === 'image/x-png'
    if (jpeg && !jpegMime) return `"${file.name}" is not a valid JPEG image.`
    if (png && !pngMime) return `"${file.name}" is not a valid PNG image.`
  }
  return null
}

const OFFICE_MIME = new Set([
  '',
  'application/octet-stream',
  'application/zip',
  'application/x-zip-compressed',
])

async function zipPaths(file: File): Promise<string[] | null> {
  const header = await readFileHeader(file, 4)
  if (!isZip(header)) return null
  const { default: JSZip } = await import('jszip')
  try {
    const zip = await JSZip.loadAsync(await file.arrayBuffer())
    return Object.keys(zip.files)
  } catch {
    return null
  }
}

async function validateOfficeFile(
  file: File,
  mime: string,
  marker: string,
  label: string,
  maxSize = MAX_FILE_SIZE_BYTES,
): Promise<string | null> {
  const sized = sizeError(file, maxSize)
  if (sized) return sized
  const type = file.type.toLowerCase()
  if (type && type !== mime && !OFFICE_MIME.has(type)) {
    return `"${file.name}" is not a ${label} file.`
  }
  const paths = await zipPaths(file)
  if (!paths) return `"${file.name}" is not a valid ${label} file.`
  if (!paths.includes(marker)) return `"${file.name}" is not a ${label} file.`
  return null
}

export function validateDocxFile(file: File, maxSize = MAX_FILE_SIZE_BYTES): Promise<string | null> {
  return validateOfficeFile(
    file,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'word/document.xml',
    'Word',
    maxSize,
  )
}

export function validatePptxFile(file: File, maxSize = MAX_FILE_SIZE_BYTES): Promise<string | null> {
  return validateOfficeFile(
    file,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ppt/presentation.xml',
    'PowerPoint',
    maxSize,
  )
}

export function validateXlsxFile(file: File, maxSize = MAX_FILE_SIZE_BYTES): Promise<string | null> {
  return validateOfficeFile(
    file,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xl/workbook.xml',
    'Excel',
    maxSize,
  )
}

export async function validateOcrFile(file: File, maxSize = MAX_FILE_SIZE_BYTES): Promise<string | null> {
  const sized = sizeError(file, maxSize)
  if (sized) return sized
  const header = await readFileHeader(file, 8)
  if (hasPdfSignature(header)) return validatePdfFile(file, maxSize)
  if (isJpeg(header) || isPng(header)) return validateImageFile(file, maxSize)
  return `"${file.name}" must be a PDF, JPG, or PNG.`
}

export async function validateHtmlFile(file: File, maxSize = MAX_FILE_SIZE_BYTES): Promise<string | null> {
  const sized = sizeError(file, maxSize)
  if (sized) return sized
  const type = file.type.toLowerCase()
  const allowed =
    type === '' ||
    type === 'text/html' ||
    type === 'application/xhtml+xml' ||
    type === 'text/plain' ||
    type === 'application/octet-stream'
  if (!allowed) return `"${file.name}" is not an HTML file.`
  const text = await file.text()
  if (text.includes('\u0000') || !/<\s*\/?[a-z!]/i.test(text)) {
    return `"${file.name}" is not an HTML file.`
  }
  return null
}
