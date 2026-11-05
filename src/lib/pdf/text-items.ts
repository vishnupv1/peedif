export type PositionedText = {
  text: string
  x: number
  y: number
}

export function rowsFromTextItems(items: PositionedText[], yTolerance = 3): string[][] {
  const sorted = items
    .filter((item) => item.text.trim())
    .sort((a, b) => b.y - a.y || a.x - b.x)
  const rows: { y: number; cells: PositionedText[] }[] = []

  for (const item of sorted) {
    const row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= yTolerance)
    if (row) row.cells.push(item)
    else rows.push({ y: item.y, cells: [item] })
  }

  return rows.map((row) =>
    row.cells
      .sort((a, b) => a.x - b.x)
      .map((cell) => cell.text.trim())
      .filter(Boolean),
  )
}

export function linesFromTextItems(items: PositionedText[]): string[] {
  return rowsFromTextItems(items).map((row) => row.join(' '))
}
