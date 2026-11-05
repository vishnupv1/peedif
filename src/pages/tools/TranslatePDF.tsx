import { useEffect, useState } from 'react'
import { DownloadResult } from '../../components/pdf/DownloadResult.tsx'
import { ErrorList } from '../../components/pdf/ErrorList.tsx'
import { FileDropzone } from '../../components/pdf/FileDropzone.tsx'
import { FileList } from '../../components/pdf/FileList.tsx'
import { ProcessingStatus } from '../../components/pdf/ProcessingStatus.tsx'
import { ToolLayout } from '../../components/pdf/ToolLayout.tsx'
import { Button } from '../../components/ui/button.tsx'
import { usePdfAction } from '../../hooks/usePdfAction.ts'
import { usePdfFiles } from '../../hooks/usePdfFiles.ts'
import { translationLanguages, translatePdf, type TranslationLanguage } from '../../lib/convert/translate.ts'
import { cn } from '../../lib/utils.ts'
import { getTool } from '../../lib/tools.ts'

const tool = getTool('/translate')

export function TranslatePDF() {
  const [source, setSource] = useState<TranslationLanguage>('en')
  const [target, setTarget] = useState<TranslationLanguage>('es')
  const { files, errors, addFiles, removeFile } = usePdfFiles('pdf', false)
  const action = usePdfAction()
  const { reset } = action
  const file = files[0]

  useEffect(() => {
    reset()
  }, [file?.id, source, target, reset])

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
      <div className="grid gap-4 sm:grid-cols-2">
        <LanguageField id="source-language" label="From" value={source} onChange={setSource} />
        <LanguageField id="target-language" label="To" value={target} onChange={setTarget} />
      </div>
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          if (!file) {
            action.fail('Add a PDF file.')
            return
          }
          void action.run(
            async () => translatePdf(await file.file.arrayBuffer(), file.name, source, target),
            'Translating…',
          )
        }}
      >
        {action.status === 'processing' ? 'Translating…' : 'Translate PDF'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}

function LanguageField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: TranslationLanguage
  onChange: (value: TranslationLanguage) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        className={cn('mt-2 h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground')}
        onChange={(event) => onChange(event.target.value as TranslationLanguage)}
      >
        {translationLanguages.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
