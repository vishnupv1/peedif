import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { pdfToExcel } from '../../lib/convert/pdf-to-excel.ts'
import { validatePdfFile } from '../../lib/pdf/validate.ts'

export function PdfToExcel() {
  return (
    <SingleFileTool
      toolPath="/pdf-to-excel"
      accept="application/pdf,.pdf"
      label="PDF file"
      validate={validatePdfFile}
      actionLabel="Convert to Excel"
      busyLabel="Converting…"
      processingMessage="Copying text into a spreadsheet…"
      emptyMessage="Add a PDF file."
      run={async (file) => pdfToExcel(await file.arrayBuffer(), file.name)}
    />
  )
}
