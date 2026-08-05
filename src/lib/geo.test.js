import { describe, it, expect } from 'vitest'
import {
  distanceMiles,
  bearingDegrees,
  compassFrom,
  formatDistance,
  warmth,
  warmthWord,
} from './geo.js'

const CIVIC = { lat: 37.5485, lng: -121.9886 }

describe('distanceMiles', () => {
  it('is zero from a point to itself', () => {
    expect(distanceMiles(CIVIC, CIVIC)).toBe(0)
  })

  it('is symmetric', () => {
    const b = { lat: 37.4, lng: -122.1 }
    expect(distanceMiles(CIVIC, b)).toBeCloseTo(distanceMiles(b, CIVIC), 10)
  })

  // A degree of latitude is about 69 miles anywhere on Earth. If the
  // haversine is wrong this is where it shows.
  it('measures a degree of latitude at about 69 miles', () => {
    expect(distanceMiles({ lat: 37, lng: -122 }, { lat: 38, lng: -122 })).toBeCloseTo(69.1, 0)
  })

  // A degree of longitude shrinks with the cosine of the latitude —
  // 69 × cos(37.5°) ≈ 54.8. Getting this equal to the latitude figure
  // means somebody forgot the cosine term.
  it('measures a degree of longitude as shorter this far north', () => {
    expect(distanceMiles({ lat: 37.5, lng: -122 }, { lat: 37.5, lng: -121 })).toBeCloseTo(54.8, 0)
  })
})

describe('bearingDegrees', () => {
  const cardinal = [
    ['north', { lat: CIVIC.lat + 0.1, lng: CIVIC.lng }, 0],
    ['east', { lat: CIVIC.lat, lng: CIVIC.lng + 0.1 }, 90],
    ['south', { lat: CIVIC.lat - 0.1, lng: CIVIC.lng }, 180],
    ['west', { lat: CIVIC.lat, lng: CIVIC.lng - 0.1 }, 270],
  ]

  for (const [name, point, expected] of cardinal) {
    it(`reads ${expected}° for a point due ${name}`, () => {
      expect(bearingDegrees(CIVIC, point)).toBeCloseTo(expected, 0)
    })
  }

  it('always answers between 0 and 360', () => {
    for (let dLat = -0.2; dLat <= 0.2; dLat += 0.05) {
      for (let dLng = -0.2; dLng <= 0.2; dLng += 0.05) {
        if (!dLat && !dLng) continue
        const d = bearingDegrees(CIVIC, { lat: CIVIC.lat + dLat, lng: CIVIC.lng + dLng })
        expect(d).toBeGreaterThanOrEqual(0)
        expect(d).toBeLessThan(360)
      }
    }
  })
})

describe('compassFrom', () => {
  it('names the eight points', () => {
    const at = (d) => compassFrom(d).label
    expect(at(0)).toBe('north')
    expect(at(45)).toBe('northeast')
    expect(at(90)).toBe('east')
    expect(at(180)).toBe('south')
    expect(at(270)).toBe('west')
    expect(at(315)).toBe('northwest')
  })

  // The modulo is here for this: 350° is north, and an index of 8 into
  // an eight-item list is undefined.
  it('wraps the top of the dial back to north', () => {
    expect(compassFrom(350).label).toBe('north')
    expect(compassFrom(359.9).label).toBe('north')
  })

  it('never returns undefined, at any bearing', () => {
    for (let d = 0; d < 360; d += 0.5) {
      expect(compassFrom(d).label, `${d}°`).toBeTruthy()
    }
  })
})

describe('formatDistance', () => {
  it('refuses to be precise when you are basically on it', () => {
    expect(formatDistance(0)).toBe('right about there')
    expect(formatDistance(0.19)).toBe('right about there')
  })

  it('rounds to a quarter mile further out', () => {
    expect(formatDistance(0.5)).toBe('under a mile')
    expect(formatDistance(1.4)).toBe('1.5 mi')
    expect(formatDistance(2.0)).toBe('2 mi')
    expect(formatDistance(3.13)).toBe('3.25 mi')
  })

  // The reason the bands are coarse: reporting to 100 feet pinned most
  // answers outright, which made the drawing decorative. If this ever
  // emits more than a handful of distinct strings across the town, the
  // puzzle has quietly become a trivia question about coordinates.
  it('emits few enough strings to keep the drawing doing the work', () => {
    const seen = new Set()
    for (let m = 0; m < 8; m += 0.01) seen.add(formatDistance(m))
    expect(seen.size).toBeLessThan(32)
  })
})

describe('warmth', () => {
  it('is 1 on top of the answer and 0 far away', () => {
    expect(warmth(0)).toBe(1)
    expect(warmth(6)).toBe(0)
  })

  it('clamps rather than going negative', () => {
    expect(warmth(50)).toBe(0)
    expect(warmth(-1)).toBe(1)
  })

  it('falls as you get further away', () => {
    let last = Infinity
    for (let m = 0; m < 10; m += 0.25) {
      expect(warmth(m)).toBeLessThanOrEqual(last)
      last = warmth(m)
    }
  })
})

describe('warmthWord', () => {
  it('gives a word to somebody who has no map of the town in their head', () => {
    expect(warmthWord(0.1)).toBe('Almost')
    expect(warmthWord(1)).toBe('Hot')
    expect(warmthWord(2)).toBe('Warm')
    expect(warmthWord(4)).toBe('Cool')
    expect(warmthWord(9)).toBe('Cold')
  })

  it('covers every distance without a gap', () => {
    for (let m = 0; m < 30; m += 0.05) expect(warmthWord(m)).toBeTruthy()
  })
})
