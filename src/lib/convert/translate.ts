import { downloadName } from '../pdf/download.ts'
import { extractPageLines, hasExtractableText } from '../pdf/pdfjs-document.ts'
import { renderBlocks, type TextBlock } from '../pdf/text-layout.ts'

export const translationLanguages = [
  ['en', 'English'],
  ['es', 'Spanish'],
  ['fr', 'French'],
  ['de', 'German'],
  ['pt', 'Portuguese'],
  ['it', 'Italian'],
  ['nl', 'Dutch'],
  ['pl', 'Polish'],
  ['hi', 'Hindi'],
  ['ja', 'Japanese'],
  ['ko', 'Korean'],
  ['zh', 'Chinese'],
] as const

export type TranslationLanguage = (typeof translationLanguages)[number][0]

type TranslatorAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available'

type LocalTranslator = {
  translate(input: string): Promise<string>
  destroy?: () => void
}

type TranslatorApi = {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<TranslatorAvailability>
  create(options: { sourceLanguage: string; targetLanguage: string }): Promise<LocalTranslator>
}

export function assertLanguagePair(source: string, target: string): void {
  if (!translationLanguages.some(([code]) => code === source) || !translationLanguages.some(([code]) => code === target)) {
    throw new Error('Choose a supported language.')
  }
  if (source === target) throw new Error('Choose a different target language.')
}

function translatorApi(): TranslatorApi | null {
  const candidate = (globalThis as { Translator?: TranslatorApi }).Translator
  if (!candidate || typeof candidate.availability !== 'function' || typeof candidate.create !== 'function') return null
  return candidate
}

async function translateChunked(translator: LocalTranslator, text: string): Promise<string> {
  const parts: string[] = []
  let rest = text.trim()
  while (rest) {
    let cut = Math.min(1200, rest.length)
    if (cut < rest.length) {
      const space = rest.lastIndexOf(' ', cut)
      if (space > 200) cut = space
    }
    parts.push(await translator.translate(rest.slice(0, cut)))
    rest = rest.slice(cut).trim()
  }
  return parts.join('\n')
}

export async function translatePdf(
  data: ArrayBuffer,
  originalName: string | undefined,
  source: string,
  target: string,
): Promise<{ bytes: Uint8Array; filename: string; mimeType: string }> {
  assertLanguagePair(source, target)
  const api = translatorApi()
  if (!api) {
    throw new Error('This browser does not include on-device translation. The PDF was not sent to a translation service.')
  }

  const status = await api.availability({ sourceLanguage: source, targetLanguage: target })
  if (status === 'unavailable') {
    throw new Error('This browser cannot translate between those languages on this device.')
  }

  const pages = await extractPageLines(data)
  if (!hasExtractableText(pages)) {
    throw new Error('This PDF has no text to translate. Scanned pages need OCR first.')
  }

  const translator = await api.create({ sourceLanguage: source, targetLanguage: target })
  try {
    const blocks: TextBlock[] = []
    for (const [index, lines] of pages.entries()) {
      const text = lines.join('\n').trim()
      const translated = text ? await translateChunked(translator, text) : 'This page has no extractable text.'
      blocks.push({ text: translated, size: 11, breakBefore: index > 0 })
    }
    return {
      bytes: await renderBlocks(blocks),
      filename: downloadName(originalName, 'pdf'),
      mimeType: 'application/pdf',
    }
  } finally {
    translator.destroy?.()
  }
}
