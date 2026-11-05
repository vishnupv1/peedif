import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { bytesToFile, makePdfFile, PNG_1X1 } from '../../test/pdf-fixtures.ts'
import { ImagesToPDF } from './ImagesToPDF.tsx'
import { MergePDF } from './MergePDF.tsx'
import { SplitPDF } from './SplitPDF.tsx'

function renderTool(element: ReactElement) {
  return render(<MemoryRouter>{element}</MemoryRouter>)
}

describe('Merge PDF page', () => {
  it('rejects an invalid file, then merges and reorders valid PDFs', async () => {
    const user = userEvent.setup()
    const first = await makePdfFile('first.pdf', [[120, 80]])
    const second = await makePdfFile('second.pdf', [[80, 160]])
    renderTool(<MergePDF />)

    expect(localStorage.length).toBe(0)
    await user.click(screen.getByRole('button', { name: 'Merge PDFs' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/at least two PDF files/i)

    const notes = bytesToFile(new TextEncoder().encode('hello'), 'notes.pdf', 'text/plain')
    await user.upload(screen.getByLabelText('PDF files'), notes)
    expect(screen.getByText(/not a PDF/i)).toBeInTheDocument()
    expect(screen.queryByText('notes.pdf')).not.toBeInTheDocument()

    await user.upload(screen.getByLabelText('PDF files'), [first, second])
    expect(screen.getByText('first.pdf')).toBeInTheDocument()
    expect(screen.getByText('second.pdf')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Move first.pdf down' }))
    const items = within(screen.getByRole('list', { name: 'Selected files' })).getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('second.pdf')
    expect(items[1]).toHaveTextContent('first.pdf')

    await user.click(screen.getByRole('button', { name: 'Remove second.pdf' }))
    expect(screen.queryByText('second.pdf')).not.toBeInTheDocument()
    await user.upload(screen.getByLabelText('PDF files'), second)

    await user.click(screen.getByRole('button', { name: 'Merge PDFs' }))
    expect(await screen.findByRole('button', { name: 'Download PDF' })).toBeInTheDocument()
    expect(localStorage.length).toBe(0)
  })
})

describe('Split PDF page', () => {
  it('shows an error for a page range the document does not contain', async () => {
    const user = userEvent.setup()
    const file = await makePdfFile('brief.pdf', [
      [100, 100],
      [100, 100],
    ])
    renderTool(<SplitPDF />)
    await user.upload(screen.getByLabelText('PDF file'), file)
    expect(await screen.findByText(/This PDF has 2 pages/)).toBeInTheDocument()
    await user.type(screen.getByLabelText('Pages to extract'), '8')
    await user.click(screen.getByRole('button', { name: 'Extract pages' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/outside this document/i)
  })
})

describe('Images to PDF page', () => {
  it('turns a PNG into a downloadable PDF', async () => {
    const user = userEvent.setup()
    renderTool(<ImagesToPDF />)
    const image = bytesToFile(PNG_1X1, 'dot.png', 'image/png')
    await user.upload(screen.getByLabelText('JPG or PNG images'), image)
    expect(screen.getByText('dot.png')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Create PDF' }))
    expect(await screen.findByRole('button', { name: 'Download PDF' })).toBeInTheDocument()
  })
})
