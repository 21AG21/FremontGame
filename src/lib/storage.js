// What the site remembers, all of it on your own device.
//
// Two things live here. The RECORD is your streak and win rate per game,
// which persists forever. TODAY is the state of a round in progress,
// which is scoped to a single day and thrown away when the day turns.
//
// Both keys begin "fremont." because the privacy document says they do.

const RECORD_KEY = 'fremont.record'
const TODAY_KEY = 'fremont.today'
const LEGACY_KEY = 'towndaily.v1'

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch {
    return fallback
  }
}

const write = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    /* private browsing, storage full — fail quietly, the game still plays */
  }
}

function readRecords() {
  const current = read(RECORD_KEY, null)
  if (current) return current
  // Anyone who played before the rename keeps their streak.
  const legacy = read(LEGACY_KEY, null)
  if (legacy) write(RECORD_KEY, legacy)
  return legacy || {}
}

export function getRecord(puzzleId) {
  return readRecords()[puzzleId] || null
}

const dayBefore = (dayKey) => {
  const d = new Date(`${dayKey}T00:00:00`)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

// Scores a finished round — once per game per day, no matter how many
// times you press Again.
//
// Without the day guard, Again → win → Again → win reads as a streak of
// three, which makes the one number the site asks you to care about the
// one number it cannot be trusted on. Replays after the first are
// unscored practice, which is what a replay button should be.
export function saveResult(puzzleId, { won, guesses, dayKey }) {
  const all = readRecords()
  const prev = all[puzzleId] || { streak: 0, best: 0, played: 0, wins: 0 }

  if (prev.lastPlayed === dayKey) return prev

  // A streak is consecutive days, so a gap resets it even after a win.
  const continues = prev.lastPlayed === dayBefore(dayKey)
  const streak = won ? (continues ? prev.streak + 1 : 1) : 0

  all[puzzleId] = {
    ...prev,
    played: prev.played + 1,
    wins: prev.wins + (won ? 1 : 0),
    streak,
    best: Math.max(prev.best || 0, streak),
    lastPlayed: dayKey,
    lastResult: { won, guesses },
  }

  write(RECORD_KEY, all)
  return all[puzzleId]
}

// ── the round in progress ────────────────────────────────────────

// Everything under one key, stamped with the day it belongs to. A stamp
// from yesterday is simply ignored, so there is nothing to clean up.
export function loadState(puzzleId, dayKey) {
  const entry = read(TODAY_KEY, {})[puzzleId]
  return entry && entry.day === dayKey ? entry.state : null
}

export function saveState(puzzleId, dayKey, state) {
  const all = read(TODAY_KEY, {})
  all[puzzleId] = { day: dayKey, state }
  write(TODAY_KEY, all)
}

export function clearState(puzzleId, dayKey) {
  const all = read(TODAY_KEY, {})
  delete all[puzzleId]
  write(TODAY_KEY, all)
  void dayKey
}

export function resetAll() {
  write(RECORD_KEY, {})
  write(TODAY_KEY, {})
}
