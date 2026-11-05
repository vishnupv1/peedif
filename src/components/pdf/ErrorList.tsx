export function ErrorList({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null

  return (
    <div role="alert" className="rounded-lg border border-danger-border bg-danger-surface px-4 py-3 text-sm leading-6 text-danger">
      <ul className="space-y-1">
        {errors.map((error, index) => (
          <li key={`${error}-${index}`}>{error}</li>
        ))}
      </ul>
    </div>
  )
}
