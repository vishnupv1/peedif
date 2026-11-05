import { SimplePage } from '../components/layout/SimplePage.tsx'

export function Terms() {
  return (
    <SimplePage
      title="Terms"
      metaTitle="Terms — myfriendpdf"
      metaDescription="Placeholder terms for the free browser-based PDF tools on myfriendpdf."
    >
      <p>This is a placeholder, not a complete legal agreement.</p>
      <p>
        myfriendpdf provides browser-based PDF tools as they are, without an account. You are responsible for the
        documents you choose to process and for checking the results before you rely on them.
      </p>
      <p>
        A result may fail or differ from the original if a PDF is encrypted, damaged, or uses a feature the browser
        library does not support.
      </p>
    </SimplePage>
  )
}
