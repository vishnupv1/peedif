import { useEffect } from 'react'
import type { PdfActionOutput } from '../../hooks/usePdfAction.ts'
import { usePdfAction } from '../../hooks/usePdfAction.ts'
import { usePdfFiles } from '../../hooks/usePdfFiles.ts'
import { getTool } from '../../lib/tools.ts'
import { Button } from '../ui/button.tsx'
import { DownloadResult } from './DownloadResult.tsx'
import { ErrorList } from './ErrorList.tsx'
import { FileDropzone } from './FileDropzone.tsx'
import { FileList } from './FileList.tsx'
import { ProcessingStatus } from './ProcessingStatus.tsx'
import { ToolLayout } from './ToolLayout.tsx'

type SingleFileToolProps = {
  toolPath: string
  accept: string
  label: string
  validate: (file: File) => Promise<string | null>
  actionLabel: string
  busyLabel: string
  processingMessage: string
  emptyMessage: string
  run: (file: File) => Promise<PdfActionOutput>
}

export function SingleFileTool({
  toolPath,
  accept,
  label,
  validate,
  actionLabel,
  busyLabel,
  processingMessage,
  emptyMessage,
  run,
}: SingleFileToolProps) {
  const tool = getTool(toolPath)
  const { files, errors, addFiles, removeFile } = usePdfFiles('file', false, validate)
  const action = usePdfAction()
  const { reset } = action
  const file = files[0]

  useEffect(() => {
    reset()
  }, [file?.id, reset])

  return (
    <ToolLayout
      tool={tool}
      busy={action.status === 'processing'}
    >
      <FileDropzone
        accept={accept}
        disabled={action.status === 'processing'}
        label={label}
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
            action.fail(emptyMessage)
            return
          }
          void action.run(() => run(file.file), processingMessage)
        }}
      >
        {action.status === 'processing' ? busyLabel : actionLabel}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}
