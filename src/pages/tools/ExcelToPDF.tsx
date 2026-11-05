import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { excelToPdf } from '../../lib/convert/excel-to-pdf.ts'
import { validateXlsxFile } from '../../lib/pdf/validate.ts'

export function ExcelToPDF() {
  return (
    <SingleFileTool
      toolPath="/excel-to-pdf"
      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      label="Excel file"
      validate={validateXlsxFile}
      actionLabel="Convert to PDF"
      busyLabel="Converting…"
      processingMessage="Reading the spreadsheet…"
      emptyMessage="Add an Excel file."
      run={async (file) => excelToPdf(await file.arrayBuffer(), file.name)}
    />
  )
}
