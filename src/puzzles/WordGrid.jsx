import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { wordPuzzle as P, DAY_KEY } from '../data/puzzles.js'
import { isWord } from '../data/words.js'
import { saveResult, getRecord, loadState, saveState } from '../lib/storage.js'
import Result from '../components/Result.jsx'

const LEN = 5
const ROWS = 'QWERTYUIOP,ASDFGHJKL,ZXCVBNM'.split(',')

// Standard two-pass scoring so double letters don't over-report as present.
function score(guess, answer) {
  const out = Array(LEN).fill('absent')
  const pool = answer.split('')

  for (let i = 0; i < LEN; i++) {
    if (guess[i] === pool[i]) { out[i] = 'correct'; pool[i] = null }
  }
  for (let i = 0; i < LEN; i++) {
    if (out[i] === 'correct') continue
    const j = pool.indexOf(guess[i])
    if (j > -1) { out[i] = 'present'; pool[j] = null }
  }
  return out
}

const SQUARE = { correct: '█', present: '▓', absent: '░' }

export default function WordGrid() {
  const saved = useMemo(() => loadState('wordgrid', DAY_KEY), [])
  const [rows, setRows] = useState(saved?.rows ?? [])
  const [current, setCurrent] = useState(saved?.current ?? '')
  const [notice, setNotice] = useState('')
  const [done, setDone] = useState(saved?.done ?? null)
  const [stats, setStats] = useState(() => getRecord('wordgrid'))

  useEffect(() => saveState('wordgrid', DAY_KEY, { rows, current, done }), [rows, current, done])
  const noticeTimer = useRef(null)

  const say = useCallback((msg) => {
    setNotice(msg)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(''), 1600)
  }, [])

  useEffect(() => () => clearTimeout(noticeTimer.current), [])

  const submit = useCallback(() => {
    if (current.length !== LEN) {
      if (current.length > 0) say('Five letters')
      return
    }
    // The guess list is the referee. Without it you can spell your way
    // to the answer with nonsense and the game stops being a game.
    if (!isWord(current)) {
      say(`${current} isn't in the word list`)
      return
    }

    setNotice('')
    const marks = score(current, P.answer)
    const next = [...rows, { word: current, marks }]
    setRows(next)
    setCurrent('')

    if (current === P.answer) {
      setDone('won')
      setStats(saveResult('wordgrid', { won: true, guesses: next.length, dayKey: DAY_KEY }))
    } else if (next.length >= P.maxGuesses) {
      setDone('lost')
      setStats(saveResult('wordgrid', { won: false, guesses: next.length, dayKey: DAY_KEY }))
    }
  }, [current, rows, say])

  const press = useCallback((k) => {
    if (done) return
    if (k === 'ENTER') submit()
    else if (k === 'BACK') { setNotice(''); setCurrent((c) => c.slice(0, -1)) }
    else if (/^[A-Z]$/.test(k)) { setNotice(''); setCurrent((c) => (c.length < LEN ? c + k : c)) }
  }, [done, submit])

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter') press('ENTER')
      else if (e.key === 'Backspace') press('BACK')
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  // Best-known state per letter, for keyboard colouring.
  const letterState = {}
  const rank = { absent: 0, present: 1, correct: 2 }
  rows.forEach(({ word, marks }) =>
    word.split('').forEach((ch, i) => {
      if (!letterState[ch] || rank[marks[i]] > rank[letterState[ch]]) letterState[ch] = marks[i]
    })
  )

  const grid = Array.from({ length: P.maxGuesses }, (_, r) => {
    if (rows[r]) return rows[r]
    if (r === rows.length) return { word: current.padEnd(LEN), marks: Array(LEN).fill('typing') }
    return { word: ' '.repeat(LEN), marks: Array(LEN).fill('empty') }
  })

  const squares = rows.map((r) => r.marks.map((m) => SQUARE[m]).join('')).join('\n')

  return (
    <div className="puzzle">
      <div className="wg-grid">
        {grid.map((row, r) => (
          <div key={r} className="wg-row">
            {row.word.split('').map((ch, c) => (
              <div key={c} className={`wg-cell is-${row.marks[c]}${ch.trim() ? ' has-letter' : ''}`}>
                {ch.trim()}
              </div>
            ))}
          </div>
        ))}
      </div>

      {notice && <p className="wg-notice" role="status">{notice}</p>}

      {done ? (
        <Result
          won={done === 'won'}
          title="The Word"
          subtitle={P.answer}
          squares={squares}
          stats={stats}
          onReplay={() => { setRows([]); setCurrent(''); setNotice(''); setDone(null) }}
        />
      ) : (
        <div className="wg-keys">
          {/* Three lettered rows, exactly as drawn: ten, nine inset, seven
              inset further. The action keys go on a fourth row of their
              own rather than squeezing these. */}
          {ROWS.map((r, i) => (
            <div key={i} className="wg-keyrow">
              {r.split('').map((k) => (
                <button
                  key={k}
                  className={'wg-key' + (letterState[k] ? ` is-${letterState[k]}` : '')}
                  onClick={() => press(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
          <div className="wg-keyrow wg-keyrow-actions">
            <button className="wg-key" aria-label="Delete" onClick={() => press('BACK')}>
              Delete
            </button>
            <button className="wg-key" onClick={() => press('ENTER')}>
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
