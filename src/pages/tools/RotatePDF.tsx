import { useEffect, useState } from 'react'
import { ChoiceGroup } from '../../components/pdf/ChoiceGroup.tsx'
import { DocumentSummary } from '../../components/pdf/DocumentSummary.tsx'
import { DownloadResult } from '../../components/pdf/DownloadResult.tsx'
import { ErrorList } from '../../components/pdf/ErrorList.tsx'
import { FileDropzone } from '../../components/pdf/FileDropzone.tsx'
import { FileList } from '../../components/pdf/FileList.tsx'
import { PageRangeField } from '../../components/pdf/PageRangeField.tsx'
import { ProcessingStatus } from '../../components/pdf/ProcessingStatus.tsx'
import { ToolLayout } from '../../components/pdf/ToolLayout.tsx'
import { Button } from '../../components/ui/button.tsx'
import { usePdfAction } from '../../hooks/usePdfAction.ts'
import { usePdfDocument } from '../../hooks/usePdfDocument.ts'
import { usePdfFiles } from '../../hooks/usePdfFiles.ts'
import { outputFilename } from '../../lib/pdf/download.ts'
import { rotatePdf, type RotationDegrees } from '../../lib/pdf/rotate.ts'
import { getTool } from '../../lib/tools.ts'

const tool = getTool('/rotate-pdf')

export function RotatePDF() {
  const { files, errors, addFiles, removeFile } = usePdfFiles('pdf', false)
  const file = files[0]?.file ?? null
  const document = usePdfDocument(file)
  const action = usePdfAction()
  const { reset } = action
  const [degrees, setDegrees] = useState<RotationDegrees>(90)
  const [scope, setScope] = useState<'all' | 'selected'>('all')
  const [range, setRange] = useState('')
  const fileKey = files.map((item) => item.id).join('|')

  useEffect(() => {
    reset()
  }, [fileKey, degrees, scope, range, reset])

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
      <ChoiceGroup
        legend="Rotation"
        name="rotation"
        value={String(degrees) as '90' | '180' | '270'}
        options={[
          { value: '90', label: '90°' },
          { value: '180', label: '180°' },
          { value: '270', label: '270°' },
        ]}
        onChange={(value) => setDegrees(Number(value) as RotationDegrees)}
      />
      <ChoiceGroup
        legend="Pages"
        name="rotate-scope"
        value={scope}
        options={[
          { value: 'all', label: 'All pages' },
          { value: 'selected', label: 'Selected pages' },
        ]}
        onChange={setScope}
      />
      {scope === 'selected' ? (
        <PageRangeField id="rotate-pages" label="Pages to rotate" value={range} onChange={setRange} pageCount={document.pageCount} />
      ) : null}
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          if (!file) {
            action.fail('Add a PDF to rotate.')
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
          void action.run(async () => {
            const bytes = await rotatePdf(file, degrees, scope === 'all' ? 'all' : range)
            return { bytes, filename: outputFilename(file.name, 'rotated') }
          }, 'Rotating pages…')
        }}
      >
        {action.status === 'processing' ? 'Rotating…' : 'Rotate PDF'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}
