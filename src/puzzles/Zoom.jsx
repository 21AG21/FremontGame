import { useState } from 'react'
import { SCENES } from '../art/Scenes.jsx'
import { placeById } from '../data/town.js'
import { zoomPuzzle as P, DAY_KEY, MARK } from '../data/puzzles.js'
import { distanceMiles, bearingDegrees, compassFrom, formatDistance, warmth } from '../lib/geo.js'
import { saveResult, getRecord } from '../lib/storage.js'
import PlaceSearch from '../components/PlaceSearch.jsx'
import Result from '../components/Result.jsx'

const squareFor = (miles) => {
  const w = warmth(miles)
  if (w > 0.7) return MARK.warm
  if (w > 0.35) return MARK.cool
  return MARK.miss
}

export default function Zoom() {
  const answer = placeById(P.answerId)
  const Scene = SCENES[P.scene]

  const [guesses, setGuesses] = useState([])
  const [done, setDone] = useState(null) // null | 'won' | 'lost'
  const [stats, setStats] = useState(() => getRecord('zoom'))

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

  const replay = () => { setGuesses([]); setDone(null) }

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
          <Scene />
        </div>
        {!done && <span className="tag tag-right">{scale.toFixed(1)}×</span>}
      </div>

      {!done && <PlaceSearch onGuess={handleGuess} used={guesses.map((g) => g.place.id)} />}

      {done ? (
        <Result
          won={done === 'won'}
          title="Zoom"
          subtitle={answer.name}
          squares={squares || MARK.miss}
          stats={stats}
          onReplay={replay}
        />
      ) : guesses.length === 0 ? (
        <span className="caption">Five guesses. Each one zooms out.</span>
      ) : (
        <div className="guesses">
          <span className="caption">How far off you were</span>
          <ul className="guess-list">
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
