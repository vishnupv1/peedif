import { Link } from 'react-router-dom'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-gradient-to-r from-[#F7F3FF] via-white to-[#F3FBF6]">
      <div className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">myfriendpdf</span>
          <span> — Simple PDF tools that run in your browser. No account required.</span>
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link to="/privacy" className="text-sm text-muted hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-sm text-muted hover:text-foreground">
            Terms
          </Link>
          <p className="text-sm text-faint">© {year} myfriendpdf</p>
        </div>
      </div>
    </footer>
  )
}
