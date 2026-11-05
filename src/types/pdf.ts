export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

export type PdfFile = {
  id: string
  file: File
  name: string
  size: number
}

export type DocumentFile = PdfFile & {
  previewUrl?: string
}

export type FileKind = 'pdf' | 'image' | 'file'
