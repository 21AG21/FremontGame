// Per-puzzle-type streak + result tracking, kept in localStorage.
// Real version would sync this to Supabase so streaks survive a phone swap.

const KEY = 'towndaily.v1'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* private browsing, storage full — fail quietly, the game still plays */
  }
}

export function getRecord(puzzleId) {
  return readAll()[puzzleId] || null
}

export function saveResult(puzzleId, { won, guesses, dayKey }) {
  const all = readAll()
  const prev = all[puzzleId] || { streak: 0, best: 0, played: 0, wins: 0 }

  all[puzzleId] = {
    ...prev,
    played: prev.played + 1,
    wins: prev.wins + (won ? 1 : 0),
    streak: won ? prev.streak + 1 : 0,
    best: Math.max(prev.best, won ? prev.streak + 1 : 0),
    lastPlayed: dayKey,
    lastResult: { won, guesses },
  }

  writeAll(all)
  return all[puzzleId]
}

export function resetAll() {
  writeAll({})
}
