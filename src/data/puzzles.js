// ─────────────────────────────────────────────────────────────
//  TODAY'S PUZZLES — Fremont, California. One per type.
//
//  Every fact below is real. That is the whole point: a hyperlocal
//  puzzle with invented facts is worse than no puzzle, because the
//  first person who knows better stops trusting it and leaves.
//
//  In the real version this is a queue — an array per type, indexed
//  by day, banked 30+ days out. See the README.
// ─────────────────────────────────────────────────────────────

import { answerForDay } from './words.js'

// Day 1 is the day the thing went live. Everything else indexes off it.
export const DAY_NUMBER = Math.floor(
  (Date.now() - new Date('2026-08-01T00:00:00').getTime()) / 86400000
) + 1

export const DAY_KEY = new Date().toISOString().slice(0, 10)

// `short` is what fits in a fifth of the section bar; `prompt` is the
// day's question, which sits after the wordmark and is the only place
// the game explains itself.
export const PUZZLE_TYPES = [
  { id: 'zoom', name: 'Zoom', short: 'Zoom', prompt: 'Which place is this?' },
  { id: 'connections', name: 'Groups', short: 'Groups', prompt: 'Find the groups' },
  { id: 'thennow', name: 'Then & Now', short: 'Then/Now', prompt: 'When was this taken?' },
  { id: 'higherlower', name: 'Higher or Lower', short: 'Higher?', prompt: 'Higher or lower?' },
  { id: 'wordgrid', name: 'The Word', short: 'Word', prompt: 'Guess the word' },
]

// ── I. ZOOM ──────────────────────────────────────────────────
export const zoomPuzzle = {
  id: 'zoom',
  answerId: 'mission-san-jose',
  scene: 'mission',
  // Crops into the bell wall — at 11x it's four dark ovals and a rope.
  focus: { x: 0.21, y: 0.37 },
  levels: [5.5, 3.6, 2.5, 1.8, 1.3, 1],
  maxGuesses: 5,
}

// ── II. CONNECTIONS ──────────────────────────────────────────
// The trap: Irvington and Mission San Jose are BOTH townships and
// high schools. A good Connections puzzle punishes the obvious read.
export const connectionsPuzzle = {
  id: 'connections',
  maxMistakes: 4,
  groups: [
    {
      label: 'Built at the plant on Fremont Boulevard',
      difficulty: 0,
      items: ['Nova', 'Corolla', 'Tacoma', 'Model 3'],
    },
    {
      label: 'East Bay Regional Parks, in town',
      difficulty: 1,
      items: ['Coyote Hills', 'Quarry Lakes', 'Ardenwood', 'Alameda Creek'],
    },
    {
      label: 'Townships that became Fremont in 1956',
      difficulty: 2,
      items: ['Centerville', 'Niles', 'Warm Springs', 'Irvington'],
    },
    {
      label: 'Fremont high schools',
      difficulty: 3,
      items: ['American', 'Washington', 'Kennedy', 'Mission San Jose'],
    },
  ],
}

// ── III. THEN & NOW ──────────────────────────────────────────
export const thenNowPuzzle = {
  id: 'thennow',
  scene: 'niles',
  place: 'Niles Boulevard, looking east toward the canyon',
  answerYear: 1915,
  options: [1898, 1915, 1927, 1943, 1961, 1978],
  maxGuesses: 3,
}

// ── IV. HIGHER OR LOWER ──────────────────────────────────────
export const higherLowerPuzzle = {
  id: 'higherlower',
  rounds: [
    {
      unit: 'feet above sea level',
      a: { name: 'Mission Peak', value: 2520 },
      b: { name: 'Monument Peak', value: 2594 },
    },
    {
      unit: 'acres',
      a: { name: 'Coyote Hills', value: 978 },
      b: { name: 'Central Park', value: 450 },
    },
    {
      unit: 'the year it opened',
      a: { name: 'Mission San José', value: 1797 },
      b: { name: 'The Fremont Assembly Plant', value: 1962 },
    },
    {
      unit: 'years it ran under that name',
      a: { name: 'NUMMI, 1984–2010', value: 26 },
      b: { name: 'GM Fremont Assembly, 1962–1982', value: 20 },
    },
    {
      unit: 'acres',
      a: { name: 'Central Park', value: 450 },
      b: { name: 'Lake Elizabeth', value: 83 },
    },
  ],
}

// ── V. THE WORD ──────────────────────────────────────────────
// The answer comes off the queue in words.js by day number, so every
// player in town gets the same word and a reload doesn't reroll it.
export const wordPuzzle = {
  id: 'wordgrid',
  answer: answerForDay(DAY_NUMBER),
  maxGuesses: 6,
}

export const PUZZLES = {
  zoom: zoomPuzzle,
  connections: connectionsPuzzle,
  thennow: thenNowPuzzle,
  higherlower: higherLowerPuzzle,
  wordgrid: wordPuzzle,
}

// Four graded marks. On screen these render as CSS boxes in the three
// state colours — the characters below exist only for the text put on
// the clipboard, where block glyphs are fine.
export const MARK = {
  hit:  '█',
  warm: '▓',
  cool: '▒',
  miss: '░',
}
