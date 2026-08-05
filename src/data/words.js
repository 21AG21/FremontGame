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

// Both lists come from content/words.csv — see scripts/content-build.mjs.
// A row with `local` set is one of Fremont's own proper nouns: the Wordle
// list is common English, so it has none of them, and an answer you
// cannot type is not a puzzle. The build refuses any other answer that
// isn't in the published guess list.
import WORDS from './generated/words.js'

export const LOCAL_WORDS = WORDS.localWords

const VALID = new Set(
  raw
    .split('\n')
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length === 5)
    .concat(LOCAL_WORDS)
)

export const isWord = (w) => VALID.has(String(w).toUpperCase())

// The answer queue, in sheet order — so the row order in words.csv is
// the order the town sees them in.
const CANDIDATES = WORDS.candidates

// A word is unfair if too many valid words differ from it in one
// position: once you know four of five letters, each further guess
// eliminates exactly one candidate and six guesses are not enough.
// HILLS lost from every standard opener — _ILLS has nineteen members.
// This is a filter rather than a hand-edited list so that adding a new
// answer cannot quietly reintroduce the problem.
const MAX_FAMILY = 6

function largestFamily(word) {
  let worst = 0
  for (let i = 0; i < 5; i++) {
    let n = 0
    for (const w of VALID) {
      if (w.length !== 5 || w === word) continue
      let diff = 0
      for (let j = 0; j < 5; j++) if (w[j] !== word[j]) diff++
      if (diff === 1 && w[i] !== word[i]) n++
    }
    worst = Math.max(worst, n)
  }
  return worst
}

export const ANSWERS = CANDIDATES.filter((w) => largestFamily(w) <= MAX_FAMILY)

export const REJECTED_ANSWERS = CANDIDATES.filter((w) => largestFamily(w) > MAX_FAMILY)

// Day-indexed, not random: everybody in town has to get the same word,
// and it has to be the same word when you reload.
export const answerForDay = (n) => ANSWERS[((n % ANSWERS.length) + ANSWERS.length) % ANSWERS.length]
