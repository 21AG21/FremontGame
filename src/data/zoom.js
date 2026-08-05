// ZOOM — the answer queue.
//
// Every place in town.js can be the answer except the ones next door,
// which stay in the list as decoys. The drawing is composed from the
// place's motifs (art/Engraving.jsx), which is why there can be a
// hundred of these without a hundred drawings.

import { PLACES } from './town.js'
import { distanceMiles } from '../lib/geo.js'

// Two rules decide what can be an answer: it has to be nameable (fame 3
// is decoy-only, or you get "I could not have got that"), and separable
// — two places closer than this cannot be told apart by a distance-and-
// bearing hint, so guessing the neighbour costs a life for being
// essentially right. 800ft: a quarter mile collapsed City Hall, the main
// library and Washington High into one.
const SEPARATION = 0.15

const NAMEABLE = PLACES.filter((p) => p.district !== 'Next door' && p.fame <= 2)

// Greedy, best-first, compared against SURVIVORS rather than all
// candidates. Comparing against everything lets a place be eliminated by
// a neighbour that is itself eliminated — Aqua Adventure knocked out
// Central Park, which knocked out Lake Elizabeth, so the two best-known
// places in town could never be the answer.
export const ZOOM_POOL = [...NAMEABLE]
  .sort((a, b) => a.fame - b.fame || a.name.localeCompare(b.name))
  .reduce((kept, p) => {
    if (!kept.some((q) => distanceMiles(p, q) < SEPARATION)) kept.push(p)
    return kept
  }, [])

export const ZOOM_COUNT = ZOOM_POOL.length

const hashId = (id) => {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Where each motif's subject sits on the plate, in fractions. A random
// focus opens half the puzzles on blank sky. Ordered by how much a crop
// gives away, most telling first — the picker takes the earliest match.
const ANCHORS = [
  // unmistakable
  ['mission', 0.26, 0.36],
  ['windmill', 0.75, 0.3],
  ['marquee', 0.4, 0.37],
  ['watertower', 0.84, 0.34],
  ['locomotive', 0.38, 0.58],
  ['dome', 0.51, 0.5],
  ['bridge', 0.2, 0.44],
  ['trestle', 0.2, 0.56],
  ['victorian', 0.47, 0.47],
  ['peak', 0.45, 0.31],
  ['fountain', 0.5, 0.7],
  ['stairs', 0.5, 0.62],
  ['gate', 0.5, 0.62],
  ['mound', 0.5, 0.62],
  ['ruin', 0.45, 0.62],
  ['forge', 0.5, 0.63],
  ['barn', 0.48, 0.6],
  ['boardwalk', 0.52, 0.84],
  ['saltponds', 0.35, 0.62],
  ['quarry', 0.4, 0.58],
  ['dock', 0.45, 0.68],
  ['train', 0.35, 0.38],
  ['guideway', 0.2, 0.49],
  ['depot', 0.35, 0.55],
  ['factory', 0.3, 0.6],
  ['stacks', 0.79, 0.35],
  ['adobe', 0.48, 0.6],
  ['plaza', 0.4, 0.68],
  ['awnings', 0.3, 0.47],
  ['shops', 0.28, 0.6],
  ['school', 0.3, 0.57],
  ['civic', 0.45, 0.58],
  ['warehouse', 0.35, 0.66],
  ['tract', 0.3, 0.62],
  // scenery — only used when the place has no structure
  ['canyon', 0.18, 0.31],
  ['towers', 0.3, 0.3],
  ['orchard', 0.35, 0.8],
  ['vines', 0.3, 0.82],
  ['palms', 0.2, 0.58],
  ['eucalyptus', 0.25, 0.5],
  ['olives', 0.2, 0.76],
  ['oaks', 0.16, 0.78],
  ['playground', 0.35, 0.72],
  ['geese', 0.35, 0.82],
  ['stones', 0.3, 0.8],
  ['tules', 0.3, 0.86],
  ['marsh', 0.35, 0.68],
  ['pond', 0.5, 0.68],
  ['water', 0.4, 0.7],
  ['creek', 0.35, 0.86],
  ['levee', 0.3, 0.8],
  ['bay', 0.4, 0.48],
  ['poles', 0.28, 0.47],
  ['flagpole', 0.86, 0.33],
  ['hills', 0.35, 0.42],
  ['ridge', 0.4, 0.4],
  ['tracks', 0.3, 0.83],
  ['trail', 0.5, 0.86],
  ['field', 0.5, 0.86],
  ['gravel', 0.4, 0.85],
  ['lot', 0.3, 0.85],
  ['road', 0.35, 0.85],
  ['grass', 0.4, 0.82],
  ['lawn', 0.4, 0.83],
  ['post', 0.5, 0.6],
]

export function focusFor(place) {
  const motifs = place.motifs || []
  const hit = ANCHORS.find(([name]) => motifs.includes(name))
  const [, ax, ay] = hit || ['', 0.42, 0.6]

  // A little jitter so two places built from the same part are not the
  // identical crop — but small enough to stay on the subject.
  const h = hashId(place.id)
  const jx = (((h >>> 3) % 1000) / 1000 - 0.5) * 0.06
  const jy = (((h >>> 13) % 1000) / 1000 - 0.5) * 0.05

  return {
    x: Math.min(0.94, Math.max(0.06, ax + jx)),
    y: Math.min(0.92, Math.max(0.08, ay + jy)),
  }
}

// Opens at 2.6, down from 5.5. These plates come from a parts library,
// so past about 3x the crop lands inside a single shape and you are
// looking at a texture swatch. Three reviewers quit on the opening
// frame at the old value.
export const LEVELS = [2.6, 2.1, 1.75, 1.45, 1.2, 1]

// Walk the pool rather than hash into it — a hash repeated the same
// place on consecutive days nine times a year.
const STEP = (() => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a)
  const n = ZOOM_POOL.length
  for (let s = Math.max(7, Math.round(n * 0.618)); s < n + 7; s++) if (gcd(s, n) === 1) return s
  return 1
})()

export function zoomForDay(day) {
  const place = ZOOM_POOL[(day * STEP) % ZOOM_POOL.length]
  return {
    id: 'zoom',
    answerId: place.id,
    focus: focusFor(place),
    levels: LEVELS,
    maxGuesses: 5,
  }
}
