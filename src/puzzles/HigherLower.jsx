import { useState } from 'react'
import { higherLowerPuzzle as P, DAY_KEY, MARK } from '../data/puzzles.js'
import { saveResult, getRecord } from '../lib/storage.js'
import Result from '../components/Result.jsx'

export default function HigherLower() {
  const [round, setRound] = useState(0)
  const [results, setResults] = useState([])
  const [reveal, setReveal] = useState(null) // { choice, correct }
  const [done, setDone] = useState(null)
  const [stats, setStats] = useState(() => getRecord('higherlower'))

  const r = P.rounds[round]

  const answer = (choice) => {
    if (reveal || done) return
    const isHigher = r.b.value > r.a.value
    const correct = (choice === 'higher') === isHigher
    setReveal({ choice, correct })

    setTimeout(() => {
      const next = [...results, correct]
      setResults(next)
      setReveal(null)

      if (round + 1 >= P.rounds.length) {
        const score = next.filter(Boolean).length
        const won = score >= 4
        setDone(won ? 'won' : 'lost')
        setStats(saveResult('higherlower', { won, guesses: score, dayKey: DAY_KEY }))
      } else {
        setRound(round + 1)
      }
    }, 1400)
  }

  const replay = () => { setRound(0); setResults([]); setReveal(null); setDone(null) }

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
      <div className="hl-progress">
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

      <div className="hl-card">
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
        <button className={'btn' + verdict('higher')} disabled={!!reveal} onClick={() => answer('higher')}>
          Higher
        </button>
        <button className={'btn' + verdict('lower')} disabled={!!reveal} onClick={() => answer('lower')}>
          Lower
        </button>
      </div>

      <span className="hl-than">than {r.a.value.toLocaleString()}</span>
    </div>
  )
}
