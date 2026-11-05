import { cn } from '../../lib/utils.ts'

type Option<T extends string> = {
  value: T
  label: string
}

type ChoiceGroupProps<T extends string> = {
  legend: string
  name: string
  value: T
  options: readonly Option<T>[]
  onChange: (value: T) => void
}

export function ChoiceGroup<T extends string>({ legend, name, value, options, onChange }: ChoiceGroupProps<T>) {
  return (
    <fieldset>
      <legend className="text-sm text-foreground">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <label
              key={option.value}
              className={cn(
                'inline-flex min-h-11 cursor-pointer items-center rounded-lg border bg-surface px-3 text-sm focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-foreground',
                selected ? 'border-foreground text-foreground' : 'border-border text-muted',
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
