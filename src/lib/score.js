// Wordle-style scoring, in its own file so a test can reach it.
//
// Two passes, and the order matters. Marking greens first and removing
// those letters from the pool is what stops a guess of SPEED against an
// answer of ERASE reporting both Es as present when only one is there.
// Single-pass scoring is the classic bug in every clone of this game and
// it is invisible until someone guesses a double letter.

const LEN = 5

export function score(guess, answer) {
  const out = Array(LEN).fill('absent')
  const pool = answer.split('')

  for (let i = 0; i < LEN; i++) {
    if (guess[i] === pool[i]) {
      out[i] = 'correct'
      pool[i] = null
    }
  }
  for (let i = 0; i < LEN; i++) {
    if (out[i] === 'correct') continue
    const j = pool.indexOf(guess[i])
    if (j > -1) {
      out[i] = 'present'
      pool[j] = null
    }
  }
  return out
}
