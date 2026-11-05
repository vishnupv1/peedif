import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta.ts'

type SimplePageProps = {
  title: string
  metaTitle: string
  metaDescription: string
  children: ReactNode
}

export function SimplePage({ title, metaTitle, metaDescription, children }: SimplePageProps) {
  usePageMeta(metaTitle, metaDescription)

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-medium tracking-tight text-foreground">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted">{children}</div>
      <Link to="/" className="mt-8 inline-flex min-h-11 items-center text-sm text-foreground">
        Back to homepage
      </Link>
    </article>
  )
}
