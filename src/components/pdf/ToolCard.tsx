import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Tool } from '../../lib/tools.ts'
import { cn } from '../../lib/utils.ts'
import { toolEdges, toolIcons, toolTones } from './tool-icons.ts'

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = toolIcons[tool.icon]

  return (
    <Link
      to={tool.path}
      className={cn(
        'group flex h-full min-w-0 items-center gap-3 rounded-2xl border border-border border-l-4 bg-surface px-3 py-3 shadow-[0_1px_2px_rgba(28,24,50,0.04)] hover:shadow-[0_8px_24px_rgba(80,60,140,0.1)] sm:gap-4 sm:px-4 sm:py-4',
        toolEdges[tool.icon],
      )}
    >
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', toolTones[tool.icon])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <h3 className="text-sm font-medium text-foreground">{tool.title}</h3>
        <p className="mt-0.5 text-sm leading-5 text-muted">{tool.description}</p>
      </span>
      <ChevronRight className="size-4 shrink-0 text-faint group-hover:text-accent" aria-hidden="true" />
    </Link>
  )
}
