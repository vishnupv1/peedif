function pageLabel(count: number): string {
  return `${count} ${count === 1 ? 'page' : 'pages'}`
}

function readPageNumber(raw: string, token: string): number {
  if (raw.length > 6) {
    throw new Error(`"${token}" is not a valid page. Pages start at 1.`)
  }
  const page = Number(raw)
  if (!Number.isInteger(page) || page < 1) {
    throw new Error(`"${token}" is not a valid page. Pages start at 1.`)
  }
  return page
}

function ensureInside(page: number, token: string, pageCount: number) {
  if (page > pageCount) {
    throw new Error(`"${token}" is outside this document, which has ${pageLabel(pageCount)}.`)
  }
}

export function parsePageRanges(input: string, pageCount: number): number[] {
  const trimmed = input.trim()
  if (!trimmed) {
    throw new Error('Enter at least one page or range.')
  }
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error('This PDF has no pages to use.')
  }

  const pages: number[] = []
  for (const part of trimmed.split(',')) {
    const token = part.trim()
    if (!token) {
      throw new Error('The page list has an empty entry. Remove the extra comma.')
    }

    const rangeMatch = /^(\d+)\s*-\s*(\d+)$/.exec(token)
    const singleMatch = /^(\d+)$/.exec(token)
    if (rangeMatch) {
      const start = readPageNumber(rangeMatch[1] ?? '', token)
      const end = readPageNumber(rangeMatch[2] ?? '', token)
      if (start > end) {
        throw new Error(`"${token}" is reversed. The start of a range has to be before the end.`)
      }
      ensureInside(start, token, pageCount)
      ensureInside(end, token, pageCount)
      for (let page = start; page <= end; page += 1) pages.push(page - 1)
      continue
    }

    if (singleMatch) {
      const page = readPageNumber(singleMatch[1] ?? '', token)
      ensureInside(page, token, pageCount)
      pages.push(page - 1)
      continue
    }

    throw new Error(`"${token}" is not a valid page or range. Use a format like 1-3, 5, 7-9.`)
  }

  if (pages.length === 0) {
    throw new Error('Enter at least one page or range.')
  }
  return pages
}
