import { useState, useRef } from 'react'
import Engraving from '../art/Engraving.jsx'
import { placeById } from '../data/town.js'
import { thenNowPuzzle as P, DAY_KEY, MARK } from '../data/puzzles.js'
import { saveResult, getRecord } from '../lib/storage.js'
import Result from '../components/Result.jsx'

export default function ThenNow() {
  const place = placeById(P.scene.placeId)
  const [wipe, setWipe] = useState(50)
  const [guesses, setGuesses] = useState([])
  const [done, setDone] = useState(null)
  const [stats, setStats] = useState(() => getRecord('thennow'))
  const dragging = useRef(false)
  const frame = useRef(null)

  const finish = (won, n) => {
    setDone(won ? 'won' : 'lost')
    setStats(saveResult('thennow', { won, guesses: n, dayKey: DAY_KEY }))
  }

  const guess = (year) => {
    if (done || guesses.some((g) => g.year === year)) return
    const diff = year - P.answerYear
    const next = [...guesses, { year, diff }]
    setGuesses(next)
    if (diff === 0) finish(true, next.length)
    else if (next.length >= P.maxGuesses) finish(false, next.length)
  }

  const moveTo = (clientX) => {
    if (!frame.current) return
    const r = frame.current.getBoundingClientRect()
    setWipe(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }

  const squares = guesses
    .map((g) => (g.diff === 0 ? MARK.hit : Math.abs(g.diff) <= 15 ? MARK.warm : MARK.miss))
    .join('')

  return (
    <div className="puzzle">
      <div
        className="plate wipe"
        ref={frame}
        role="slider"
        tabIndex={0}
        aria-label="Wipe between the old photograph and today"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(wipe)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); setWipe((w) => Math.max(0, w - 4)) }
          else if (e.key === 'ArrowRight') { e.preventDefault(); setWipe((w) => Math.min(100, w + 4)) }
          else if (e.key === 'Home') { e.preventDefault(); setWipe(0) }
          else if (e.key === 'End') { e.preventDefault(); setWipe(100) }
        }}
        onClick={(e) => moveTo(e.clientX)}
        onMouseDown={(e) => { dragging.current = true; moveTo(e.clientX) }}
        onMouseMove={(e) => dragging.current && moveTo(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={(e) => moveTo(e.touches[0].clientX)}
        onTouchMove={(e) => moveTo(e.touches[0].clientX)}
      >
        <div className="wipe-layer">
          <Engraving place={place} motifs={P.scene.now} variant="-now" />
        </div>
        <div className="wipe-layer wipe-top" style={{ clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>
          <Engraving place={place} motifs={P.scene.then} variant="-then" />
        </div>

        <div className="wipe-seam" style={{ left: `${wipe}%` }} />
        <div className="wipe-handle" style={{ left: `${wipe}%` }}>
          <span aria-hidden="true">⇄</span>
        </div>

        <span className="tag tag-left">{done ? P.answerYear : 'Then'}</span>
        <span className="tag tag-right">Today</span>
      </div>

      <p className="quote">“{P.place}.”</p>

      {done ? (
        <Result
          won={done === 'won'}
          title="Then &amp; Now"
          subtitle={String(P.answerYear)}
          squares={squares || MARK.miss}
          stats={stats}
          onReplay={() => { setGuesses([]); setDone(null); setWipe(50) }}
        />
      ) : (
        <>
          <span className="caption">Pick the year this was taken</span>
          {/* the row stays after the round ends — the years you tried are
              the record of how you got there */}
          <div className="year-grid">
            {P.options.map((y) => {
              const g = guesses.find((x) => x.year === y)
              const hit = g && g.diff === 0
              return (
                <button
                  key={y}
                  className={'tile' + (hit ? ' is-selected' : g ? ' is-spent' : '')}
                  disabled={!!g}
                  onClick={() => guess(y)}
                >
                  {y}
                  {g && !hit && (
                    <span className="year-hint">{g.diff < 0 ? 'later ↑' : 'earlier ↓'}</span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
