import { SingleFileTool } from '../../components/pdf/SingleFileTool.tsx'
import { ocrToPdf } from '../../lib/convert/ocr.ts'
import { validateOcrFile } from '../../lib/pdf/validate.ts'

export function OcrPDF() {
  return (
    <SingleFileTool
      toolPath="/ocr"
      accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
      label="PDF or image"
      validate={validateOcrFile}
      actionLabel="Recognize text"
      busyLabel="Recognizing…"
      processingMessage="Recognizing text…"
      emptyMessage="Add a PDF, JPG, or PNG."
      run={(file) => ocrToPdf(file)}
    />
  )
}
