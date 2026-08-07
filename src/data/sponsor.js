// Who paid for today.
//
// Rows live in content/sponsors.csv; edit that and run `npm run content`.
// The validator there is what enforces real dates, http(s) links and no
// two bookings on one day — see scripts/content-build.mjs.
//
// This module is the other half of that promise: whatever reaches it,
// it returns a sponsor or it returns null, and it never throws. A board
// that fails to draw because a business bought a week and someone typed
// the date wrong is a worse outcome than a board with no sponsor on it,
// and the person who would find out is a player, not us.

import SPONSORS from './generated/sponsors.js'

const ISO = /^\d{4}-\d{2}-\d{2}$/

// ISO dates compare correctly as strings, so no Date objects and no
// timezone anywhere near this. Both ends inclusive: a business that buys
// the 10th to the 16th gets the 16th.
const covers = (s, dayKey) =>
  typeof s?.start === 'string' && typeof s?.end === 'string' && s.start <= dayKey && dayKey <= s.end

// Exported separately from the bound version so the tests can hand it
// deliberately broken rows — the real table is usually empty, which is
// exactly the case that proves least.
export function pickSponsor(list, dayKey) {
  if (!Array.isArray(list) || !ISO.test(dayKey ?? '')) return null

  const hit = list.find(
    (s) => covers(s, dayKey) && typeof s.name === 'string' && s.name.trim() !== '' && safeUrl(s.url)
  )
  if (!hit) return null

  return {
    name: hit.name.trim(),
    line: typeof hit.line === 'string' ? hit.line.trim() : '',
    url: hit.url,
  }
}

// Belt and braces against the validator. These files are generated, but
// they are also plain committed JavaScript that a person can hand-edit,
// and the cost of being wrong here is a script running in the player's
// page rather than a link going nowhere.
export function safeUrl(url) {
  if (typeof url !== 'string') return false
  try {
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export const sponsorForDay = (dayKey) => pickSponsor(SPONSORS, dayKey)
