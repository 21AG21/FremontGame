import { useState, useEffect, useRef } from 'react'
import { TOWN } from '../data/town.js'
import { DAY_NUMBER } from '../data/puzzles.js'

// Drawn as boxes, not glyphs: Work Sans has no block characters, and a
// fallback face for four of them would be four different shapes. The
// four grades take the state colours — sunk, navy, amber, green.
const MARK_CLASS = { '░': 'is-d1', '▒': 'is-d2', '▓': 'is-d3', '█': 'is-d4' }

export default function Result({ won, title, subtitle, squares, stats, note, onReplay }) {
  const [copied, setCopied] = useState(false)
  const box = useRef(null)

  // the panel renders below the fold on short viewports — go to it
  useEffect(() => {
    box.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  // `note` goes on the shared text as well as on screen. A board solved
  // with help and one solved cold produce the same squares, and quietly
  // sharing the first as the second is the kind of thing that makes a
  // daily's scores worthless to everybody.
  const shareText = [
    `${TOWN.name} No. ${DAY_NUMBER} — ${title}`,
    squares,
    note || '',
    typeof location !== 'undefined' ? location.host : '',
  ]
    .filter(Boolean)
    .join('\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareText
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={'result' + (won ? ' is-won' : ' is-lost')} ref={box}>
      <h3 className="result-answer">{subtitle}</h3>

      <div className="marks">
        {squares.split('\n').map((row, r) => (
          <div className="marks-row" key={r}>
            {[...row].map((ch, c) => (
              <span key={c} className={'mark ' + (MARK_CLASS[ch] || '')} />
            ))}
          </div>
        ))}
      </div>

      {note && <p className="result-note">{note}</p>}

      {stats && (
        <dl className="record">
          <div>
            <dt>Streak</dt>
            <dd>{stats.streak}</dd>
          </div>
          <div>
            <dt>Solved</dt>
            <dd>{stats.played ? Math.round((stats.wins / stats.played) * 100) : 0}%</dd>
          </div>
        </dl>
      )}

      <div className="result-actions">
        <button className="btn btn-primary" onClick={copy}>
          {copied ? 'Copied' : 'Copy result'}
        </button>
        <button className="btn" onClick={onReplay}>
          Play again
        </button>
      </div>
    </div>
  )
}
