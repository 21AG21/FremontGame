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

// Autocomplete over the town's place list. Typing is free-form but you can
// only submit a real place — kills spelling arguments, and browsing the list
// is half the fun for people who think they know the town.
export default function PlaceSearch({ onGuess, disabled, used = [] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(0)
  const boxRef = useRef(null)
  const browseOrder = BROWSE_ORDER

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = browseOrder.filter((p) => !used.includes(p.id))
    if (!q) return pool.slice(0, 6)
    // rank by where the match falls, not by position in the source array —
    // otherwise whichever place happens to be first in town.js leads every
    // query, answer included
    return pool
      .map((p) => ({ p, at: p.name.toLowerCase().indexOf(q) }))
      .filter((m) => m.at > -1)
      .sort((a, b) => a.at - b.at || a.p.name.length - b.p.name.length)
      .slice(0, 6)
      .map((m) => m.p)
  }, [query, used, browseOrder])

  const noMatch = query.trim() !== '' && matches.length === 0

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

  const onKey = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
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
      />
      {open && !disabled && (matches.length > 0 || noMatch) && (
        <ul className="search-list">
          {noMatch ? (
            <li>
              <p className="search-empty">No place by that name.</p>
            </li>
          ) : (
            matches.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={'search-item' + (i === cursor ? ' is-cursor' : '')}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => submit(p)}
                >
                  {p.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
