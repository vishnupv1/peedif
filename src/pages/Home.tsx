import { Code2, FileText, Image, LayoutGrid, Lock, Search, Zap } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { ToolCard } from '../components/pdf/ToolCard.tsx'
import { Button } from '../components/ui/button.tsx'
import { Input } from '../components/ui/input.tsx'
import { usePageMeta } from '../hooks/usePageMeta.ts'
import { convertTools, toolMatches, tools } from '../lib/tools.ts'
import { cn } from '../lib/utils.ts'

export function Home() {
  const [query, setQuery] = useState('')
  usePageMeta(
    'myfriendpdf — Free Online PDF Tools',
    'Merge, split, compress and convert PDF documents with simple browser-based tools. Process your files locally without uploading them to a server.',
  )

  const filtered = useMemo(() => tools.filter((tool) => toolMatches(tool, query)), [query])
  const filteredConvert = useMemo(() => convertTools.filter((tool) => toolMatches(tool, query)), [query])
  const matchCount = filtered.length + filteredConvert.length

  return (
    <div>
      <section className="relative w-full overflow-x-clip px-4 pt-8 pb-2 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <HeroDecor />
        <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center lg:max-w-2xl">
          <p className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#F3F0FF] px-3 py-1 text-center text-xs font-medium text-accent">
            <Zap className="size-3.5 shrink-0" aria-hidden="true" />
            Free PDF tools to simplify your work
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-foreground sm:mt-5 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            Everything you need <span className="text-hero-accent mt-1 block">to work with PDFs.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted sm:text-base sm:leading-7">
            Simple, secure PDF tools. Merge, split, compress and convert your documents directly in your browser.
          </p>
          <div className="relative mt-6 w-full max-w-xl sm:mt-7">
            <label htmlFor="tool-search" className="sr-only">
              Search PDF tools
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint sm:left-5" aria-hidden="true" />
            <Input
              id="tool-search"
              type="search"
              value={query}
              placeholder="Search tools (e.g. Compress, Merge, Split...)"
              autoComplete="off"
              className="h-12 rounded-full border-border bg-surface pr-4 pl-11 text-base shadow-[0_8px_30px_rgba(80,60,140,0.06)] sm:h-14 sm:pr-5 sm:pl-12"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button asChild className="mt-4 w-full max-w-xs rounded-full px-5 sm:w-auto">
            <a href="#tools">Browse tools</a>
          </Button>
          <p className="mt-4 flex w-full max-w-xl items-start justify-center gap-2 text-left text-sm leading-6 text-muted sm:text-center">
            <Lock className="mt-1 size-4 shrink-0" aria-hidden="true" />
            <span>Documents are processed in your browser and are not uploaded to a server.</span>
          </p>
          <p className="sr-only" aria-live="polite">
            {query.trim() ? `${matchCount} tools match ${query.trim()}` : `${tools.length + convertTools.length} tools`}
          </p>
        </div>
      </section>

      <section id="tools" aria-labelledby="tools-heading" className="w-full scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h2 id="tools-heading" className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Popular Free PDF Tools
            </h2>
            <span className="mt-2 block h-1 w-10 rounded-full bg-gradient-to-r from-[#6E59E6] to-[#3D7BE0] sm:mt-3" aria-hidden="true" />
          </div>
          <button
            type="button"
            className="shrink-0 text-sm font-medium text-accent hover:text-[#5b48c9]"
            onClick={() => setQuery('')}
          >
            View all tools
          </button>
        </div>
        {filtered.length > 0 ? (
          <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-3 sm:mt-8 sm:gap-4">
            {filtered.map((tool) => (
              <li key={tool.path} className="min-w-0">
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {filteredConvert.length > 0 ? (
        <section aria-labelledby="convert-heading" className="w-full px-4 pb-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <h2 id="convert-heading" className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Convert
              </h2>
              <span className="mt-2 block h-1 w-10 rounded-full bg-gradient-to-r from-[#E0943A] to-[#E15B73] sm:mt-3" aria-hidden="true" />
            </div>
            {query.trim() && filtered.length === 0 ? (
              <button type="button" className="shrink-0 text-sm font-medium text-accent hover:text-[#5b48c9]" onClick={() => setQuery('')}>
                Clear search
              </button>
            ) : null}
          </div>
          <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,22rem),1fr))] gap-3 sm:mt-8 sm:gap-4">
            {filteredConvert.map((tool) => (
              <li key={tool.path} className="min-w-0">
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {matchCount === 0 ? (
        <div className="mt-8 w-full px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <p className="break-words text-base text-foreground">No tools match "{query.trim()}".</p>
            <p className="mt-2 text-sm text-muted">Try a word like merge, split, word, or jpg.</p>
            <Button variant="secondary" className="mt-5 rounded-full" onClick={() => setQuery('')}>
              Clear search
            </Button>
          </div>
        </div>
      ) : null}

      <section aria-labelledby="privacy-heading" className="w-full px-4 pb-10 sm:px-6 sm:pb-16 lg:px-8">
        <div className="rounded-2xl border border-[#D7E8F8] bg-gradient-to-br from-[#F3F8FF] via-white to-[#F3FBF6] px-6 py-8 shadow-[0_1px_2px_rgba(28,24,50,0.04)] sm:px-8">
          <h2 id="privacy-heading" className="text-xl font-semibold tracking-tight text-foreground">
            Your files stay on your device.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Merge, split, compress, rotate, and convert documents in your browser. myfriendpdf does not upload your
            files to a processing server, and it does not ask you to create an account.
          </p>
        </div>
      </section>
    </div>
  )
}

function HeroDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <Ornament className="top-1 left-4 lg:left-8" tone="bg-[#FFE4EA] text-[#F25C78]">
        <FileText className="size-5" />
      </Ornament>
      <Ornament className="top-0 right-4 lg:right-8" tone="bg-[#E5F8E8] text-[#3CB371]" mirror>
        <LayoutGrid className="size-5" />
      </Ornament>
      <Ornament className="top-32 left-4 xl:top-36 lg:left-8" tone="bg-[#E5F0FF] text-[#4C7DFF]">
        <Image className="size-5" />
      </Ornament>
      <Ornament className="top-36 right-4 xl:top-40 lg:right-8" tone="bg-[#FFF1DE] text-[#F0A04B]" mirror>
        <Code2 className="size-5" />
      </Ornament>
    </div>
  )
}

function Ornament({
  className,
  tone,
  mirror = false,
  children,
}: {
  className: string
  tone: string
  mirror?: boolean
  children: ReactNode
}) {
  return (
    <div className={cn('absolute flex items-center', mirror && 'flex-row-reverse', className)}>
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-2xl shadow-[0_8px_24px_rgba(80,60,140,0.08)] xl:size-12',
          tone,
        )}
      >
        {children}
      </span>
      <svg
        width="72"
        height="28"
        viewBox="0 0 72 28"
        fill="none"
        className={cn('hidden text-[#ddd8ea] xl:block', mirror && '-scale-x-100')}
      >
        <path d="M2 22C26 22 42 8 70 6" stroke="currentColor" strokeDasharray="4 6" />
      </svg>
    </div>
  )
}
