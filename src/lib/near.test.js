import { describe, it, expect } from 'vitest'
import { groupsForDay } from '../data/groups.js'
import { awayFrom, AWAY } from './near.js'

// The board is three groups of four, so a four-tile guess can only ever
// be right, one away, or two away. Anything else means the arithmetic
// has drifted from the board it is describing — and that failure is
// silent, because a wrong number still renders as a confident sentence.

const boardFor = (day) => {
  const groups = groupsForDay(day)
  return { groups, groupOf: (item) => groups.find((g) => g.items.includes(item)) }
}

describe('how many away', () => {
  it('is nothing away when the guess is right', () => {
    const { groups, groupOf } = boardFor(5)
    for (const g of groups) expect(awayFrom(g.items, groupOf)).toBe(0)
  })

  it('is one away when three of the four belong together', () => {
    const { groups, groupOf } = boardFor(5)
    expect(awayFrom([...groups[0].items.slice(0, 3), groups[1].items[0]], groupOf)).toBe(1)
  })

  it('is two away on a two-and-two split', () => {
    const { groups, groupOf } = boardFor(5)
    expect(
      awayFrom([...groups[0].items.slice(0, 2), ...groups[1].items.slice(0, 2)], groupOf)
    ).toBe(2)
  })

  it('is two away when the four come from three different groups', () => {
    const { groups, groupOf } = boardFor(5)
    const guess = [groups[0].items[0], groups[0].items[1], groups[1].items[0], groups[2].items[0]]
    expect(awayFrom(guess, groupOf)).toBe(2)
  })

  // Every four-tile guess anybody can make, on more than a year of
  // boards, reduced to its shape: the answer has to be a number the
  // sentence table can actually say.
  it('never reports a distance it has no words for', () => {
    for (let day = 1; day <= 400; day++) {
      const { groups, groupOf } = boardFor(day)
      const all = groups.flatMap((g) => g.items)
      for (let a = 0; a < all.length; a++)
        for (let b = a + 1; b < all.length; b++)
          for (let c = b + 1; c < all.length; c++)
            for (let d = c + 1; d < all.length; d++) {
              const n = awayFrom([all[a], all[b], all[c], all[d]], groupOf)
              expect(n, `day ${day}`).toBeLessThanOrEqual(2)
              expect(AWAY[n], `day ${day}`).toBeDefined()
            }
    }
  })

  it('only stays quiet when the guess is actually correct', () => {
    for (let day = 1; day <= 200; day++) {
      const { groups, groupOf } = boardFor(day)
      const all = groups.flatMap((g) => g.items)
      const labels = new Set(groups.map((g) => g.items.slice().sort().join('|')))
      for (let a = 0; a < all.length; a++)
        for (let b = a + 1; b < all.length; b++)
          for (let c = b + 1; c < all.length; c++)
            for (let d = c + 1; d < all.length; d++) {
              const guess = [all[a], all[b], all[c], all[d]]
              const isGroup = labels.has(guess.slice().sort().join('|'))
              expect(awayFrom(guess, groupOf) === 0, `day ${day}: ${guess.join(', ')}`).toBe(
                isGroup
              )
            }
    }
  })
})
