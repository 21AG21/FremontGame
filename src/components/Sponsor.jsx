import { track } from '@vercel/analytics'
import { sponsorForDay } from '../data/sponsor.js'
import { DAY_KEY } from '../data/puzzles.js'

// The day's sponsor, under the result.
//
// Placed here rather than beside the board on purpose. Everything above
// this is the puzzle, and the puzzle's only claim is that what it tells
// you about Fremont is true — the moment paid copy sits inside that, the
// claim is worth less, and it is the whole product. Under the result it
// also costs the board no room, which the last week of work was mostly
// about, and it lands at the one moment a player is looking at the
// screen rather than at the tiles.
//
// Said plainly, in the word people know. "Partner" and "supported by"
// are what you write when you would rather the reader did not notice,
// and the FTC's position on that has been the same for years: the
// disclosure has to be one an ordinary person actually reads as an ad.
export default function Sponsor() {
  const sponsor = sponsorForDay(DAY_KEY)
  if (!sponsor) return null

  // What the business is paying for is people arriving, so it has to be
  // countable — a sponsor who cannot be told how many came will not buy
  // a second week. Wrapped, because a sponsor credit must never be able
  // to break the result panel it sits under.
  const clicked = () => {
    try {
      track('sponsor_click', { name: sponsor.name, day: DAY_KEY })
    } catch {
      /* blocked, offline, or analytics never loaded — the link still works */
    }
  }

  return (
    <aside className="sponsor">
      <p className="sponsor-tag">Today’s sponsor</p>
      <a
        className="sponsor-name"
        href={sponsor.url}
        target="_blank"
        // sponsored, because that is what it is: Google's own value for a
        // paid link, and leaving it off makes this a link we are quietly
        // passing ranking credit through in exchange for money.
        rel="sponsored noopener noreferrer"
        onClick={clicked}
      >
        {sponsor.name}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {sponsor.line && <p className="sponsor-line">{sponsor.line}</p>}
    </aside>
  )
}
