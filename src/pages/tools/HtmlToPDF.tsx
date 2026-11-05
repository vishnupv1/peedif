import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { htmlFileToPdf } from '../../lib/convert/html-to-pdf.ts'
import { validateHtmlFile } from '../../lib/pdf/validate.ts'

export function HtmlToPDF() {
  return (
    <SingleFileTool
      toolPath="/html-to-pdf"
      accept=".html,.htm,text/html"
      label="HTML file"
      validate={validateHtmlFile}
      actionLabel="Convert to PDF"
      busyLabel="Converting…"
      processingMessage="Reading the HTML file…"
      emptyMessage="Add an HTML file."
      run={(file) => htmlFileToPdf(file)}
    />
  )
}
