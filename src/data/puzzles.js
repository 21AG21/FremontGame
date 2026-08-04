// ─────────────────────────────────────────────────────────────
//  TODAY'S PUZZLES — Fremont, California. One per type.
//
//  Three of the five now come off a pool rather than being written
//  out once: Zoom draws from 106 places, Groups from 100 categories,
//  Higher or Lower from 136 facts. This file is the assembler — it
//  asks each pool for the day's puzzle and hands it to the view.
//
//  Every fact in those pools is real. That is the whole point: a
//  hyperlocal puzzle with invented facts is worse than no puzzle,
//  because the first person who knows better stops trusting it and
//  never comes back.
//
//  Then & Now draws both eras from the same composer, so a pair is
//  two motif lists and a date rather than two sourced photographs.
// ─────────────────────────────────────────────────────────────

import { answerForDay } from './words.js'
import { zoomForDay } from './zoom.js'
import { groupsForDay } from './groups.js'
import { roundsForDay } from './higherlower.js'
import { thenNowForDay } from './thennow.js'

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
export const zoomPuzzle = zoomForDay(DAY_NUMBER)

// ── II. GROUPS ───────────────────────────────────────────────
// The trap is that items repeat across the pool — Mission San Jose
// is a township AND a high school AND a mission. groupsForDay makes
// sure two groups that share a tile never land on the same board.
export const connectionsPuzzle = {
  id: 'connections',
  // Three, not four. With three-tile groups, four mistakes let you solve
  // the last two groups by elimination without knowing either category —
  // four separate reviewers rated the board 3/10 for exactly that.
  maxMistakes: 3,
  groups: groupsForDay(DAY_NUMBER),
}

// ── III. THEN & NOW ──────────────────────────────────────────
export const thenNowPuzzle = thenNowForDay(DAY_NUMBER)

// ── IV. HIGHER OR LOWER ──────────────────────────────────────
export const higherLowerPuzzle = {
  id: 'higherlower',
  rounds: roundsForDay(DAY_NUMBER),
  // Say the pass mark out loud. Without a fail state every player
  // "finishes", so the game reads as scoreless and nobody can tell a
  // good round from a bad one.
  toWin: 4,
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
