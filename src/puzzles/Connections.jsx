import { useState, useMemo, useEffect } from 'react'
import { connectionsPuzzle as P, DAY_KEY } from '../data/puzzles.js'
import { ITEMS_PER_GROUP as PER, RANK_NAMES } from '../data/groups.js'
import { saveResult, getRecord, loadState, saveState } from '../lib/storage.js'
import { awayFrom, AWAY } from '../lib/near.js'
import Result from '../components/Result.jsx'

// Easiest group to hardest — the share card has to say which group each
// guess landed in, or it carries no information at all.
//
// Keyed by board rank, not by pool tier. On a four-tier scale a board
// that drew tiers 0, 1, 3 shared as ░▒█ and one that drew 0, 2, 3 as
// ░▓█, so the same "easy, medium, hard" result printed two different
// pictures depending on the day. Three ranks, three glyphs, always.
const RANK_SQUARE = ['░', '▒', '█']

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Connections() {
  const allItems = useMemo(() => shuffle(P.groups.flatMap((g) => g.items)), [])

  const saved = useMemo(() => loadState('connections', DAY_KEY), [])
  const [tiles, setTiles] = useState(saved?.tiles ?? allItems)
  const [selected, setSelected] = useState(saved?.selected ?? [])
  const [solved, setSolved] = useState(saved?.solved ?? [])
  const [mistakes, setMistakes] = useState(saved?.mistakes ?? 0)
  // the quad that just failed, held until the next pick — with no
  // animation, this is what tells you the guess was rejected
  const [rejected, setRejected] = useState([])
  // how far off the last rejected guess was, held until the next pick
  const [away, setAway] = useState(null)
  // ranks whose category has been named out loud, cheapest first
  const [hints, setHints] = useState(saved?.hints ?? [])
  const [rows, setRows] = useState(saved?.rows ?? []) // share-card rows, in guess order
  const [done, setDone] = useState(saved?.done ?? null)
  const [stats, setStats] = useState(() => getRecord('connections'))

  useEffect(
    () =>
      saveState('connections', DAY_KEY, { tiles, selected, solved, mistakes, rows, done, hints }),
    [tiles, selected, solved, mistakes, rows, done, hints]
  )

  const groupOf = (item) => P.groups.find((g) => g.items.includes(item))

  const toggle = (item) => {
    if (done) return
    setRejected([])
    setAway(null)
    setSelected((s) =>
      s.includes(item) ? s.filter((x) => x !== item) : s.length < PER ? [...s, item] : s
    )
  }

  // Names a category without saying which tiles are in it. Knowing the
  // board hides "Hiding a bird" still leaves you twelve tiles to read,
  // so this is a way back in rather than an answer — which is the point
  // of offering it at all instead of letting someone stall out.
  //
  // Easiest unnamed group first, and never the last one: with three
  // groups, naming two leaves the third deducible, so a third hint would
  // be the whole board.
  const openGroups = P.groups.filter((g) => !solved.includes(g))
  const nextHint = openGroups.find((g) => !hints.includes(g.rank))
  const canHint = !done && nextHint && hints.length < P.groups.length - 1
  const takeHint = () => canHint && setHints((h) => [...h, nextHint.rank])

  // A hint shown for a group that has since been lifted out is just the
  // band saying the same thing twice.
  const shownHints = P.groups.filter((g) => hints.includes(g.rank) && !solved.includes(g))

  const finish = (won, n) => {
    setDone(won ? 'won' : 'lost')
    setStats(saveResult('connections', { won, guesses: n, dayKey: DAY_KEY }))
  }

  const submit = () => {
    if (selected.length !== PER) return

    const row = selected.map((i) => RANK_SQUARE[groupOf(i).rank]).join('')
    const nextRows = [...rows, row]
    setRows(nextRows)

    const first = groupOf(selected[0])
    const allSame = selected.every((i) => groupOf(i) === first)

    if (allSame) {
      const nextSolved = [...solved, first]
      setSolved(nextSolved)
      setTiles((t) => t.filter((x) => !first.items.includes(x)))
      setSelected([])
      if (nextSolved.length === P.groups.length) finish(true, nextRows.length)
    } else {
      const m = mistakes + 1
      setMistakes(m)
      setRejected(selected)
      setAway(awayFrom(selected, groupOf))
      setSelected([])
      if (m >= P.maxMistakes) {
        setSolved(P.groups)
        setTiles([])
        finish(false, nextRows.length)
      }
    }
  }

  const replay = () => {
    setTiles(shuffle(allItems))
    setSelected([])
    setSolved([])
    setMistakes(0)
    setRows([])
    setRejected([])
    setAway(null)
    setHints([])
    setDone(null)
  }

  return (
    <div className="puzzle">
      {solved.length > 0 && (
        <div className="bands" aria-live="polite">
          {/* By rank, not by the order you happened to solve them. The
              board is authored easy, medium, hard and reading it back in
              that order is what makes the grading legible — solve order
              is a fact about you, not about the puzzle. */}
          {[...solved]
            .sort((a, b) => a.rank - b.rank)
            .map((g) => (
              <div key={g.label} className="band">
                <span className="band-label">
                  {/* Pips as well as the word, and no colour coding at
                      all. Green already means solved here and navy means
                      selected, so a third scale in colour would have had
                      to fight both — and a difficulty scale carried by
                      hue alone fails WCAG 1.4.1 anyway. */}
                  <span className="band-rank" aria-hidden="true">
                    {RANK_SQUARE.map((_, i) => (
                      <span key={i} className={'band-pip' + (i <= g.rank ? ' is-lit' : '')} />
                    ))}
                  </span>
                  <span className="band-grade">{RANK_NAMES[g.rank]}</span>
                  <span className="band-name">{g.label}</span>
                </span>
                <span className="band-items">{g.items.join(' · ')}</span>
              </div>
            ))}
        </div>
      )}

      {shownHints.length > 0 && (
        <ul className="hints">
          {shownHints.map((g) => (
            <li key={g.label} className="hint">
              <span className="hint-tag">{RANK_NAMES[g.rank]}</span>
              {g.label}
            </li>
          ))}
        </ul>
      )}

      {tiles.length > 0 && (
        <div className="conn-grid">
          {tiles.map((item) => (
            <button
              key={item}
              className={
                'tile' +
                (selected.includes(item) ? ' is-selected' : '') +
                (rejected.includes(item) ? ' is-rejected' : '')
              }
              aria-pressed={selected.includes(item)}
              onClick={() => toggle(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {done ? (
        <Result
          won={done === 'won'}
          title="Groups"
          subtitle={done === 'won' ? 'All three groups' : 'Out of mistakes'}
          squares={rows.join('\n')}
          stats={stats}
          note={
            hints.length
              ? `With ${hints.length === 1 ? 'a hint' : `${hints.length} hints`}`
              : undefined
          }
          onReplay={replay}
        />
      ) : (
        <div className="conn-bar">
          <div className="mistakes" aria-label={`${P.maxMistakes - mistakes} mistakes left`}>
            {Array.from({ length: P.maxMistakes }).map((_, i) => (
              <span key={i} className={'dot' + (i < mistakes ? ' is-spent' : '')} />
            ))}
          </div>

          {/* Lives in the bar rather than above it, and the bar is
              always on screen, so saying "One away" cannot shove the
              grid down under the thumb that is already reaching for a
              tile. role=status announces it without stealing focus. */}
          <p className="conn-say" role="status">
            {away ? AWAY[away] : ''}
          </p>

          <div className="conn-actions">
            <button className="btn" disabled={!canHint} onClick={takeHint}>
              Hint
            </button>
            <button className="btn btn-primary" disabled={selected.length !== PER} onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
