import { describe, it, expect } from 'vitest'
import { tidbitFor, TIDBIT_SLOTS } from './tidbits.js'
import { PUZZLE_TYPES } from './puzzles.js'
import TIDBITS from './generated/tidbits.js'

// The fact under a finished board.
//
// Two ways this goes wrong and neither one throws. It can hand you the
// same line twice in a day, which makes playing all five feel like a
// bug. And it can drift onto a fraction of the pool — a stride that
// stops being coprime the day somebody adds a row — which nothing
// notices, because the site keeps working perfectly on eight facts.

const GAMES = PUZZLE_TYPES.map((t) => t.id)

describe('the day’s five facts', () => {
  it('gives every game a different one', () => {
    for (let day = 0; day < 400; day++) {
      const seen = GAMES.map((g) => tidbitFor(day, g).id)
      expect(new Set(seen).size, `day ${day}: ${seen.join(', ')}`).toBe(GAMES.length)
    }
  })

  it('gives the same reader the same fact all day', () => {
    expect(tidbitFor(12, 'zoom')).toEqual(tidbitFor(12, 'zoom'))
  })

  it('does not carry one over from yesterday', () => {
    for (let day = 0; day < 400; day++) {
      const today = new Set(GAMES.map((g) => tidbitFor(day, g).id))
      const tomorrow = GAMES.map((g) => tidbitFor(day + 1, g).id)
      for (const id of tomorrow) expect(today.has(id), `day ${day} → ${day + 1}: ${id}`).toBe(false)
    }
  })
})

describe('the walk covers the pool', () => {
  // The failure this exists for is silent: a stride sharing a factor
  // with the pool size still returns a fact every time, just never most
  // of them.
  it('reaches every fact before it repeats any', () => {
    const seen = []
    const days = Math.ceil(TIDBITS.length / TIDBIT_SLOTS)
    for (let day = 0; day < days; day++) for (const g of GAMES) seen.push(tidbitFor(day, g).id)
    expect(new Set(seen).size).toBe(TIDBITS.length)
  })
})

describe('it never leaves a hole in the page', () => {
  it('answers for a game it has never heard of', () => {
    expect(() => tidbitFor(3, 'not-a-game')).not.toThrow()
    expect(tidbitFor(3, 'not-a-game')).not.toBeNull()
  })

  it('answers for a day number that is not one', () => {
    for (const day of [0, -1, -400, 1e6]) {
      expect(() => tidbitFor(day, 'zoom'), String(day)).not.toThrow()
      expect(tidbitFor(day, 'zoom'), String(day)).not.toBeNull()
    }
  })
})

describe('what the facts themselves have to be', () => {
  it('all say something, and all say where it came from', () => {
    for (const t of TIDBITS) {
      expect(t.text.trim(), t.id).not.toBe('')
      // Enforced in the pipeline too. Doubled here because this is the
      // claim the whole site rests on: a fact with no source is a thing
      // we told somebody about the place they live, on no authority.
      expect(t.source.trim(), t.id).not.toBe('')
    }
  })

  // The link, not the name. Forty facts once shipped with a plausible
  // attribution on every row and no link on any; four of those names
  // turned out to credit a museum that had never said it. A name can be
  // written from memory. A URL is a thing somebody can go and open.
  it('all point at something openable', () => {
    for (const t of TIDBITS) {
      expect(t.url, t.id).toMatch(/^https?:\/\/\S+$/)
    }
  })

  // Nothing that reads as a repeated template. "which is why" appeared
  // four times in the first draft and the em-dash-into-a-summary six.
  it('does not lean on one construction', () => {
    const count = (re) => TIDBITS.filter((t) => re.test(t.text)).length
    expect(count(/which is (why|exactly why)/i), 'which is why').toBeLessThanOrEqual(1)
    expect(count(/ — /), 'em-dash tails').toBeLessThanOrEqual(4)
  })

  // American spellings, for an American city.
  it('is written in the language of the town it is about', () => {
    for (const t of TIDBITS) {
      expect(t.text, t.id).not.toMatch(/\b(colour|centre|kerb|the other way round|has done)\b/i)
    }
  })

  it('are short enough to sit under a result', () => {
    for (const t of TIDBITS) expect(t.text.length, `${t.id}: ${t.text}`).toBeLessThanOrEqual(190)
  })

  it('has enough of them to be worth having', () => {
    expect(TIDBITS.length).toBeGreaterThanOrEqual(TIDBIT_SLOTS * 5)
  })
})
