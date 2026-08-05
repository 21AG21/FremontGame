// ─────────────────────────────────────────────────────────────
//  GROUPS — the category pool.
//
//  The rows live in content/groups.csv. Edit that, run `npm run
//  content`, and this file picks up the change — none of the logic
//  below moves.
//
//  difficulty 0 is the one you spot first, 3 is the one you only
//  get by elimination. A day's board is three groups picked by day
//  number, from three of the four tiers, guaranteed not to share a
//  tile.
//
//  Traps are the whole game, so items are deliberately repeated
//  ACROSS the pool — "Mission San Jose" is a township, a high
//  school, a mission and a district; "Niles" is a township, a
//  canyon and a film studio. The picker refuses to put two groups
//  that share a tile on the same board, which means those pairs
//  simply never collide, and the trap survives.
//
//  Everything here is real. Where I could not verify a roster
//  (which middle school opened when, exactly which streets are
//  named for whom) the group is not in the pool.
// ─────────────────────────────────────────────────────────────

import GROUPS_DATA from './generated/groups.js'
export const GROUPS = GROUPS_DATA

export const GROUP_COUNT = GROUPS.length

const byDifficulty = [0, 1, 2, 3].map((d) => GROUPS.filter((g) => g.d === d))

// Three groups of four, which is still twelve tiles and still four clean
// rows of three in the doc's grid. The board used to run four groups of
// three, dealt out of categories that hold four — so every category had
// a hidden fourth member sitting off the board. Dealing all four ends
// that: what you see is the whole category.
export const ITEMS_PER_GROUP = 4

// Three groups out of four difficulty tiers, so one tier sits out each
// day. Which one is not a straight rotation: the easiest and the hardest
// are always on the board and the middle two alternate. Dropping a tier
// at random gives you an all-gentle board one day and an all-brutal one
// the next, and neither is a good puzzle — you want a way in and you
// want something that makes you work.
const GROUPS_PER_BOARD = 3

const tiersForDay = (day) => [0, day % 2 === 0 ? 1 : 2, 3]

// Largest number coprime with 25 that isn't 1 — any coprime step walks
// the whole tier before repeating, this one just doesn't walk it in an
// order you'd notice.
const STEP = 7

// Which group a tier serves on a given day.
//
// Picking at random from 25 looks fine day to day and is wrong across a
// week: with 25 candidates a repeat inside four days is likely, not
// rare, and "Precede Ford" showing up twice running reads as laziness
// even when the tiles differ. So each tier walks a fixed cycle instead,
// every group exactly once per 25 days.
//
// The cycle is deliberately NOT re-offset each lap. Shifting it puts a
// group at the end of one lap and the start of the next, which is the
// two-day repeat this was meant to kill. Boards stay varied anyway: the
// four tiers walk independently, and which item sits out rotates daily.
const cycleSlot = (day, d, n) => ((day % n) * STEP + d * 5) % n

// How far a collision jumps. Walking to the next slot puts the bumped
// group on exactly the slot some other day reaches directly, which is
// how "A park and the person it is named for" turned up twice in seven
// days. 2 is coprime with 25, so the walk still reaches every group in
// the tier, and it lifts the closest repeat over 800 days from 7 days
// to 11 — far enough that nobody is being shown a category they can
// still remember.
const WALK = 2

// One group from each of the day's three tiers. Two groups that share a
// tile can never sit on the same board — that is what keeps "Mission San
// Jose is a school AND a township" a trap rather than a bug — so a
// collision walks forward in the cycle.
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
      chosen.push({ label: g.label, difficulty: d, items: [...g.items] })
      break
    }
  }

  return chosen
}

export { GROUPS_PER_BOARD }
