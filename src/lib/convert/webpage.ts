export function assertWebpageUrl(value: string): URL {
  const trimmed = value.trim()
  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    throw new Error('Enter a full web address, including https://.')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http and https addresses can be converted.')
  }
  return url
}

export async function fetchWebpageHtml(value: string): Promise<string> {
  const url = assertWebpageUrl(value)
  let response: Response
  try {
    response = await fetch(url.href, { credentials: 'omit', cache: 'no-store', redirect: 'follow' })
  } catch {
    throw new Error('This website cannot be read from the browser. Save the page as HTML and use HTML to PDF.')
  }
  if (!response.ok) throw new Error('The page could not be loaded.')
  const html = await response.text()
  if (!/<\s*\/?[a-z!]/i.test(html)) throw new Error('That address did not return a web page.')
  if (html.length > 25 * 1024 * 1024) throw new Error('That page is over the 25 MB limit.')
  return html
}
