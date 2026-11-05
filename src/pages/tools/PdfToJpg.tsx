import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { pdfToJpg } from '../../lib/convert/pdf-to-jpg.ts'
import { validatePdfFile } from '../../lib/pdf/validate.ts'

export function PdfToJpg() {
  return (
    <SingleFileTool
      toolPath="/pdf-to-jpg"
      accept="application/pdf,.pdf"
      label="PDF file"
      validate={validatePdfFile}
      actionLabel="Convert to JPG"
      busyLabel="Converting…"
      processingMessage="Rendering pages…"
      emptyMessage="Add a PDF file."
      run={async (file) => pdfToJpg(await file.arrayBuffer(), file.name)}
    />
  )
}
