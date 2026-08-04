// What day it is, decided once, in one place.
//
// This file exists because getting it wrong is fatal for a daily game,
// and the first version got it wrong twice.
//
// The bug that mattered: the puzzle index was computed from local time
// and the storage key from `toISOString()`, which is UTC. In Fremont
// that means the key rolls over at 5pm while the puzzle rolls over at
// midnight — seven broken hours every evening, which is exactly when
// people play. Inside that window a finished round is filed under
// tomorrow, so tomorrow silently refuses to score and the streak stops
// without ever saying why.
//
// The second bug: stepping back a day by parsing a date as local and
// formatting it as UTC drops two days instead of one for anyone east of
// Greenwich. Streaks never continued for a player in India.
//
// The rule now: the day is the local civil date — what the calendar on
// the player's wall says — and every derived value is computed from
// that string, parsed as UTC on both sides so the arithmetic is exact
// whole days and daylight saving cancels out.

const pad = (n) => String(n).padStart(2, '0')

// Day 1 is the day the thing went live.
const EPOCH = '2026-08-01'

const utc = (key) => Date.parse(`${key}T00:00:00Z`)

export function civilDate(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function dayNumber(key) {
  return Math.round((utc(key) - utc(EPOCH)) / 86400000) + 1
}

export function dayBefore(key) {
  return new Date(utc(key) - 86400000).toISOString().slice(0, 10)
}

// Both constants are captured at import, so a tab left open overnight is
// still playing yesterday. App.jsx watches for the turn and reloads.
export const DAY_KEY = civilDate()
export const DAY_NUMBER = dayNumber(DAY_KEY)

export const dayHasTurned = () => civilDate() !== DAY_KEY
