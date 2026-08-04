import { useState, useMemo, useEffect } from 'react'
import { connectionsPuzzle as P, DAY_KEY } from '../data/puzzles.js'
import { ITEMS_PER_GROUP as PER } from '../data/groups.js'
import { saveResult, getRecord, loadState, saveState } from '../lib/storage.js'
import Result from '../components/Result.jsx'

// Easiest group to hardest — the share card has to say which group each
// guess landed in, or it carries no information at all.
const DIFFICULTY_SQUARE = ['░', '▒', '▓', '█']

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
  const [rows, setRows] = useState(saved?.rows ?? []) // share-card rows, in guess order
  const [done, setDone] = useState(saved?.done ?? null)
  const [stats, setStats] = useState(() => getRecord('connections'))

  useEffect(
    () => saveState('connections', DAY_KEY, { tiles, selected, solved, mistakes, rows, done }),
    [tiles, selected, solved, mistakes, rows, done]
  )

  const groupOf = (item) => P.groups.find((g) => g.items.includes(item))

  const toggle = (item) => {
    if (done) return
    setRejected([])
    setSelected((s) =>
      s.includes(item) ? s.filter((x) => x !== item) : s.length < PER ? [...s, item] : s
    )
  }

  const finish = (won, n) => {
    setDone(won ? 'won' : 'lost')
    setStats(saveResult('connections', { won, guesses: n, dayKey: DAY_KEY }))
  }

  const submit = () => {
    if (selected.length !== PER) return

    const row = selected.map((i) => DIFFICULTY_SQUARE[groupOf(i).difficulty]).join('')
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
      setSelected([])
      if (m >= P.maxMistakes) {
        setSolved(P.groups)
        setTiles([])
        finish(false, nextRows.length)
      }
    }
  }

  const replay = () => {
    setTiles(shuffle(allItems)); setSelected([]); setSolved([])
    setMistakes(0); setRows([]); setRejected([]); setDone(null)
  }

  return (
    <div className="puzzle">
      {solved.length > 0 && (
        <div className="bands" aria-live="polite">
          {solved.map((g) => (
            <div key={g.label} className="band">
              <span className="band-label">{g.label}</span>
              <span className="band-items">{g.items.join(' · ')}</span>
            </div>
          ))}
        </div>
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
          subtitle={done === 'won' ? 'All four groups' : 'Out of mistakes'}
          squares={rows.join('\n')}
          stats={stats}
          onReplay={replay}
        />
      ) : (
        <div className="conn-bar">
          <div className="mistakes" aria-label={`${P.maxMistakes - mistakes} mistakes left`}>
            {Array.from({ length: P.maxMistakes }).map((_, i) => (
              <span key={i} className={'dot' + (i < mistakes ? ' is-spent' : '')} />
            ))}
          </div>
          <button className="btn btn-primary" disabled={selected.length !== PER} onClick={submit}>
            Submit
          </button>
        </div>
      )}
    </div>
  )
}
