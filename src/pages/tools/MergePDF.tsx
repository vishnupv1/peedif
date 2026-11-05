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
import { mergePdfs } from '../../lib/pdf/merge.ts'
import { getTool } from '../../lib/tools.ts'

const tool = getTool('/merge-pdf')

export function MergePDF() {
  const { files, errors, addFiles, removeFile, moveFile } = usePdfFiles('pdf', true)
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
        accept="application/pdf,.pdf"
        multiple
        disabled={action.status === 'processing'}
        label="PDF files"
        hint={tool.fileHint}
        onFiles={(next) => void addFiles(next)}
      />
      <ErrorList errors={errors} />
      <FileList files={files} onRemove={removeFile} onMove={moveFile} />
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          if (files.length < 2) {
            action.fail('Add at least two PDF files to merge.')
            return
          }
          void action.run(async () => {
            const bytes = await mergePdfs(files.map((file) => file.file))
            return { bytes, filename: 'merged.pdf' }
          }, 'Merging PDFs…')
        }}
      >
        {action.status === 'processing' ? 'Merging…' : 'Merge PDFs'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}
