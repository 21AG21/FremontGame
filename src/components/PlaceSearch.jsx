import { useState, useRef, useEffect, useMemo } from 'react'
import { PLACES } from '../data/town.js'
import { DAY_NUMBER } from '../lib/day.js'

// The unfiltered list is a browse, not a hint — taking PLACES in source
// order would put the answer at the top of it.
//
// Shuffled off the day number rather than Math.random. A random shuffle
// is impure, and React is allowed to throw a useMemo away and recompute
// it: the browse list would then reorder itself under the player's
// thumb mid-scroll. Seeding on the day keeps it fixed for the whole
// session, and has the side effect that everyone in town browses the
// same order, so a screenshot of the list means the same thing to
// whoever it is sent to.
const BROWSE_ORDER = (() => {
  const a = [...PLACES]
  let s = DAY_NUMBER * 2654435761 + 1
  const next = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
})()

// Four, not six.
//
// The list opens upward, over the engraving, because on a phone
// everything below the input is under the keyboard. That makes its
// height a budget rather than a preference: six rows covered the
// drawing completely, so the one thing the game asks you to look at
// was hidden for exactly as long as you were answering it.
const MAX_MATCHES = 4

const LIST_ID = 'place-matches'

// Autocomplete over the town's place list. Typing is free-form but you can
// only submit a real place — kills spelling arguments, and browsing the list
// is half the fun for people who think they know the town.
export default function PlaceSearch({ onGuess, disabled, used = [] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const boxRef = useRef(null)
  const listRef = useRef(null)
  const browseOrder = BROWSE_ORDER

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = browseOrder.filter((p) => !used.includes(p.id))
    if (!q) return pool.slice(0, MAX_MATCHES)
    // rank by where the match falls, not by position in the source array —
    // otherwise whichever place happens to be first in town.js leads every
    // query, answer included
    return pool
      .map((p) => ({ p, at: p.name.toLowerCase().indexOf(q) }))
      .filter((m) => m.at > -1)
      .sort((a, b) => a.at - b.at || a.p.name.length - b.p.name.length)
      .slice(0, MAX_MATCHES)
      .map((m) => m.p)
  }, [query, used, browseOrder])

  // Best match nearest the input, worst furthest away.
  //
  // The panel is pinned to the top of the input and grows upward, so a
  // list that shrinks as you type drags every row down with it. Measured
  // on an iPhone: typing "ssion h" after "mi" moved the highlighted row
  // 280px down the screen — out from under the thumb that was already
  // reaching for it, and onto whatever had just slid into its place.
  //
  // Ordering worst-to-best pins the rows worth tapping against the input
  // and drops the weak ones off the far end, where nothing is aiming. The
  // rank travels with each row so the arrow keys and the share of the
  // list a screen reader announces still count from the best match.
  const rows = useMemo(() => matches.map((p, rank) => ({ p, rank })).reverse(), [matches])

  const noMatch = query.trim() !== '' && matches.length === 0
  const listOpen = open && !disabled && (matches.length > 0 || noMatch)

  // Put the highlight back on the top match whenever the query changes.
  // Adjusted during render rather than in an effect: an effect renders
  // one frame with the old highlight on a list that has already been
  // replaced, which is how you end up arrowing into whatever used to be
  // in that slot.
  const [lastQuery, setLastQuery] = useState(query)
  if (query !== lastQuery) {
    setLastQuery(query)
    setCursor(0)
  }

  // Bottom of the list is the best match. If the ceiling in the
  // stylesheet ever bites — a short landscape phone — an unpinned list
  // would open showing the four worst rows with the good one below the
  // fold. No-op whenever everything fits, which is nearly always.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [rows])

  useEffect(() => {
    const away = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [])

  const submit = (place) => {
    if (!place || disabled) return
    onGuess(place)
    setQuery('')
    setOpen(false)
  }

  // cursor counts from the best match, which now sits at the bottom of
  // the list — so Down walks toward it and Up walks away. Inverted
  // against the array, upright against the screen, which is the one that
  // has to be right.
  const onKey = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, matches.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submit(matches[cursor])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="search" ref={boxRef}>
      <input
        className="search-input"
        value={query}
        placeholder={disabled ? 'Round over' : 'Type a place name'}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        autoComplete="off"
        // Place names are not dictionary words. Left on, iOS quietly
        // rewrites "Niles" to "Miles" and "Ardenwood" to whatever it
        // likes best, and the list stops matching what you meant to
        // type. Capitals stay on, because every name in the pool has
        // them and the typed text should look like the row it finds.
        autoCorrect="off"
        autoCapitalize="words"
        spellCheck={false}
        enterKeyHint="go"
        role="combobox"
        aria-expanded={listOpen}
        aria-controls={LIST_ID}
        aria-autocomplete="list"
        aria-activedescendant={
          listOpen && !noMatch && matches[cursor] ? `place-${matches[cursor].id}` : undefined
        }
      />
      {listOpen &&
        (noMatch ? (
          <div className="search-list" id={LIST_ID}>
            <p className="search-empty">No place by that name.</p>
          </div>
        ) : (
          <ul
            className="search-list"
            id={LIST_ID}
            ref={listRef}
            role="listbox"
            aria-label="Matching places"
          >
            {rows.map(({ p, rank }) => (
              <li key={p.id} role="presentation">
                <button
                  type="button"
                  id={`place-${p.id}`}
                  role="option"
                  aria-selected={rank === cursor}
                  className={'search-item' + (rank === cursor ? ' is-cursor' : '')}
                  onMouseEnter={() => setCursor(rank)}
                  onClick={() => submit(p)}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
