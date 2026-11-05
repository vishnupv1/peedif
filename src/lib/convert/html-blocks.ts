import type { TextBlock } from '../pdf/text-layout.ts'

const SKIPPED = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'TEMPLATE'])

export function blocksFromHtml(html: string): TextBlock[] {
  const document = new DOMParser().parseFromString(html, 'text/html')
  const root = document.body
  const blocks: TextBlock[] = []
  if (!root) return blocks

  const visit = (node: Node) => {
    if (!(node instanceof Element)) return
    if (SKIPPED.has(node.tagName)) return
    if (node.tagName === 'TABLE') {
      for (const row of node.querySelectorAll('tr')) {
        const cells = [...row.querySelectorAll('th,td')]
          .map((cell) => cell.textContent?.replace(/\s+/g, ' ').trim() ?? '')
          .filter(Boolean)
        if (cells.length > 0) blocks.push({ text: cells.join(' | '), size: 11 })
      }
      return
    }
    if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P' || node.tagName === 'LI' || node.tagName === 'PRE' || node.tagName === 'BLOCKQUOTE') {
      const text = node.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      if (!text) return
      const size = node.tagName === 'H1' ? 20 : node.tagName === 'H2' ? 16 : node.tagName === 'H3' ? 14 : 11
      blocks.push({ text: node.tagName === 'LI' ? `- ${text}` : text, size })
      return
    }
    for (const child of node.childNodes) visit(child)
  }

  for (const child of root.childNodes) visit(child)
  if (blocks.length === 0) {
    const text = root.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    if (text) blocks.push({ text, size: 11 })
  }
  return blocks
}
