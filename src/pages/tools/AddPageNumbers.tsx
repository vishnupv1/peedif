import { useEffect, useState } from 'react'
import { ChoiceGroup } from '../../components/pdf/ChoiceGroup.tsx'
import { DocumentSummary } from '../../components/pdf/DocumentSummary.tsx'
import { DownloadResult } from '../../components/pdf/DownloadResult.tsx'
import { ErrorList } from '../../components/pdf/ErrorList.tsx'
import { FileDropzone } from '../../components/pdf/FileDropzone.tsx'
import { FileList } from '../../components/pdf/FileList.tsx'
import { ProcessingStatus } from '../../components/pdf/ProcessingStatus.tsx'
import { ToolLayout } from '../../components/pdf/ToolLayout.tsx'
import { Button } from '../../components/ui/button.tsx'
import { Input } from '../../components/ui/input.tsx'
import { usePdfAction } from '../../hooks/usePdfAction.ts'
import { usePdfDocument } from '../../hooks/usePdfDocument.ts'
import { usePdfFiles } from '../../hooks/usePdfFiles.ts'
import { outputFilename } from '../../lib/pdf/download.ts'
import { addPageNumbers } from '../../lib/pdf/page-numbers.ts'
import type { PageNumberPosition } from '../../lib/pdf/page-number-layout.ts'
import { getTool } from '../../lib/tools.ts'

const tool = getTool('/add-page-numbers')

const positions: readonly { value: PageNumberPosition; label: string }[] = [
  { value: 'bottom-center', label: 'Bottom center' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
  { value: 'top-center', label: 'Top center' },
]

export function AddPageNumbers() {
  const { files, errors, addFiles, removeFile } = usePdfFiles('pdf', false)
  const file = files[0]?.file ?? null
  const document = usePdfDocument(file)
  const action = usePdfAction()
  const { reset } = action
  const [position, setPosition] = useState<PageNumberPosition>('bottom-center')
  const [startNumber, setStartNumber] = useState('1')
  const [skipFirstPage, setSkipFirstPage] = useState(false)
  const fileKey = files.map((item) => item.id).join('|')

  useEffect(() => {
    reset()
  }, [fileKey, position, startNumber, skipFirstPage, reset])

  const visibleErrors = document.error ? [...errors, document.error] : errors

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
      <ErrorList errors={visibleErrors} />
      <FileList files={files} onRemove={removeFile} />
      <DocumentSummary loading={document.loading} pageCount={document.pageCount} />
      <ChoiceGroup legend="Position" name="page-number-position" value={position} options={positions} onChange={setPosition} />
      <div>
        <label htmlFor="start-number" className="text-sm text-foreground">
          Starting number
        </label>
        <Input
          id="start-number"
          className="mt-2 max-w-40"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={startNumber}
          onChange={(event) => setStartNumber(event.target.value)}
        />
      </div>
      <label className="flex min-h-11 items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={skipFirstPage}
          onChange={(event) => setSkipFirstPage(event.target.checked)}
        />
        Skip the first page
      </label>
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          if (!file) {
            action.fail('Add a PDF to number.')
            return
          }
          if (document.loading) {
            action.fail('Wait until the PDF has been read.')
            return
          }
          if (document.error) {
            action.fail(document.error)
            return
          }
          if (!/^\d+$/.test(startNumber.trim())) {
            action.fail('Enter a starting number of 0 or greater.')
            return
          }
          void action.run(async () => {
            const bytes = await addPageNumbers(file, {
              position,
              startNumber: Number(startNumber.trim()),
              skipFirstPage,
            })
            return { bytes, filename: outputFilename(file.name, 'numbered') }
          }, 'Adding page numbers…')
        }}
      >
        {action.status === 'processing' ? 'Adding numbers…' : 'Add page numbers'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}
