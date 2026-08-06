// How close a rejected Groups guess was.
//
// Its own module because the board is the one thing on the site that
// tells you something *about* your wrong answer, and a sentence that
// confidently says "One away" when you were nowhere near is worse than
// saying nothing at all. In here it can be tested against real boards;
// inside the component it could only be read and hoped about.

import { ITEMS_PER_GROUP as PER } from '../data/groups.js'

// Four tiles off a three-group board can only split 2+2 or 3+1, so the
// answer is always one of these. "Two away" is worth saying as well as
// "one away": it tells you the guess was two separate ideas rather than
// a near miss, which is a different thing to go and fix.
export const AWAY = ['', 'One away', 'Two away']

// How many tiles you would have to swap out. Counts the selection by
// group and takes the biggest block — three from one group is one away.
export function awayFrom(picks, groupOf) {
  const counts = new Map()
  for (const item of picks) {
    const g = groupOf(item)
    counts.set(g, (counts.get(g) || 0) + 1)
  }
  return PER - Math.max(...counts.values())
}
