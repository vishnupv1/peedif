import { useEffect, useState } from 'react'
import { DownloadResult } from '../../components/pdf/DownloadResult.tsx'
import { ErrorList } from '../../components/pdf/ErrorList.tsx'
import { FileDropzone } from '../../components/pdf/FileDropzone.tsx'
import { FileList } from '../../components/pdf/FileList.tsx'
import { ProcessingStatus } from '../../components/pdf/ProcessingStatus.tsx'
import { ToolLayout } from '../../components/pdf/ToolLayout.tsx'
import { Button } from '../../components/ui/button.tsx'
import { Input } from '../../components/ui/input.tsx'
import { usePdfAction } from '../../hooks/usePdfAction.ts'
import { usePdfFiles } from '../../hooks/usePdfFiles.ts'
import { htmlFileToPdf, htmlStringToPdf } from '../../lib/convert/html-to-pdf.ts'
import { fetchWebpageHtml } from '../../lib/convert/webpage.ts'
import { validateHtmlFile } from '../../lib/pdf/validate.ts'
import { getTool } from '../../lib/tools.ts'

const tool = getTool('/webpage-to-pdf')

export function WebpageToPDF() {
  const [address, setAddress] = useState('')
  const { files, errors, addFiles, removeFile } = usePdfFiles('file', false, validateHtmlFile)
  const action = usePdfAction()
  const { reset } = action
  const file = files[0]

  useEffect(() => {
    reset()
  }, [file?.id, address, reset])

  return (
    <ToolLayout
      tool={tool}
      busy={action.status === 'processing'}
    >
      <div>
        <label htmlFor="webpage-url" className="text-sm text-foreground">
          Web address
        </label>
        <Input
          id="webpage-url"
          type="url"
          inputMode="url"
          autoComplete="off"
          placeholder="https://example.com"
          value={address}
          className="mt-2"
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>
      <FileDropzone
        accept=".html,.htm,text/html"
        disabled={action.status === 'processing'}
        label="Saved HTML file"
        hint={tool.fileHint}
        onFiles={(next) => void addFiles(next)}
      />
      <ErrorList errors={errors} />
      <FileList files={files} onRemove={removeFile} />
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          if (!file && !address.trim()) {
            action.fail('Enter a web address or add a saved HTML file.')
            return
          }
          void action.run(async () => {
            if (file) return htmlFileToPdf(file.file)
            const html = await fetchWebpageHtml(address)
            return htmlStringToPdf(html, 'webpage.html')
          }, 'Creating PDF…')
        }}
      >
        {action.status === 'processing' ? 'Converting…' : 'Convert to PDF'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}
