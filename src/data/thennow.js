// ─────────────────────────────────────────────────────────────
//  THEN & NOW — the pool.
//
//  Four separate reviewers called this the best game on the site and
//  it had exactly one puzzle in it. The blocker was always that a
//  then/now pair means two matched photographs per day, which is a
//  sourcing job. The engraving composer removes that: both sides are
//  drawn from motifs, so a pair is two motif lists and a date.
//
//  Thirty entries, not a hundred. Every year is one that was checked
//  against a source before it went in, because a wrong date in a
//  history game is worse than a short queue: the person who catches it
//  never comes back.
//
//  This started at fourteen, and two of the sixteen added later were
//  the exact ones an earlier version of this note listed as
//  unpinnable — Lake Elizabeth was dedicated to its Australian sister
//  city on 22 March 1969, and John Rock moved the California Nursery
//  down from San José in 1884. "I could not find it" is a note to come
//  back to, not a verdict.
// ─────────────────────────────────────────────────────────────

import SCENES_DATA from './generated/scenes.js'
export const SCENES = SCENES_DATA

export const SCENE_COUNT = SCENES.length

const mix = (n) => {
  let h = (n * 2654435761) % 4294967296
  h ^= h >>> 15
  h = (h * 2246822519) % 4294967296
  h ^= h >>> 13
  return h >>> 0
}

const FIRST_YEAR = 1760
const LAST_YEAR = 2024

// Six years to choose from, the true one among them. The decoys are
// spaced far enough apart to be separable by what is in the picture —
// offering 1912 and 1915 together makes it a coin flip between two
// answers the drawing cannot distinguish.
//
// Bounded on purpose. The obvious version of this walks outward until
// it has six, which never terminates for a scene near either end of
// the range: past a certain offset every candidate is out of bounds and
// the loop spins. Here the candidates are a fixed list, tried once
// each, with the spacing rule relaxed rather than the loop extended.
function optionsFor(scene, day) {
  const h = mix(day * 61 + scene.year)
  const wide = scene.year < 1900
  const offsets = wide
    ? [-58, -34, -19, 14, 29, 47, -71, -46, -27, 22, 38, 61]
    : [-41, -26, -13, 11, 23, 38, -55, -33, -19, 17, 30, 49]

  const picked = [scene.year]

  const tryFill = (minGap) => {
    for (let i = 0; i < offsets.length && picked.length < 6; i++) {
      const y = scene.year + offsets[(i + h) % offsets.length]
      if (y < FIRST_YEAR || y > LAST_YEAR) continue
      if (picked.some((p) => Math.abs(p - y) < minGap)) continue
      picked.push(y)
    }
  }

  tryFill(8)
  tryFill(4) // a scene near 1797 or 2017 has less room; take what fits
  tryFill(1)

  // Deliberately NOT sorted. Sorted years turn the earlier/later hint
  // into a binary search: pick the middle button and a player who knows
  // nothing at all wins 100% of the time, without looking at the
  // drawing. Shuffled, the hint still helps but you have to read the
  // picture to use it.
  const order = mix(day * 7717 + scene.year)
  return picked
    .map((y, i) => ({ y, k: mix(order + i * 2654435761) }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.y)
}

// Scenes hashed at random repeated back-to-back 39 times in 400 days —
// one day in ten showed yesterday's puzzle again, same answer. A walk
// coprime with the pool cannot do that: it visits every scene before it
// repeats any.
//
// Derived rather than written down. It used to be a literal 9 with
// "coprime with 14" beside it, which was true of fourteen scenes and
// silently false the moment there were thirty — gcd(9, 30) is 3, so the
// pool would have shrunk to ten scenes on a three-day cycle while every
// test about validity still passed. The stride now follows the pool.
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const SCENE_STEP = (() => {
  const n = SCENES.length
  for (let s = Math.max(7, Math.round(n * 0.618)); s < n + 7; s++) if (gcd(s, n) === 1) return s
  return 1
})()

export function thenNowForDay(day) {
  const scene = SCENES[(day * SCENE_STEP) % SCENES.length]
  return {
    id: 'thennow',
    scene,
    place: scene.caption,
    answerYear: scene.year,
    options: optionsFor(scene, day),
    maxGuesses: 3,
  }
}
