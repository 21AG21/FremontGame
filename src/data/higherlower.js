// ─────────────────────────────────────────────────────────────
//  HIGHER OR LOWER — the fact pool.
//
//  Grouped by unit, because the only fair question is one where
//  both sides are measured the same way. A day's puzzle is five
//  pairs drawn from these by day number.
//
//  Everything here is real and checked. Where a number moves —
//  populations, mostly — the unit says so and the value is the
//  rounded census figure, not a live count. A hyperlocal puzzle
//  that invents numbers is worse than no puzzle: the first person
//  who knows better stops trusting it and never comes back.
// ─────────────────────────────────────────────────────────────

import FACTS_DATA from './generated/facts.js'
export const FACT_SETS = FACTS_DATA

// Flat list, for anything that wants to count the pool.
export const ALL_FACTS = FACT_SETS.flatMap((s) => s.facts.map((f) => ({ ...f, unit: s.unit })))

// The shown side is always an anchor — somewhere you have stood, driven
// over, or can at least place on a map.
//
// This is the rule the whole game turns on. "Vollmer Peak vs Mount
// Sizer" is not a question; it is a coin flip wearing a puzzle costume,
// because there is no reasoning path from either name to a number. Give
// the player one end of the scale they can picture and the same obscure
// fact becomes an inference: you know Mission Peak is 2,520, so you can
// reason about whether some ridge behind it is taller.
// Every legal question in a unit, worked out once: an anchor on the
// shown side, anything on the hidden side, no self-pairs and no ties.
// Walking this list beats hashing into it — a hash repeated "The Bay
// Bridge vs The Golden Gate Bridge" verbatim on consecutive days, and
// a daily player spots that faster than they spot a hard question.
// The list is ordered anchor-major, so consecutive entries share a shown
// side. Stepping by about a third of it walked back onto the same anchor
// every three days; the golden-ratio step is the standard fix — it is
// the stride least likely to land near a small fraction of the length.
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const coprimeStep = (n) => {
  for (let s = Math.max(7, Math.round(n * 0.618)); s < n + 7; s++) if (gcd(s, n) === 1) return s
  return 1
}

const PAIRS = FACT_SETS.map((set) => {
  const list = []
  for (const a of set.facts) {
    if (!a.anchor) continue
    for (const b of set.facts) {
      if (a === b || a.value === b.value) continue
      list.push({ unit: set.unit, a, b })
    }
  }
  return { unit: set.unit, list, step: coprimeStep(list.length) }
})

// Five rounds, each a pair from the same unit, no fact used twice in a
// day and no unit used more than twice — five elevation questions in a
// row is one question asked five times.
//
// The day offsets walk rather than hash: a hashed pick repeated "The Bay
// Bridge vs The Golden Gate Bridge" verbatim on consecutive days, which
// a daily player spots immediately.
export function roundsForDay(day) {
  const rounds = []
  const usedFacts = new Set()
  const unitCount = {}

  for (let i = 0; rounds.length < 5 && i < 400; i++) {
    const set = PAIRS[(day * 3 + i) % PAIRS.length]
    if (!set.list.length) continue
    if ((unitCount[set.unit] || 0) >= 2) continue

    // Walk the unit's pair list. `nth` advances both with the day and
    // with how many times this unit has already been asked today, so
    // the two rounds a unit gets are never the same question.
    const nth = day * set.step + (unitCount[set.unit] || 0) * 17 + Math.floor(i / PAIRS.length)
    const { a, b } = set.list[nth % set.list.length]

    // A fact that has already appeared today gives its own answer away.
    const key = (f) => set.unit + '|' + f.name
    if (usedFacts.has(key(a)) || usedFacts.has(key(b))) continue

    usedFacts.add(key(a))
    usedFacts.add(key(b))
    unitCount[set.unit] = (unitCount[set.unit] || 0) + 1
    rounds.push({ unit: set.unit, a, b })
  }

  return rounds
}
