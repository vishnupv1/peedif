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
import { imagesToPdf } from '../../lib/pdf/images-to-pdf.ts'
import { getTool } from '../../lib/tools.ts'

export function ImagesToPDF({ toolPath = '/images-to-pdf' }: { toolPath?: string }) {
  const tool = getTool(toolPath)
  const { files, errors, addFiles, removeFile, moveFile } = usePdfFiles('image', true)
  const action = usePdfAction()
  const { reset } = action
  const fileKey = files.map((file) => file.id).join('|')

  useEffect(() => {
    reset()
  }, [fileKey, reset])

  return (
    <ToolLayout
      tool={tool}
      busy={action.status === 'processing'}
    >
      <FileDropzone
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        multiple
        disabled={action.status === 'processing'}
        label="JPG or PNG images"
        hint={tool.fileHint}
        onFiles={(next) => void addFiles(next)}
      />
      <ErrorList errors={errors} />
      <FileList files={files} onRemove={removeFile} onMove={moveFile} />
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          if (files.length === 0) {
            action.fail('Add at least one JPG or PNG image.')
            return
          }
          void action.run(async () => {
            const bytes = await imagesToPdf(files.map((file) => file.file))
            return { bytes, filename: 'images.pdf' }
          }, 'Creating PDF…')
        }}
      >
        {action.status === 'processing' ? 'Creating…' : 'Create PDF'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}
