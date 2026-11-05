import { describe, expect, it } from 'vitest'
import { layoutPageNumber, normalizeQuarterTurn } from './page-number-layout.ts'

const page = { pageWidth: 200, pageHeight: 400, textWidth: 20, fontSize: 11 }

describe('layoutPageNumber', () => {
  it('normalizes quarter turns', () => {
    expect(normalizeQuarterTurn(0)).toBe(0)
    expect(normalizeQuarterTurn(90)).toBe(90)
    expect(normalizeQuarterTurn(-90)).toBe(270)
    expect(normalizeQuarterTurn(360)).toBe(0)
    expect(normalizeQuarterTurn(45)).toBe(0)
  })

  it('centers a number along the bottom of an upright page', () => {
    expect(layoutPageNumber({ ...page, pageRotation: 0, position: 'bottom-center' })).toEqual({
      x: 90,
      y: 28,
      rotate: 0,
    })
    expect(layoutPageNumber({ ...page, pageRotation: 0, position: 'bottom-right' })).toEqual({
      x: 152,
      y: 28,
      rotate: 0,
    })
    expect(layoutPageNumber({ ...page, pageRotation: 0, position: 'top-center' })).toEqual({
      x: 90,
      y: 361,
      rotate: 0,
    })
  })

  it('moves the anchor with clockwise page rotation', () => {
    expect(layoutPageNumber({ ...page, pageRotation: 90, position: 'bottom-center' })).toEqual({
      x: 172,
      y: 190,
      rotate: 90,
    })
    expect(layoutPageNumber({ ...page, pageRotation: 180, position: 'bottom-center' })).toEqual({
      x: 110,
      y: 372,
      rotate: 180,
    })
    expect(layoutPageNumber({ ...page, pageRotation: 270, position: 'bottom-center' })).toEqual({
      x: 28,
      y: 210,
      rotate: 270,
    })
  })
})
