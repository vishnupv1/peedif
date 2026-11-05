import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../App.tsx'

const routes: Array<[string, string]> = [
  ['/', 'Everything you need to work with PDFs.'],
  ['/merge-pdf', 'Merge PDF'],
  ['/split-pdf', 'Split PDF'],
  ['/compress-pdf', 'Compress PDF'],
  ['/images-to-pdf', 'Images to PDF'],
  ['/rotate-pdf', 'Rotate PDF'],
  ['/add-page-numbers', 'Add page numbers'],
  ['/pdf-to-word', 'PDF to Word'],
  ['/word-to-pdf', 'Word to PDF'],
  ['/pdf-to-jpg', 'PDF to JPG'],
  ['/jpg-to-pdf', 'JPG to PDF'],
  ['/pdf-to-ppt', 'PDF to PPT'],
  ['/ppt-to-pdf', 'PPT to PDF'],
  ['/pdf-to-excel', 'PDF to Excel'],
  ['/excel-to-pdf', 'Excel to PDF'],
  ['/html-to-pdf', 'HTML to PDF'],
  ['/webpage-to-pdf', 'Webpage to PDF'],
  ['/qr-barcode', 'QR & Barcode'],
  ['/ocr', 'OCR'],
  ['/translate', 'Translate'],
  ['/pricing', 'Pricing'],
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms'],
  ['/missing-page', 'Page not found'],
]

describe('routes', () => {
  it.each(routes)('renders %s', async (path, heading) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })
})
