import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { pdfToPpt } from '../../lib/convert/pdf-to-ppt.ts'
import { validatePdfFile } from '../../lib/pdf/validate.ts'

export function PdfToPpt() {
  return (
    <SingleFileTool
      toolPath="/pdf-to-ppt"
      accept="application/pdf,.pdf"
      label="PDF file"
      validate={validatePdfFile}
      actionLabel="Convert to PowerPoint"
      busyLabel="Converting…"
      processingMessage="Building slides…"
      emptyMessage="Add a PDF file."
      run={async (file) => pdfToPpt(await file.arrayBuffer(), file.name)}
    />
  )
}
