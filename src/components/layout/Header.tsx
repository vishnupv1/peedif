import { ChevronDown, FileText, Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { convertTools, tools } from '../../lib/tools.ts'
import { cn } from '../../lib/utils.ts'
import { toolIcons, toolTones } from '../pdf/tool-icons.ts'

export function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(location.pathname)
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname)
    setMobileOpen(false)
    setToolsOpen(false)
    setConvertOpen(false)
  }
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const toolsButtonRef = useRef<HTMLButtonElement>(null)
  const toolsWrapRef = useRef<HTMLDivElement>(null)
  const convertButtonRef = useRef<HTMLButtonElement>(null)
  const convertWrapRef = useRef<HTMLDivElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)
  const mobileNavId = useId()
  const toolsMenuId = useId()
  const convertMenuId = useId()

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (media.matches) setMobileOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    mobileNavRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!toolsOpen) return
    const first = toolsWrapRef.current?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
    first?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setToolsOpen(false)
        toolsButtonRef.current?.focus()
      }
    }
    const onPointer = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (toolsWrapRef.current?.contains(target)) return
      setToolsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [toolsOpen])

  useEffect(() => {
    if (!convertOpen) return
    const first = convertWrapRef.current?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
    first?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConvertOpen(false)
        convertButtonRef.current?.focus()
      }
    }
    const onPointer = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (convertWrapRef.current?.contains(target)) return
      setConvertOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [convertOpen])

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="h-1 bg-gradient-to-r from-[#F25C78] via-[#6E59E6] to-[#3CB371]" aria-hidden="true" />
      <div className="grid h-16 w-full grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="col-start-1 flex min-w-0 items-center gap-2.5 rounded-md text-foreground">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#4C6FFF] text-white">
            <FileText className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate text-base font-semibold tracking-tight">myfriendpdf</span>
        </Link>

        <nav aria-label="Primary" className="col-start-2 hidden min-w-0 items-center justify-center md:flex">
          <NavLink
            to="/translate"
            className={({ isActive }) =>
              cn(
                'inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm',
                isActive ? 'text-accent' : 'text-foreground hover:text-accent',
              )
            }
          >
            Translate
          </NavLink>
          <NavLink
            to="/ocr"
            className={({ isActive }) =>
              cn(
                'inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm',
                isActive ? 'text-accent' : 'text-foreground hover:text-accent',
              )
            }
          >
            OCR
          </NavLink>
          <div className="relative" ref={convertWrapRef}>
            <button
              ref={convertButtonRef}
              type="button"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2.5 text-sm text-foreground hover:text-accent"
              aria-expanded={convertOpen}
              aria-controls={convertMenuId}
              aria-haspopup="menu"
              onClick={() => {
                setConvertOpen((open) => !open)
                setToolsOpen(false)
              }}
            >
              Convert
              <ChevronDown className={cn('size-4 transition-transform', convertOpen && 'rotate-180')} aria-hidden="true" />
            </button>
            {convertOpen ? (
              <div
                id={convertMenuId}
                role="menu"
                aria-label="Convert"
                className="absolute top-full left-1/2 z-30 mt-2 grid max-h-[70vh] w-[min(38rem,calc(100vw-1.5rem))] -translate-x-1/2 grid-cols-2 gap-1 overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-[0_12px_32px_rgba(28,24,50,0.08)]"
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                  event.preventDefault()
                  const items = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'))
                  const current = items.indexOf(document.activeElement as HTMLAnchorElement)
                  const delta = event.key === 'ArrowDown' ? 1 : -1
                  const next = current === -1 ? 0 : (current + delta + items.length) % items.length
                  items[next]?.focus()
                }}
              >
                {convertTools.map((tool) => {
                  const Icon = toolIcons[tool.icon]
                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      role="menuitem"
                      className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-surface-muted"
                      onClick={() => setConvertOpen(false)}
                    >
                      <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', toolTones[tool.icon])}>
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      {tool.title}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
          <div className="relative" ref={toolsWrapRef}>
            <button
              ref={toolsButtonRef}
              type="button"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2.5 text-sm text-foreground hover:text-accent"
              aria-expanded={toolsOpen}
              aria-controls={toolsMenuId}
              aria-haspopup="menu"
              onClick={() => {
                setToolsOpen((open) => !open)
                setConvertOpen(false)
              }}
            >
              All Tools
              <ChevronDown className={cn('size-4 transition-transform', toolsOpen && 'rotate-180')} aria-hidden="true" />
            </button>
            {toolsOpen ? (
              <div
                id={toolsMenuId}
                role="menu"
                aria-label="All Tools"
                className="absolute top-full left-1/2 z-30 mt-2 grid max-h-[70vh] w-[min(38rem,calc(100vw-1.5rem))] -translate-x-1/2 grid-cols-2 gap-1 overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-[0_12px_32px_rgba(28,24,50,0.08)]"
                onKeyDown={(event) => {
                  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                  event.preventDefault()
                  const items = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'))
                  const current = items.indexOf(document.activeElement as HTMLAnchorElement)
                  const delta = event.key === 'ArrowDown' ? 1 : -1
                  const next = current === -1 ? 0 : (current + delta + items.length) % items.length
                  items[next]?.focus()
                }}
              >
                {[...tools, ...convertTools].map((tool) => {
                  const Icon = toolIcons[tool.icon]
                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      role="menuitem"
                      className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-surface-muted"
                      onClick={() => setToolsOpen(false)}
                    >
                      <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', toolTones[tool.icon])}>
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      {tool.title}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              cn(
                'inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm',
                isActive ? 'text-accent' : 'text-foreground hover:text-accent',
              )
            }
          >
            Pricing
          </NavLink>
        </nav>

        <div className="col-start-3 flex items-center justify-end">
          <span className="hidden w-[9.75rem] md:block" aria-hidden="true" />
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-foreground md:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileNavId}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id={mobileNavId}
          ref={mobileNavRef}
          tabIndex={-1}
          aria-label="Mobile"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-surface md:hidden"
        >
          <ul className="flex w-full flex-col px-4 py-2 sm:px-6 lg:px-8">
            {tools.map((tool) => (
              <li key={tool.path}>
                <NavLink to={tool.path} className="flex min-h-11 items-center text-sm text-foreground">
                  {tool.title}
                </NavLink>
              </li>
            ))}
            <li className="pt-3 text-xs font-medium text-muted">Convert</li>
            {convertTools.map((tool) => (
              <li key={tool.path}>
                <NavLink to={tool.path} className="flex min-h-11 items-center text-sm text-foreground">
                  {tool.title}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/pricing" className="flex min-h-11 items-center text-sm text-foreground">
                Pricing
              </NavLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
