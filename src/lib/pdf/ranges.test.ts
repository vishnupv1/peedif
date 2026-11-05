import { describe, expect, it } from 'vitest'
import { parsePageRanges } from './ranges.ts'

describe('parsePageRanges', () => {
  it('parses singles and ranges in order', () => {
    expect(parsePageRanges('1-3, 5, 7-9', 10)).toEqual([0, 1, 2, 4, 6, 7, 8])
  })

  it('accepts spaces around numbers', () => {
    expect(parsePageRanges(' 1 - 2 , 4 ', 4)).toEqual([0, 1, 3])
  })

  it('keeps a repeated page', () => {
    expect(parsePageRanges('2, 2', 3)).toEqual([1, 1])
  })

  it('rejects an empty list', () => {
    expect(() => parsePageRanges('   ', 3)).toThrow(/at least one page/i)
  })

  it('rejects a trailing comma', () => {
    expect(() => parsePageRanges('1, 2,', 4)).toThrow(/empty entry/i)
  })

  it('rejects a reversed range', () => {
    expect(() => parsePageRanges('5-2', 8)).toThrow(/reversed/i)
  })

  it('rejects pages outside the document', () => {
    expect(() => parsePageRanges('1-3, 5, 7-9', 8)).toThrow(/outside this document/i)
    expect(() => parsePageRanges('0', 3)).toThrow(/not a valid page/i)
  })

  it('rejects words and broken ranges', () => {
    expect(() => parsePageRanges('abc', 3)).toThrow(/not a valid page or range/i)
    expect(() => parsePageRanges('1-3-5', 6)).toThrow(/not a valid page or range/i)
  })

  it('rejects a document with no pages', () => {
    expect(() => parsePageRanges('1', 0)).toThrow(/no pages/i)
  })
})
