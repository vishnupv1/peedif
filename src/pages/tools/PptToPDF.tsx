import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { pptToPdf } from '../../lib/convert/ppt-to-pdf.ts'
import { validatePptxFile } from '../../lib/pdf/validate.ts'

export function PptToPDF() {
  return (
    <SingleFileTool
      toolPath="/ppt-to-pdf"
      accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      label="PowerPoint file"
      validate={validatePptxFile}
      actionLabel="Convert to PDF"
      busyLabel="Converting…"
      processingMessage="Reading slides…"
      emptyMessage="Add a PowerPoint file."
      run={async (file) => pptToPdf(await file.arrayBuffer(), file.name)}
    />
  )
}
