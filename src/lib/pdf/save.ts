import type { PDFDocument } from 'pdf-lib'

export async function savePdf(document: PDFDocument): Promise<Uint8Array> {
  return document.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
  })
}
