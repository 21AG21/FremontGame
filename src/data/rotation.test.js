import { describe, it, expect } from 'vitest'
import { zoomForDay, ZOOM_POOL } from './zoom.js'
import { groupsForDay, GROUPS_PER_BOARD, ITEMS_PER_GROUP } from './groups.js'
import { thenNowForDay, SCENES } from './thennow.js'
import { roundsForDay } from './higherlower.js'
import { answerForDay, ANSWERS, isWord } from './words.js'

// Three years. A daily product is not a thing you can test on today's
// date — the failure that matters is the one that lands on some Tuesday
// in 2028 when nobody is looking, and by then the puzzle is the product.
const DAYS = 1100
const days = Array.from({ length: DAYS }, (_, i) => i + 1)

// How long a pool has to go before it is allowed to repeat itself.
// Below this the player notices, and a daily game that visibly repeats
// reads as abandoned.
const firstRepeatGap = (pick) => {
  const lastSeen = new Map()
  let closest = Infinity
  for (const day of days) {
    const key = pick(day)
    if (lastSeen.has(key)) closest = Math.min(closest, day - lastSeen.get(key))
    lastSeen.set(key, day)
  }
  return closest
}

describe('Zoom', () => {
  it('serves a complete puzzle every day', () => {
    for (const day of days) {
      const p = zoomForDay(day)
      expect(p.answerId, `day ${day}`).toBeTruthy()
      expect(p.levels.length).toBe(6)
      expect(p.maxGuesses).toBe(5)
      expect(p.focus, `day ${day}`).toBeTruthy()
      expect(Number.isFinite(p.focus.x)).toBe(true)
      expect(Number.isFinite(p.focus.y)).toBe(true)
    }
  })

  it('names a place that is actually in the pool', () => {
    const ids = new Set(ZOOM_POOL.map((p) => p.id))
    for (const day of days) expect(ids.has(zoomForDay(day).answerId), `day ${day}`).toBe(true)
  })

  it('opens zoomed in and ends at life size', () => {
    const { levels } = zoomForDay(1)
    expect(levels[0]).toBeGreaterThan(2)
    expect(levels[levels.length - 1]).toBe(1)
    for (let i = 1; i < levels.length; i++) expect(levels[i]).toBeLessThan(levels[i - 1])
  })

  // A walk over a pool coprime with its stride visits every member
  // before it repeats any. If that ever stops being true, some places
  // are stranded and never get a turn.
  it('uses the whole pool before repeating', () => {
    expect(firstRepeatGap((d) => zoomForDay(d).answerId)).toBe(ZOOM_POOL.length)
  })

  it('reaches every place in the pool', () => {
    const seen = new Set(days.map((d) => zoomForDay(d).answerId))
    expect(seen.size).toBe(ZOOM_POOL.length)
  })
})

describe('Groups', () => {
  it('deals three groups of four every day', () => {
    for (const day of days) {
      const board = groupsForDay(day)
      expect(board, `day ${day}`).toHaveLength(GROUPS_PER_BOARD)
      for (const g of board) {
        expect(g.items, `day ${day} — ${g.label}`).toHaveLength(ITEMS_PER_GROUP)
        expect(g.label).toBeTruthy()
      }
    }
  })

  // The pool shares tiles on purpose — Mission San Jose is a township
  // and a high school and a mission. Two groups that share one on the
  // same board makes the puzzle unsolvable, not clever.
  it('never puts the same tile in two groups', () => {
    for (const day of days) {
      const tiles = groupsForDay(day).flatMap((g) => g.items)
      expect(new Set(tiles).size, `day ${day}: ${tiles.join(', ')}`).toBe(
        GROUPS_PER_BOARD * ITEMS_PER_GROUP
      )
    }
  })

  // One way in and one that makes you work. An all-gentle board one day
  // and an all-brutal one the next is what picking tiers at random gives
  // you, and it makes the difficulty feel arbitrary rather than authored.
  it('always offers the easiest tier and the hardest', () => {
    for (const day of days) {
      const tiers = groupsForDay(day).map((g) => g.difficulty)
      expect(tiers, `day ${day}`).toContain(0)
      expect(tiers, `day ${day}`).toContain(3)
      expect(
        tiers.some((t) => t === 1 || t === 2),
        `day ${day}`
      ).toBe(true)
    }
  })

  it('keeps a fortnight between showing a category again', () => {
    const lastSeen = new Map()
    let closest = Infinity
    let where = ''
    for (const day of days) {
      for (const g of groupsForDay(day)) {
        if (lastSeen.has(g.label)) {
          const gap = day - lastSeen.get(g.label)
          if (gap < closest) {
            closest = gap
            where = `${g.label} on day ${lastSeen.get(g.label)} and again on ${day}`
          }
        }
        lastSeen.set(g.label, day)
      }
    }
    expect(closest, where).toBeGreaterThanOrEqual(11)
  })

  it('is the same board every time you ask for the same day', () => {
    for (const day of [1, 57, 300, 1099]) {
      expect(groupsForDay(day)).toEqual(groupsForDay(day))
    }
  })
})

describe('Then & Now', () => {
  it('serves a complete puzzle every day', () => {
    for (const day of days) {
      const p = thenNowForDay(day)
      expect(p.scene, `day ${day}`).toBeTruthy()
      expect(p.place).toBeTruthy()
      expect(p.maxGuesses).toBe(3)
    }
  })

  // The year has to be among the years on offer, or the puzzle cannot
  // be won at all.
  it('puts the right answer among the options', () => {
    for (const day of days) {
      const p = thenNowForDay(day)
      expect(p.options, `day ${day}`).toContain(p.answerYear)
      expect(new Set(p.options).size, `day ${day}`).toBe(p.options.length)
    }
  })

  it('uses the whole pool before repeating', () => {
    expect(firstRepeatGap((d) => thenNowForDay(d).scene.id ?? thenNowForDay(d).place)).toBe(
      SCENES.length
    )
  })
})

describe('Higher or Lower', () => {
  // The loop that builds these gives up after 400 tries. Four rounds on
  // a five-round board with a pass mark of four is a game nobody can
  // lose, and it would ship silently.
  it('always finds five rounds', () => {
    for (const day of days) {
      expect(roundsForDay(day), `day ${day}`).toHaveLength(5)
    }
  })

  it('never asks a question whose answer is a coin flip', () => {
    for (const day of days) {
      for (const r of roundsForDay(day)) {
        expect(r.a.value, `day ${day} — ${r.a.name} vs ${r.b.name}`).not.toBe(r.b.value)
      }
    }
  })

  // A fact shown once has given its own number away; asking about it
  // again the same day is a free round.
  it('never shows the same fact twice in one day', () => {
    for (const day of days) {
      const seen = new Set()
      for (const r of roundsForDay(day)) {
        for (const f of [r.a, r.b]) {
          const key = `${r.unit}|${f.name}`
          expect(seen.has(key), `day ${day} — ${key}`).toBe(false)
          seen.add(key)
        }
      }
    }
  })

  it('never asks five questions about the same unit', () => {
    for (const day of days) {
      const count = {}
      for (const r of roundsForDay(day)) count[r.unit] = (count[r.unit] || 0) + 1
      for (const [unit, n] of Object.entries(count)) {
        expect(n, `day ${day} — ${unit}`).toBeLessThanOrEqual(2)
      }
    }
  })

  it('shows a side the player can actually reason from', () => {
    for (const day of days) {
      for (const r of roundsForDay(day)) {
        expect(r.a.anchor, `day ${day} — ${r.a.name}`).toBeTruthy()
      }
    }
  })
})

describe('The Word', () => {
  it('serves a five-letter answer every day', () => {
    for (const day of days) {
      const w = answerForDay(day)
      expect(w, `day ${day}`).toMatch(/^[A-Z]{5}$/)
    }
  })

  // An answer outside the guess list is one nobody can type, which is
  // an unwinnable day rather than a hard one.
  it('serves an answer the keyboard will accept', () => {
    for (const day of days) expect(isWord(answerForDay(day)), `day ${day}`).toBe(true)
  })

  it('holds up before day one, in case a clock is wrong', () => {
    expect(answerForDay(0)).toMatch(/^[A-Z]{5}$/)
    expect(answerForDay(-3)).toMatch(/^[A-Z]{5}$/)
  })

  it('uses the whole queue before repeating', () => {
    expect(firstRepeatGap(answerForDay)).toBe(ANSWERS.length)
  })
})

describe('every game, every day', () => {
  // The single question that matters for a daily product: is there a
  // day in the next three years that serves a broken board.
  it('gives the same answer twice for the same day', () => {
    for (const day of [1, 2, 99, 365, 800, 1100]) {
      expect(zoomForDay(day)).toEqual(zoomForDay(day))
      expect(thenNowForDay(day)).toEqual(thenNowForDay(day))
      expect(roundsForDay(day)).toEqual(roundsForDay(day))
      expect(answerForDay(day)).toBe(answerForDay(day))
    }
  })
})
