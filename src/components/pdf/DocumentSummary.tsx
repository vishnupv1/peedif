export function DocumentSummary({ loading, pageCount }: { loading: boolean; pageCount: number | null }) {
  if (loading) return <p className="text-sm text-muted">Reading the PDF…</p>
  if (pageCount === null) return null
  return (
    <p className="text-sm text-foreground">
      This PDF has {pageCount} {pageCount === 1 ? 'page' : 'pages'}.
    </p>
  )
}
