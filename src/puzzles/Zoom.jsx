import { useState, useEffect, useMemo } from 'react'
import Engraving from '../art/Engraving.jsx'
import { placeById } from '../data/town.js'
import { zoomPuzzle as P, DAY_KEY, MARK } from '../data/puzzles.js'
import {
  distanceMiles,
  bearingDegrees,
  compassFrom,
  formatDistance,
  warmth,
  warmthWord,
} from '../lib/geo.js'
import { saveResult, getRecord, loadState, saveState } from '../lib/storage.js'
import PlacePicker from '../components/PlacePicker.jsx'
import Result from '../components/Result.jsx'

const squareFor = (miles) => {
  const w = warmth(miles)
  if (w > 0.7) return MARK.warm
  if (w > 0.35) return MARK.cool
  return MARK.miss
}

export default function Zoom() {
  const answer = placeById(P.answerId)

  // Today's round is restored, so switching tabs to peek at another
  // game — or reloading — does not wipe five guesses.
  const saved = useMemo(() => loadState('zoom', DAY_KEY), [])
  const [guesses, setGuesses] = useState(saved?.guesses ?? [])
  const [done, setDone] = useState(saved?.done ?? null) // null | 'won' | 'lost'
  const [stats, setStats] = useState(() => getRecord('zoom'))

  useEffect(() => saveState('zoom', DAY_KEY, { guesses, done }), [guesses, done])

  const level = P.levels[Math.min(guesses.length, P.levels.length - 1)]
  const scale = done ? 1 : level

  const finish = (won, n) => {
    setDone(won ? 'won' : 'lost')
    setStats(saveResult('zoom', { won, guesses: n, dayKey: DAY_KEY }))
  }

  const handleGuess = (place) => {
    const correct = place.id === answer.id
    const miles = distanceMiles(place, answer)
    const bearing = bearingDegrees(place, answer)
    const next = [...guesses, { place, correct, miles, bearing }]
    setGuesses(next)

    if (correct) finish(true, next.length)
    else if (next.length >= P.maxGuesses) finish(false, next.length)
  }

  const replay = () => {
    setGuesses([])
    setDone(null)
  }

  const squares = guesses.map((g) => (g.correct ? MARK.hit : squareFor(g.miles))).join('')

  return (
    <div className="puzzle">
      <div className="plate">
        <div
          className="plate-inner"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: `${P.focus.x * 100}% ${P.focus.y * 100}%`,
          }}
        >
          <Engraving
            place={answer}
            alt={
              done
                ? `A line engraving of ${answer.name}.`
                : `A line engraving of somewhere in Fremont, magnified ${scale.toFixed(1)} times. Name the place.`
            }
          />
        </div>
        {!done && <span className="tag tag-right">{scale.toFixed(1)}×</span>}
      </div>

      {!done && <PlacePicker onGuess={handleGuess} used={guesses.map((g) => g.place.id)} />}

      {done ? (
        <Result
          game="zoom"
          won={done === 'won'}
          title="Zoom"
          subtitle={answer.name}
          squares={squares || MARK.miss}
          stats={stats}
          onReplay={replay}
        />
      ) : (
        <div className="guesses">
          {/* Everything you have left, shown before you spend any of it.
              This screen used to render nothing at all below the search
              box until the first guess landed, which left a third of a
              phone empty on the one game whose whole job is to look
              like something. The other four all show their budget up
              front — six rows, five pips, twelve tiles. */}
          <div
            className="progress"
            role="img"
            aria-label={`Guess ${Math.min(guesses.length + 1, P.maxGuesses)} of ${P.maxGuesses}.`}
          >
            {Array.from({ length: P.maxGuesses }, (_, i) => (
              <span
                key={i}
                className={
                  'pip' +
                  (i < guesses.length ? ' is-miss' : '') +
                  (i === guesses.length ? ' is-current' : '')
                }
              />
            ))}
          </div>

          {/* No caption. "Five guesses. Each one zooms out." sat directly
              under a five-pip counter and five empty slots, and above a
              magnification badge that ticks down every time you guess —
              four ways of saying the same thing, three of them silent. */}
          <ul className="guess-list" aria-live="polite">
            {guesses.map((g, i) => {
              const c = compassFrom(g.bearing)
              return (
                <li key={i}>
                  <div className={'guess' + (g.correct ? ' is-correct' : '')}>
                    <span className="guess-name">{g.place.name}</span>
                    {g.correct ? (
                      <span className="guess-meta">Correct</span>
                    ) : (
                      <span className="guess-meta">
                        <span className="guess-warmth">{warmthWord(g.miles)}</span>
                        <span
                          className="guess-arrow"
                          style={{ transform: `rotate(${g.bearing}deg)` }}
                          aria-hidden="true"
                        >
                          ↑
                        </span>
                        {formatDistance(g.miles)} {c.label}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
