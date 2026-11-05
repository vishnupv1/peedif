import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { pdfToWord } from '../../lib/convert/pdf-to-word.ts'
import { validatePdfFile } from '../../lib/pdf/validate.ts'

export function PdfToWord() {
  return (
    <SingleFileTool
      toolPath="/pdf-to-word"
      accept="application/pdf,.pdf"
      label="PDF file"
      validate={validatePdfFile}
      actionLabel="Convert to Word"
      busyLabel="Converting…"
      processingMessage="Copying text into a Word document…"
      emptyMessage="Add a PDF file."
      run={async (file) => pdfToWord(await file.arrayBuffer(), file.name)}
    />
  )
}
