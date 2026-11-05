import { useEffect } from 'react'
import { DownloadResult } from '../../components/pdf/DownloadResult.tsx'
import { ErrorList } from '../../components/pdf/ErrorList.tsx'
import { FileDropzone } from '../../components/pdf/FileDropzone.tsx'
import { FileList } from '../../components/pdf/FileList.tsx'
import { ProcessingStatus } from '../../components/pdf/ProcessingStatus.tsx'
import { ToolLayout } from '../../components/pdf/ToolLayout.tsx'
import { Button } from '../../components/ui/button.tsx'
import { usePdfAction } from '../../hooks/usePdfAction.ts'
import { usePdfFiles } from '../../hooks/usePdfFiles.ts'
import { compressPdf, describeCompression } from '../../lib/pdf/compress.ts'
import { outputFilename } from '../../lib/pdf/download.ts'
import { getTool } from '../../lib/tools.ts'

const tool = getTool('/compress-pdf')

export function CompressPDF() {
  const { files, errors, addFiles, removeFile } = usePdfFiles('pdf', false)
  const action = usePdfAction()
  const { reset } = action
  const file = files[0]?.file
  const fileKey = files.map((item) => item.id).join('|')

  useEffect(() => {
    reset()
  }, [fileKey, reset])

  return (
    <ToolLayout
      tool={tool}
      busy={action.status === 'processing'}
    >
      <FileDropzone
        accept="application/pdf,.pdf"
        disabled={action.status === 'processing'}
        label="PDF file"
        hint={tool.fileHint}
        onFiles={(next) => void addFiles(next)}
      />
      <ErrorList errors={errors} />
      <FileList files={files} onRemove={removeFile} />
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          if (!file) {
            action.fail('Add a PDF to re-save.')
            return
          }
          void action.run(async () => {
            const result = await compressPdf(file)
            return {
              bytes: result.bytes,
              filename: outputFilename(file.name, 'compressed'),
              message: describeCompression(result.originalSize, result.outputSize),
              originalSize: result.originalSize,
              outputSize: result.outputSize,
            }
          }, 'Re-saving PDF…')
        }}
      >
        {action.status === 'processing' ? 'Re-saving…' : 'Re-save PDF'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? (
        <DownloadResult
          blob={action.result.blob}
          filename={action.result.filename}
          originalSize={action.result.originalSize}
          outputSize={action.result.outputSize}
        />
      ) : null}
    </ToolLayout>
  )
}
