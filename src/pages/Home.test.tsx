import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Home } from './Home.tsx'

describe('Home', () => {
  it('lists every tool and filters by name or description', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Everything you need to work with PDFs.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Merge PDF/ })).toHaveAttribute('href', '/merge-pdf')
    expect(screen.getByRole('link', { name: /Split PDF/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Compress PDF/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Images to PDF/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Rotate PDF/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Add page numbers/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /PDF to Word/ })).toHaveAttribute('href', '/pdf-to-word')
    expect(screen.getByRole('link', { name: /QR & Barcode/ })).toHaveAttribute('href', '/qr-barcode')
    expect(screen.getByText('Your files stay on your device.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search PDF tools'), 'rotate')
    expect(screen.getByRole('link', { name: /Rotate PDF/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Merge PDF/ })).not.toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search PDF tools'))
    await user.type(screen.getByLabelText('Search PDF tools'), 'zzzz-no-tool')
    expect(screen.getByText('No tools match "zzzz-no-tool".')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('link', { name: /Merge PDF/ })).toBeInTheDocument()
  })
})
