import { describe, it, expect } from 'vitest'
import { score } from './score.js'

// Shorthand so an expectation reads the way the row looks on screen.
const s = (guess, answer) =>
  score(guess, answer)
    .map((m) => ({ correct: 'G', present: 'Y', absent: '.' })[m])
    .join('')

describe('score', () => {
  it('marks an exact match all green', () => {
    expect(s('NILES', 'NILES')).toBe('GGGGG')
  })

  it('marks a guess sharing no letters all grey', () => {
    expect(s('QUICK', 'ADOBE')).toBe('.....')
  })

  it('marks letters in the wrong place yellow', () => {
    // PEARS: A and R are already home, the other three are shuffled.
    expect(s('SPARE', 'PEARS')).toBe('YYGGY')
  })

  // Everything below is a case single-pass scoring gets wrong. It is the
  // classic bug in clones of this game and it stays invisible until
  // somebody guesses a repeated letter.
  describe('repeated letters', () => {
    it('greys the spare copy once the answer letter is spent on a green', () => {
      // ADOBE has one E, and the guess's last E is sitting on it.
      // The other two Es have nothing left to claim.
      expect(s('EERIE', 'ADOBE')).toBe('....G')
    })

    it('gives the yellow to the first copy when neither is in place', () => {
      // Again one E in ADOBE. The E at 0 takes it; the E at 3 greys.
      expect(s('EAGER', 'ADOBE')).toBe('YY...')
    })

    it('colours both copies when the answer really has two', () => {
      // ELDER has two Es and a D; SEEDS earns a yellow for each.
      expect(s('SEEDS', 'ELDER')).toBe('.YYY.')
    })

    it('runs out when the guess has more copies than the answer', () => {
      // Three S in the guess, two in ASSAY. Two go green, the third greys.
      expect(s('SSSAA', 'ASSAY')).toBe('.GGGY')
    })
  })

  it('returns five marks, each one of the three states', () => {
    const marks = score('ADOBE', 'NILES')
    expect(marks).toHaveLength(5)
    for (const m of marks) expect(['correct', 'present', 'absent']).toContain(m)
  })

  // A green is worth more than a yellow, so the count of coloured cells
  // can never exceed how many of that letter the answer actually holds.
  it('never colours more copies of a letter than the answer has', () => {
    const words = ['ADOBE', 'NILES', 'ELDER', 'ASSAY', 'EERIE', 'SEEDS', 'SPARE', 'LOCAL']
    for (const answer of words) {
      for (const guess of words) {
        const marks = score(guess, answer)
        const counted = {}
        marks.forEach((m, i) => {
          if (m !== 'absent') counted[guess[i]] = (counted[guess[i]] || 0) + 1
        })
        for (const [letter, n] of Object.entries(counted)) {
          const held = answer.split('').filter((c) => c === letter).length
          expect(n, `${guess} vs ${answer}: ${letter}`).toBeLessThanOrEqual(held)
        }
      }
    }
  })
})
