import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { wordToPdf } from '../../lib/convert/word-to-pdf.ts'
import { validateDocxFile } from '../../lib/pdf/validate.ts'

export function WordToPDF() {
  return (
    <SingleFileTool
      toolPath="/word-to-pdf"
      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      label="Word document"
      validate={validateDocxFile}
      actionLabel="Convert to PDF"
      busyLabel="Converting…"
      processingMessage="Reading the Word document…"
      emptyMessage="Add a Word document."
      run={async (file) => wordToPdf(await file.arrayBuffer(), file.name)}
    />
  )
}
