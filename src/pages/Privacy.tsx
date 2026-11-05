import { SimplePage } from '../components/layout/SimplePage.tsx'

export function Privacy() {
  return (
    <SimplePage
      title="Privacy Policy"
      metaTitle="Privacy Policy — myfriendpdf"
      metaDescription="myfriendpdf processes documents in your browser and does not upload them to a server."
    >
      <p>This is a short placeholder, not a complete legal policy.</p>
      <p>
        myfriendpdf processes documents in your browser. The app does not upload your files to a processing server, does
        not require an account, and does not store document contents in local storage or session storage.
      </p>
      <p>The site does not send document names or file contents to an analytics service.</p>
      <p>
        While a tool is open, the document is held in browser memory so the operation can run. This page does not claim
        that local processing is risk-free, and it does not describe a separate deletion process.
      </p>
    </SimplePage>
  )
}
