import { DAY_NUMBER } from '../data/puzzles.js'
import { tidbitFor } from '../data/tidbits.js'

// One thing about the town, under the result.
//
// This sits where the sponsor used to. That is not an accident of
// layout — it is the same slot doing the opposite job. The spot under a
// finished board is the most attention this page ever gets, and giving
// it back to the reader is a better use of it than selling it was.
//
// The source line stays. It is small and most people will not read it,
// but a site that tells you things about where you live should be able
// to say where it got them, and the row cannot exist without one — the
// validator in scripts/content-build.mjs rejects a fact with no source.
export default function Tidbit({ game }) {
  const fact = tidbitFor(DAY_NUMBER, game)
  if (!fact) return null

  return (
    <aside className="tidbit">
      <p className="tidbit-tag">One more thing about Fremont</p>
      <p className="tidbit-text">{fact.text}</p>
      <p className="tidbit-source">{fact.source}</p>
    </aside>
  )
}
