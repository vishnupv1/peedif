import { SimplePage } from '../components/layout/SimplePage.tsx'

export function NotFound() {
  return (
    <SimplePage
      title="Page not found"
      metaTitle="Page not found — myfriendpdf"
      metaDescription="The page you requested does not exist."
    >
      <p>That link does not match a page on myfriendpdf.</p>
    </SimplePage>
  )
}
