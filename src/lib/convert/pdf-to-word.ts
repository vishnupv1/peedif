import { Document, Packer, PageBreak, Paragraph, TextRun } from 'docx'
import { downloadName } from '../pdf/download.ts'
import { extractPageLines, hasExtractableText } from '../pdf/pdfjs-document.ts'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export async function pdfToWord(data: ArrayBuffer, originalName?: string): Promise<{
  bytes: Uint8Array
  filename: string
  mimeType: string
}> {
  const pages = await extractPageLines(data)
  if (!hasExtractableText(pages)) {
    throw new Error('This PDF has no text that can be copied. Scanned pages are not turned into Word text.')
  }

  const children: Paragraph[] = []
  pages.forEach((lines, index) => {
    if (index > 0) children.push(new Paragraph({ children: [new PageBreak()] }))
    const content = lines.length > 0 ? lines : ['']
    for (const line of content) {
      children.push(new Paragraph({ children: [new TextRun(line || ' ')] }))
    }
  })

  const document = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(document)
  return {
    bytes: new Uint8Array(await blob.arrayBuffer()),
    filename: downloadName(originalName, 'docx'),
    mimeType: DOCX_MIME,
  }
}
