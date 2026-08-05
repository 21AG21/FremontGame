import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getRecord, saveResult, loadState, saveState, clearState, resetAll } from './storage.js'

// storage.js reaches for localStorage inside a try/catch every time it
// is called, so an in-memory stand-in on globalThis is enough — and it
// keeps this a unit test rather than something that needs a DOM.
function stubStorage() {
  const map = new Map()
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
    _map: map,
  }
}

beforeEach(() => {
  globalThis.localStorage = stubStorage()
})

afterEach(() => {
  delete globalThis.localStorage
})

describe('saveResult', () => {
  it('records a first win as a streak of one', () => {
    const r = saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-10' })
    expect(r).toMatchObject({ streak: 1, best: 1, played: 1, wins: 1 })
  })

  it('continues a streak on consecutive days', () => {
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-10' })
    saveResult('zoom', { won: true, guesses: 3, dayKey: '2026-08-11' })
    const r = saveResult('zoom', { won: true, guesses: 1, dayKey: '2026-08-12' })
    expect(r.streak).toBe(3)
    expect(r.best).toBe(3)
    expect(r.played).toBe(3)
  })

  it('resets the streak when a day is missed, even after a win', () => {
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-10' })
    const r = saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-12' })
    expect(r.streak).toBe(1)
    expect(r.best).toBe(1)
  })

  it('resets the streak on a loss but keeps the best', () => {
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-10' })
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-11' })
    const r = saveResult('zoom', { won: false, guesses: 5, dayKey: '2026-08-12' })
    expect(r.streak).toBe(0)
    expect(r.best).toBe(2)
    expect(r.wins).toBe(2)
    expect(r.played).toBe(3)
  })

  // Without this guard, Again → win → Again → win reads as a streak of
  // three, which makes the one number the site asks you to care about
  // the one number it cannot be trusted on.
  it('scores a day once, however many times you press Again', () => {
    saveResult('zoom', { won: false, guesses: 5, dayKey: '2026-08-10' })
    saveResult('zoom', { won: true, guesses: 1, dayKey: '2026-08-10' })
    saveResult('zoom', { won: true, guesses: 1, dayKey: '2026-08-10' })
    const r = getRecord('zoom')
    expect(r.played).toBe(1)
    expect(r.wins).toBe(0)
    expect(r.streak).toBe(0)
  })

  it('keeps the five games on separate streaks', () => {
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-10' })
    saveResult('wordgrid', { won: false, guesses: 6, dayKey: '2026-08-10' })
    expect(getRecord('zoom').streak).toBe(1)
    expect(getRecord('wordgrid').streak).toBe(0)
  })

  it('continues a streak across a month boundary', () => {
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-31' })
    const r = saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-09-01' })
    expect(r.streak).toBe(2)
  })

  it('continues a streak across the turn of the year', () => {
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-12-31' })
    const r = saveResult('zoom', { won: true, guesses: 2, dayKey: '2027-01-01' })
    expect(r.streak).toBe(2)
  })
})

describe('getRecord', () => {
  it('returns null for a game never played', () => {
    expect(getRecord('thennow')).toBeNull()
  })

  it('carries a streak over from the key used before the rename', () => {
    localStorage.setItem(
      'towndaily.v1',
      JSON.stringify({ zoom: { streak: 9, best: 9, played: 20, wins: 15 } })
    )
    expect(getRecord('zoom').streak).toBe(9)
    // and copies it forward, so the legacy key is read once, not forever
    expect(JSON.parse(localStorage.getItem('fremont.record')).zoom.streak).toBe(9)
  })

  it('survives a corrupt value rather than taking the page down', () => {
    localStorage.setItem('fremont.record', '{ not json')
    expect(getRecord('zoom')).toBeNull()
  })
})

describe('the round in progress', () => {
  it('gives back what was saved for today', () => {
    saveState('wordgrid', '2026-08-10', { rows: ['ADOBE'] })
    expect(loadState('wordgrid', '2026-08-10')).toEqual({ rows: ['ADOBE'] })
  })

  // Yesterday's board is not cleaned up, it is simply not matched. That
  // is what makes a tab left open overnight harmless.
  it('ignores a board stamped with another day', () => {
    saveState('wordgrid', '2026-08-10', { rows: ['ADOBE'] })
    expect(loadState('wordgrid', '2026-08-11')).toBeNull()
  })

  it('keeps the five games apart', () => {
    saveState('wordgrid', '2026-08-10', { rows: ['ADOBE'] })
    saveState('zoom', '2026-08-10', { guesses: 2 })
    expect(loadState('wordgrid', '2026-08-10')).toEqual({ rows: ['ADOBE'] })
    expect(loadState('zoom', '2026-08-10')).toEqual({ guesses: 2 })
  })

  it('clears one game without touching the others', () => {
    saveState('wordgrid', '2026-08-10', { rows: ['ADOBE'] })
    saveState('zoom', '2026-08-10', { guesses: 2 })
    clearState('wordgrid', '2026-08-10')
    expect(loadState('wordgrid', '2026-08-10')).toBeNull()
    expect(loadState('zoom', '2026-08-10')).toEqual({ guesses: 2 })
  })

  it('resetAll wipes both streaks and today', () => {
    saveResult('zoom', { won: true, guesses: 2, dayKey: '2026-08-10' })
    saveState('zoom', '2026-08-10', { guesses: 2 })
    resetAll()
    expect(getRecord('zoom')).toBeNull()
    expect(loadState('zoom', '2026-08-10')).toBeNull()
  })
})

describe('when storage is unavailable', () => {
  // Private browsing and a full quota both throw on setItem. The game
  // has to keep playing — it just forgets.
  it('does not throw when writing fails', () => {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('QuotaExceededError')
      },
      removeItem: () => {},
    }
    expect(() => saveResult('zoom', { won: true, guesses: 1, dayKey: '2026-08-10' })).not.toThrow()
    expect(() => saveState('zoom', '2026-08-10', { guesses: 1 })).not.toThrow()
  })

  it('does not throw when reading fails', () => {
    globalThis.localStorage = {
      getItem: () => {
        throw new DOMException('SecurityError')
      },
      setItem: () => {},
      removeItem: () => {},
    }
    expect(() => getRecord('zoom')).not.toThrow()
    expect(getRecord('zoom')).toBeNull()
  })
})
