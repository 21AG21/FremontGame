import { describe, it, expect } from 'vitest'
import { civilDate, dayNumber, dayBefore } from './day.js'

describe('civilDate', () => {
  it('reports the date on the wall, not the date in UTC', () => {
    // Half past eleven at night in Fremont on the 1st is already the 2nd
    // in UTC. Filing that round under the 2nd is the bug that broke
    // every evening between five and midnight: the round was scored into
    // tomorrow, so tomorrow refused to score and the streak stopped.
    const lateEvening = new Date(2026, 7, 1, 23, 30)
    expect(civilDate(lateEvening)).toBe('2026-08-01')
    expect(lateEvening.toISOString().slice(0, 10)).toBe('2026-08-02')
  })

  it('pads single-digit months and days', () => {
    expect(civilDate(new Date(2026, 0, 5, 12, 0))).toBe('2026-01-05')
  })

  it('is stable across the whole of a local day', () => {
    for (const hour of [0, 1, 7, 12, 17, 23]) {
      expect(civilDate(new Date(2026, 7, 1, hour, 0))).toBe('2026-08-01')
    }
  })
})

describe('dayNumber', () => {
  it('numbers the launch day 1', () => {
    expect(dayNumber('2026-08-01')).toBe(1)
  })

  it('advances by exactly one per calendar day', () => {
    expect(dayNumber('2026-08-02')).toBe(2)
    expect(dayNumber('2026-09-01')).toBe(32)
  })

  it('goes negative before launch rather than throwing', () => {
    expect(dayNumber('2026-07-31')).toBe(0)
    expect(dayNumber('2026-07-01')).toBe(-30)
  })

  // Both spring-forward and fall-back land inside this window. Parsing
  // as UTC on both sides is what makes them cancel: a 23-hour local day
  // and a 25-hour one both have to count as one.
  it('crosses daylight saving without gaining or losing a day', () => {
    expect(dayNumber('2027-03-15') - dayNumber('2027-03-13')).toBe(2)
    expect(dayNumber('2026-11-02') - dayNumber('2026-10-31')).toBe(2)
  })

  it('counts a leap year as 366 days', () => {
    expect(dayNumber('2029-01-01') - dayNumber('2028-01-01')).toBe(366)
    expect(dayNumber('2027-01-01') - dayNumber('2026-01-01')).toBe(365)
  })
})

describe('dayBefore', () => {
  it('steps back one day', () => {
    expect(dayBefore('2026-08-02')).toBe('2026-08-01')
  })

  it('steps back across a month boundary', () => {
    expect(dayBefore('2026-09-01')).toBe('2026-08-31')
  })

  it('steps back across a year boundary', () => {
    expect(dayBefore('2027-01-01')).toBe('2026-12-31')
  })

  it('knows about leap day', () => {
    expect(dayBefore('2028-03-01')).toBe('2028-02-29')
    expect(dayBefore('2027-03-01')).toBe('2027-02-28')
  })

  // The second bug this file was written for: parsing a date as local
  // and formatting it as UTC dropped two days instead of one for anyone
  // east of Greenwich, so a streak never continued for a player in
  // India. A sweep is the only honest way to test it.
  it('always lands exactly one day back, over four years', () => {
    let key = '2026-01-01'
    for (let i = 0; i < 1461; i++) {
      const prev = dayBefore(key)
      expect(dayNumber(key) - dayNumber(prev), `${key} → ${prev}`).toBe(1)
      key = new Date(Date.parse(`${key}T00:00:00Z`) + 86400000).toISOString().slice(0, 10)
    }
  })
})

describe('the two together', () => {
  // This is the pairing that decides whether a streak survives the
  // night: storage asks "was the last day played the day before this
  // one", and it asks it in keys, not numbers.
  it('agrees on what yesterday was', () => {
    for (const key of ['2026-08-01', '2026-11-02', '2027-03-15', '2028-02-29', '2027-01-01']) {
      expect(dayNumber(dayBefore(key))).toBe(dayNumber(key) - 1)
    }
  })
})
