import { describe, it, expect } from 'vitest'
import { pickSponsor, safeUrl, sponsorForDay } from './sponsor.js'

// Somebody has been paid for these rows, so the two failures that matter
// are opposite: showing the wrong sponsor on a day they did not buy, and
// showing nothing on a day they did. Under all of it sits a third — a
// bad row taking the board down with it, which turns a billing mistake
// into an outage.

const ok = { start: '2026-08-10', end: '2026-08-16', name: 'Niles Bakery', url: 'https://a.test' }

describe('picking the day’s sponsor', () => {
  it('serves the sponsor booked for the day', () => {
    expect(pickSponsor([ok], '2026-08-12')?.name).toBe('Niles Bakery')
  })

  it('counts both ends of the booking', () => {
    expect(pickSponsor([ok], '2026-08-10')?.name).toBe('Niles Bakery')
    expect(pickSponsor([ok], '2026-08-16')?.name).toBe('Niles Bakery')
  })

  it('serves nobody the day before and the day after', () => {
    expect(pickSponsor([ok], '2026-08-09')).toBeNull()
    expect(pickSponsor([ok], '2026-08-17')).toBeNull()
  })

  it('crosses a month and a year without help', () => {
    const run = { ...ok, start: '2026-12-28', end: '2027-01-03' }
    for (const d of ['2026-12-28', '2026-12-31', '2027-01-01', '2027-01-03']) {
      expect(pickSponsor([run], d), d).not.toBeNull()
    }
    expect(pickSponsor([run], '2027-01-04')).toBeNull()
  })

  it('has nobody to serve when nobody has bought anything', () => {
    expect(pickSponsor([], '2026-08-12')).toBeNull()
  })

  it('trims the copy so a stray space cannot become a layout', () => {
    const s = pickSponsor(
      [{ ...ok, name: '  Niles Bakery  ', line: '  Since 1974 ' }],
      '2026-08-12'
    )
    expect(s.name).toBe('Niles Bakery')
    expect(s.line).toBe('Since 1974')
  })

  it('reports no line rather than undefined when there is none', () => {
    expect(pickSponsor([ok], '2026-08-12').line).toBe('')
  })
})

// The generated file is committed JavaScript. The validator is the front
// door, but a person can hand-edit it, and the cost of being wrong is a
// script running in a player's page — so the runtime refuses too.
describe('links it will not follow', () => {
  it('takes http and https', () => {
    expect(safeUrl('https://a.test/x')).toBe(true)
    expect(safeUrl('http://a.test')).toBe(true)
  })

  it('refuses anything that can execute', () => {
    for (const bad of [
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox',
      'file:///etc/passwd',
    ]) {
      expect(safeUrl(bad), bad).toBe(false)
    }
  })

  it('refuses what is not a url at all', () => {
    for (const bad of ['', '  ', 'a.test', null, undefined, 42, {}]) {
      expect(safeUrl(bad), String(bad)).toBe(false)
    }
  })

  it('drops a booking whose link cannot be followed', () => {
    expect(pickSponsor([{ ...ok, url: 'javascript:alert(1)' }], '2026-08-12')).toBeNull()
  })
})

// Every one of these used to be a way to take the board down. The board
// is the product; the sponsor is a line under it.
describe('a bad row never takes the board with it', () => {
  const junk = [
    undefined,
    null,
    {},
    { start: '2026-08-10' },
    { start: null, end: null, name: 'x', url: 'https://a.test' },
    { start: 'not-a-date', end: 'nope', name: 'x', url: 'https://a.test' },
    { start: 20260810, end: 20260816, name: 'x', url: 'https://a.test' },
    { ...ok, name: '' },
    { ...ok, name: '   ' },
    { ...ok, name: null },
    { ...ok, url: null },
  ]

  it('returns null instead of throwing, whatever the row is', () => {
    for (const row of junk) {
      expect(() => pickSponsor([row], '2026-08-12'), JSON.stringify(row)).not.toThrow()
      expect(pickSponsor([row], '2026-08-12'), JSON.stringify(row)).toBeNull()
    }
  })

  it('still finds the good booking sitting next to a broken one', () => {
    expect(pickSponsor([...junk, ok], '2026-08-12')?.name).toBe('Niles Bakery')
  })

  it('survives a table that is not a table', () => {
    for (const bad of [null, undefined, 'rows', 42, {}]) {
      expect(() => pickSponsor(bad, '2026-08-12'), String(bad)).not.toThrow()
      expect(pickSponsor(bad, '2026-08-12'), String(bad)).toBeNull()
    }
  })

  it('survives a day key that is not a day', () => {
    for (const bad of [null, undefined, '', 'today', '2026-8-1', 20260812]) {
      expect(() => pickSponsor([ok], bad), String(bad)).not.toThrow()
      expect(pickSponsor([ok], bad), String(bad)).toBeNull()
    }
  })
})

describe('the real table', () => {
  // Nobody has bought anything yet, and that has to be a working state
  // rather than a crash — it is the state the site ships in.
  it('serves nothing today without complaint', () => {
    expect(() => sponsorForDay('2026-08-12')).not.toThrow()
  })
})
