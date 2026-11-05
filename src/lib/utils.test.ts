import { describe, expect, it } from 'vitest'
import { outputFilename } from './pdf/download.ts'
import { describeCompression } from './pdf/compress.ts'
import { formatFileSize, toUserMessage } from './utils.ts'

describe('formatFileSize', () => {
  it('formats bytes, kilobytes, and megabytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(25 * 1024 * 1024)).toBe('25.0 MB')
  })
})

describe('outputFilename', () => {
  it('builds a download name from the original file', () => {
    expect(outputFilename('Quarterly Report.pdf', 'rotated')).toBe('Quarterly Report-rotated.pdf')
    expect(outputFilename(undefined, 'compressed')).toBe('document-compressed.pdf')
  })
})

describe('describeCompression', () => {
  it('reports the actual size change without promising a percentage', () => {
    expect(describeCompression(1000, 800)).toMatch(/smaller/i)
    expect(describeCompression(1000, 1000)).toMatch(/stayed the same/i)
    expect(describeCompression(1000, 1400)).toMatch(/larger/i)
    expect(describeCompression(1000, 800)).not.toMatch(/%/)
  })
})

describe('toUserMessage', () => {
  it('hides stack traces', () => {
    const error = new Error('Useful message')
    error.stack = 'Error: Useful message\n    at secret (file.js:1:1)'
    expect(toUserMessage(error)).toBe('Useful message')
    expect(toUserMessage(new Error('x'.repeat(400)))).toMatch(/Something went wrong/i)
  })
})
