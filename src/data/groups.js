// GROUPS — the category pool.
//
// Rows live in content/groups.csv; edit that and run `npm run content`.
//
// Items repeat across the pool on purpose — "Mission San Jose" is a
// township, a high school, a mission and a district. The picker never
// puts two groups that share a tile on one board, so the trap survives
// without ever being unsolvable.

import GROUPS_DATA from './generated/groups.js'
export const GROUPS = GROUPS_DATA

export const GROUP_COUNT = GROUPS.length

const byDifficulty = [0, 1, 2, 3].map((d) => GROUPS.filter((g) => g.d === d))

// All four dealt, so a category has no hidden fifth member off-board.
export const ITEMS_PER_GROUP = 4
const GROUPS_PER_BOARD = 3

// Easiest and hardest tiers every day, middle two alternating. Dropping a
// tier at random gives an all-gentle board one day and an all-brutal one
// the next; you want a way in and something that makes you work.
const tiersForDay = (day) => [0, day % 2 === 0 ? 1 : 2, 3]

// What the board calls its three groups, as opposed to what the pool
// calls them. The pool has four tiers and a board takes three of them,
// so the middle one is tier 1 on even days and tier 2 on odd — grading
// the board by pool tier would make "medium" a different thing every
// other day. Rank is the board's own scale and is always 0, 1, 2.
//
// This existed in the data from the start and appeared nowhere on
// screen, which is the same as not existing: three categories lifted
// out in whatever order you happened to solve them, all the same
// colour, reads as three categories of identical difficulty.
export const RANK_NAMES = ['Easy', 'Medium', 'Hard']

// Each tier walks a fixed cycle rather than picking at random — from 25
// candidates a random repeat inside four days is likely, not rare, and
// reads as laziness. Coprime with 25, so it visits all 25 before
// repeating. Deliberately not re-offset each lap: that puts a group at
// the end of one lap and the start of the next.
const STEP = 7
const cycleSlot = (day, d, n) => ((day % n) * STEP + d * 5) % n

// How far a collision jumps. +1 lands on the slot some other day reaches
// directly, which showed the same category twice in seven days. Stepping
// 2 lifts the closest repeat over 800 days to 11.
const WALK = 2

export function groupsForDay(day) {
  const chosen = []
  const taken = new Set()

  for (const d of tiersForDay(day)) {
    const pool = byDifficulty[d]
    const start = cycleSlot(day, d, pool.length)

    for (let step = 0; step < pool.length; step++) {
      const g = pool[(start + step * WALK) % pool.length]
      if (g.items.some((i) => taken.has(i))) continue
      g.items.forEach((i) => taken.add(i))
      // tiersForDay is ascending, so position in `chosen` is the rank.
      chosen.push({ label: g.label, difficulty: d, rank: chosen.length, items: [...g.items] })
      break
    }
  }

  return chosen
}

export { GROUPS_PER_BOARD }
