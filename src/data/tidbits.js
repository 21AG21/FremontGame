// One thing about Fremont, handed over when you finish a game.
//
// Rows live in content/tidbits.csv; edit that and run `npm run content`.
// Every row carries a source, and the validator there refuses one that
// does not — see scripts/content-build.mjs for why.
//
// Five games a day, five different facts. Playing all of them should be
// worth something beyond five streaks, and the cheapest version of that
// is not repeating yourself before lunch.

import TIDBITS from './generated/tidbits.js'
import { PUZZLE_TYPES } from './puzzles.js'

// Same trick the scene and word pools use. A hash would repeat: with
// forty facts and five draws a day, birthday collisions put the same
// line under two of your five results inside the first week. A walk
// whose stride is coprime with the pool visits every fact before it
// revisits any, so a repeat is impossible until the pool is exhausted.
//
// Derived from the pool rather than written down, because a literal that
// happens to be coprime with today's count goes quietly composite the
// day somebody adds a row — and the failure is invisible: the site keeps
// working, on a fraction of the facts.
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const STEP = (() => {
  const n = TIDBITS.length
  if (n < 2) return 1
  for (let s = Math.max(7, Math.round(n * 0.618)); s < n + 7; s++) if (gcd(s, n) === 1) return s
  return 1
})()

// The counter is one long line, not a per-game sequence: day 0 takes the
// first five, day 1 the next five. That is what makes the five distinct
// within a day and keeps them distinct across the turn of one.
const SLOTS = PUZZLE_TYPES.length

export function tidbitFor(day, gameId) {
  const n = TIDBITS.length
  if (!n) return null
  const slot = PUZZLE_TYPES.findIndex((t) => t.id === gameId)
  // An unknown game still gets a fact rather than a hole in the page.
  const counter = day * SLOTS + (slot < 0 ? 0 : slot)
  return TIDBITS[(((counter * STEP) % n) + n) % n]
}

export { STEP as TIDBIT_STEP, SLOTS as TIDBIT_SLOTS }
