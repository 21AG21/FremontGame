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

// One source of truth for what day it is — see lib/day.js for why this
// is a separate module and not two expressions here.
import { DAY_KEY, DAY_NUMBER } from '../lib/day.js'
export { DAY_KEY, DAY_NUMBER }

// `short` is what fits in a fifth of the section bar; `name` is the
// section head under the wordmark; `prompt` is the deck beside it.
//
// The prompt used to restate the name — "Higher or Lower · Higher or
// lower?", "Groups · Find the groups" — which wastes the one line the
// game has to explain itself. Every prompt now says what you do and
// what it costs you, so name and deck carry different information.
export const PUZZLE_TYPES = [
  { id: 'zoom', name: 'Zoom', short: 'Zoom', prompt: 'Name the place, five guesses' },
  { id: 'connections', name: 'Groups', short: 'Groups', prompt: 'Three groups of four' },
  { id: 'thennow', name: 'Then & Now', short: 'Then/Now', prompt: 'Pick the year, three guesses' },
  {
    id: 'higherlower',
    name: 'Higher or Lower',
    short: 'Higher?',
    prompt: 'Five rounds, four to win',
  },
  { id: 'wordgrid', name: 'The Word', short: 'Word', prompt: 'Five letters, six tries' },
]

// ── I. ZOOM ──────────────────────────────────────────────────
export const zoomPuzzle = zoomForDay(DAY_NUMBER)

// ── II. GROUPS ───────────────────────────────────────────────
// The trap is that items repeat across the pool — Mission San Jose
// is a township AND a high school AND a mission. groupsForDay makes
// sure two groups that share a tile never land on the same board.
export const connectionsPuzzle = {
  id: 'connections',
  // Three. With three groups on the board the last one is always free,
  // so this is really "find two categories" — but a guess is now four
  // tiles out of twelve, which is 495 combinations rather than the 220
  // that three-of-twelve gave you. Blind play went from unlikely to
  // essentially impossible, which pays for the free third group.
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
  hit: '█',
  warm: '▓',
  cool: '▒',
  miss: '░',
}
