import { useEffect, useRef, useState } from 'react'
import { ChoiceGroup } from '../../components/pdf/ChoiceGroup.tsx'
import { DownloadResult } from '../../components/pdf/DownloadResult.tsx'
import { ProcessingStatus } from '../../components/pdf/ProcessingStatus.tsx'
import { ToolLayout } from '../../components/pdf/ToolLayout.tsx'
import { Button } from '../../components/ui/button.tsx'
import { Input } from '../../components/ui/input.tsx'
import { usePdfAction } from '../../hooks/usePdfAction.ts'
import { createCode, type CodeFormat, type CodeOutput } from '../../lib/convert/qr-barcode.ts'
import { cloneBytes } from '../../lib/pdf/download.ts'
import { getTool } from '../../lib/tools.ts'

const tool = getTool('/qr-barcode')

const formats: readonly { value: CodeFormat; label: string }[] = [
  { value: 'qr', label: 'QR code' },
  { value: 'code128', label: 'Code 128' },
  { value: 'ean13', label: 'EAN-13' },
  { value: 'upca', label: 'UPC-A' },
  { value: 'code39', label: 'Code 39' },
]

const outputs: readonly { value: CodeOutput; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'pdf', label: 'PDF' },
]

export function QrBarcode() {
  const [value, setValue] = useState('')
  const [format, setFormat] = useState<CodeFormat>('qr')
  const [output, setOutput] = useState<CodeOutput>('png')
  const [preview, setPreview] = useState<string | null>(null)
  const previewUrl = useRef<string | null>(null)
  const action = usePdfAction()
  const { reset } = action

  const clearPreview = () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    previewUrl.current = null
    setPreview(null)
  }

  const changeInputs = (update: () => void) => {
    update()
    reset()
    clearPreview()
  }

  useEffect(() => {
    return () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    }
  }, [])

  return (
    <ToolLayout
      tool={tool}
      busy={action.status === 'processing'}
    >
      <div>
        <label htmlFor="code-value" className="text-sm text-foreground">
          Text or number
        </label>
        <Input
          id="code-value"
          value={value}
          autoComplete="off"
          className="mt-2"
          onChange={(event) => changeInputs(() => setValue(event.target.value))}
        />
      </div>
      <ChoiceGroup legend="Code type" name="code-format" value={format} options={formats} onChange={(next) => changeInputs(() => setFormat(next))} />
      <ChoiceGroup legend="Download as" name="code-output" value={output} options={outputs} onChange={(next) => changeInputs(() => setOutput(next))} />
      <Button
        className="w-full sm:w-auto"
        disabled={action.status === 'processing'}
        onClick={() => {
          void action.run(async () => {
            const result = await createCode(format, value, output)
            if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
            const url = URL.createObjectURL(new Blob([cloneBytes(result.preview)], { type: 'image/png' }))
            previewUrl.current = url
            setPreview(url)
            return result
          }, 'Creating code…')
        }}
      >
        {action.status === 'processing' ? 'Creating…' : 'Create code'}
      </Button>
      <ProcessingStatus status={action.status} message={action.message} />
      {preview ? <img src={preview} alt="Generated code" className="max-w-full rounded-xl border border-border bg-surface p-4" /> : null}
      {action.result ? <DownloadResult blob={action.result.blob} filename={action.result.filename} /> : null}
    </ToolLayout>
  )
}
