import { Input } from '../ui/input.tsx'

type PageRangeFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  pageCount: number | null
}

export function PageRangeField({ id, label, value, onChange, pageCount }: PageRangeFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-foreground">
        {label}
      </label>
      <Input
        id={id}
        className="mt-2"
        value={value}
        placeholder="1-3, 5, 7-9"
        autoComplete="off"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="mt-2 text-sm leading-6 text-muted">
        {pageCount === null
          ? 'Add a PDF to see how many pages it has.'
          : `Use page numbers from 1 to ${pageCount}. Separate pages and ranges with commas.`}
      </p>
    </div>
  )
}
