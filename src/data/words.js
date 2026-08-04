// ─────────────────────────────────────────────────────────────
//  The word list.
//
//  valid-wordle-words.txt is the published Wordle guess list — 14,855
//  five-letter words. It decides what you are ALLOWED to type, which
//  is a different job from deciding the answer: a guess list that is
//  too tight makes the game feel broken ("that IS a word"), and one
//  that is too loose lets people brute-force with garbage.
//
//  Imported ?raw so the 89 KB stays a string Vite serves as-is rather
//  than 14,855 JS string literals the parser has to walk.
// ─────────────────────────────────────────────────────────────

import raw from './valid-wordle-words.txt?raw'

// Fremont's own proper nouns. The Wordle list is common English, so it
// has none of these — and an answer you cannot type is not a puzzle.
export const LOCAL_WORDS = [
  'NILES', // the township, and the film studio
  'TESLA', // what the plant builds now
  'NUMMI', // what it was between GM and Tesla
  'ARDEN', // Ardenwood, shortened the way locals say it
]

const VALID = new Set(
  raw
    .split('\n')
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length === 5)
    .concat(LOCAL_WORDS)
)

export const isWord = (w) => VALID.has(String(w).toUpperCase())

// The answer queue. Every entry is either in the Wordle list or in
// LOCAL_WORDS above, so the answer is always typeable. Ordered so the
// obvious ones aren't all in the first week.
export const ANSWERS = [
  'NILES', 'ADOBE', 'CREEK', 'TESLA', 'MARSH',
  'DEPOT', 'HILLS', 'CIVIC', 'FILMS', 'TRAIL',
  'ARDEN', 'PLANT', 'HERON', 'LEVEE', 'GROVE',
  'RANCH', 'BELLS', 'STEAM', 'RAILS', 'EGRET',
  'NUMMI', 'TULES', 'WAGON', 'TOWER',
]

// Day-indexed, not random: everybody in town has to get the same word,
// and it has to be the same word when you reload.
export const answerForDay = (n) => ANSWERS[((n % ANSWERS.length) + ANSWERS.length) % ANSWERS.length]
