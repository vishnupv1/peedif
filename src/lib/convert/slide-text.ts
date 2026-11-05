export function textsFromSlideXml(xml: string): string[] {
  const matches = xml.match(/<a:t[^>]*>[^<]*<\/a:t>/g) ?? []
  return matches
    .map((item) =>
      item
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim(),
    )
    .filter(Boolean)
}

export function slideOrder(paths: string[]): string[] {
  return paths
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
    .sort((a, b) => {
      const left = Number(a.match(/slide(\d+)\.xml$/)?.[1] ?? 0)
      const right = Number(b.match(/slide(\d+)\.xml$/)?.[1] ?? 0)
      return left - right
    })
}
