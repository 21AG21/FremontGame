// ─────────────────────────────────────────────────────────────
//  ZOOM — the answer queue.
//
//  Every place in town.js is a possible answer except the ones
//  next door, which stay in the list only as decoys: guessing
//  Hayward should tell you you're eight miles off, not be the
//  thing you were meant to name.
//
//  The drawing is composed from the place's motifs rather than
//  drawn by hand — see art/Engraving.jsx. That is the whole
//  reason there can be a hundred of these.
// ─────────────────────────────────────────────────────────────

import { PLACES } from './town.js'
import { distanceMiles } from '../lib/geo.js'

// Two rules decide what can be an answer.
//
// It has to be nameable — fame 3 places stay in the autocomplete as
// wrong guesses, which is where they are useful, and out of the answer
// queue, where they only ever produce "I could not have got that".
//
// And it has to be separable. A pair of places 0.2 miles apart cannot be
// told apart by a distance-and-bearing hint, so guessing the neighbour
// costs a life for being essentially right. Where two candidates sit
// inside a quarter mile of each other, the better-known one is the
// answer and the other becomes a decoy.
const NAMEABLE = PLACES.filter((p) => p.district !== 'Next door' && p.fame <= 2)

export const ZOOM_POOL = NAMEABLE.filter(
  (p) =>
    !NAMEABLE.some(
      (q) => q !== p && (q.fame < p.fame || (q.fame === p.fame && q.id < p.id)) &&
        distanceMiles(p, q) < 0.25
    )
)

export const ZOOM_COUNT = ZOOM_POOL.length

const hashId = (id) => {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const mix = (n) => {
  let h = (n * 2654435761) % 4294967296
  h ^= h >>> 15
  h = (h * 2246822519) % 4294967296
  h ^= h >>> 13
  return h >>> 0
}

// Where the interesting part of each motif actually sits on the plate,
// in fractions of it. A random focus inside a plausible-looking band
// opens half the puzzles on blank sky — the crop has to be aimed at
// the thing that identifies the place, so every motif says where its
// own subject is. Ordered by how much a crop of it gives away, most
// telling first: the picker takes the earliest match in this table.
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

// Opens at 2.6, down from 4.2 and originally 5.5.
//
// These plates are composed from a parts library rather than drawn one
// at a time, so past about 3× the crop lands inside a single shape and
// you are looking at a texture swatch, not a puzzle. Reviewers of three
// different ages independently quit on the opening frame — the first
// screen has to be teasing, not blank.
export const LEVELS = [2.6, 2.1, 1.75, 1.45, 1.2, 1]

export function zoomForDay(day) {
  const place = ZOOM_POOL[mix(day * 2654435761 + 17) % ZOOM_POOL.length]
  return {
    id: 'zoom',
    answerId: place.id,
    focus: focusFor(place),
    levels: LEVELS,
    maxGuesses: 5,
  }
}
