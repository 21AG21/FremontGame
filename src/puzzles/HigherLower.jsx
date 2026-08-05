import { useState, useEffect, useRef, useMemo } from 'react'
import { higherLowerPuzzle as P, DAY_KEY, MARK } from '../data/puzzles.js'
import { saveResult, getRecord, loadState, saveState } from '../lib/storage.js'
import Result from '../components/Result.jsx'

export default function HigherLower() {
  const saved = useMemo(() => loadState('higherlower', DAY_KEY), [])
  const [round, setRound] = useState(saved?.round ?? 0)
  const [results, setResults] = useState(saved?.results ?? [])
  const [reveal, setReveal] = useState(null) // { choice, correct }
  const [done, setDone] = useState(saved?.done ?? null)
  const [stats, setStats] = useState(() => getRecord('higherlower'))
  const timer = useRef(null)

  useEffect(
    () => saveState('higherlower', DAY_KEY, { round, results, done }),
    [round, results, done]
  )

  // The reveal timer outlived the component, firing setState into a
  // unmounted tree every time you switched tabs mid-round.
  useEffect(() => () => clearTimeout(timer.current), [])

  const r = P.rounds[round]

  const answer = (choice) => {
    if (reveal || done) return
    const isHigher = r.b.value > r.a.value
    const correct = (choice === 'higher') === isHigher
    setReveal({ choice, correct })

    timer.current = setTimeout(() => {
      const next = [...results, correct]
      setResults(next)
      setReveal(null)

      if (round + 1 >= P.rounds.length) {
        const score = next.filter(Boolean).length
        const won = score >= P.toWin
        setDone(won ? 'won' : 'lost')
        setStats(saveResult('higherlower', { won, guesses: score, dayKey: DAY_KEY }))
      } else {
        setRound(round + 1)
      }
    }, 1400)
  }

  const replay = () => {
    setRound(0)
    setResults([])
    setReveal(null)
    setDone(null)
  }

  const score = results.filter(Boolean).length
  const squares = results.map((c) => (c ? MARK.hit : MARK.miss)).join('')

  if (done) {
    return (
      <div className="puzzle">
        <Result
          won={done === 'won'}
          title="Higher or Lower"
          subtitle={`${score} of ${P.rounds.length} right`}
          squares={squares}
          stats={stats}
          onReplay={replay}
        />
      </div>
    )
  }

  // Once the answer is out, the button you pressed says whether you were
  // right — that is the whole reveal, so nothing else needs to move.
  const verdict = (choice) => {
    if (!reveal || reveal.choice !== choice) return ''
    return reveal.correct ? ' is-right' : ' is-wrong'
  }

  return (
    <div className="puzzle">
      <div
        className="progress"
        role="img"
        aria-label={`Round ${round + 1} of ${P.rounds.length}. ${results.filter(Boolean).length} right so far.`}
      >
        {P.rounds.map((_, i) => (
          <span
            key={i}
            className={
              'pip' +
              (i < results.length ? (results[i] ? ' is-hit' : ' is-miss') : '') +
              (i === round ? ' is-current' : '')
            }
          />
        ))}
      </div>

      {/* Keyed on the round so React replaces the node rather than
          patching it. Without that the CSS entry animation runs once on
          mount and never again, and rounds two to five arrive with no
          indication that anything changed but the numbers. */}
      <div className="hl-card" key={round}>
        <div className="hl-half">
          <span className="hl-name">{r.a.name}</span>
          <b className="hl-value">{r.a.value.toLocaleString()}</b>
          <span className="hl-unit">{r.unit}</span>
        </div>

        <div className="hl-half">
          <span className="hl-name">{r.b.name}</span>
          <b className="hl-value">{reveal ? r.b.value.toLocaleString() : '???'}</b>
          <span className="hl-unit">{r.unit}</span>
        </div>
      </div>

      <div className="hl-buttons">
        <button
          className={'btn' + verdict('higher')}
          disabled={!!reveal}
          onClick={() => answer('higher')}
        >
          Higher
        </button>
        <button
          className={'btn' + verdict('lower')}
          disabled={!!reveal}
          onClick={() => answer('lower')}
        >
          Lower
        </button>
      </div>

      <span className="hl-than">
        than {r.a.value.toLocaleString()} · {results.filter(Boolean).length}/{P.toWin} right, round{' '}
        {round + 1} of {P.rounds.length}
      </span>
    </div>
  )
}
