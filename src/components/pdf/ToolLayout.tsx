import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta.ts'
import type { Tool } from '../../lib/tools.ts'
import { cn } from '../../lib/utils.ts'
import { toolIcons, toolPanels, toolTones } from './tool-icons.ts'

type ToolLayoutProps = {
  tool: Tool
  busy?: boolean
  children: ReactNode
}

export function ToolLayout({ tool, busy = false, children }: ToolLayoutProps) {
  const Icon = toolIcons[tool.icon]
  usePageMeta(tool.metaTitle, tool.metaDescription)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{tool.title}</li>
        </ol>
      </nav>
      <header className={cn('mt-5 rounded-3xl border p-5 sm:p-6', toolPanels[tool.icon])}>
        <div className="flex items-start gap-4">
          <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl', toolTones[tool.icon])}>
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{tool.title}</h1>
            <p className="mt-2 text-sm leading-6 text-foreground">{tool.about}</p>
          </div>
        </div>
      </header>
      <div className="mt-6 space-y-6" aria-busy={busy}>
        {children}
      </div>
    </div>
  )
}
