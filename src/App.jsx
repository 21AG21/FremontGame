import { useState, useEffect, useRef, useCallback } from 'react'
import { TOWN } from './data/town.js'
import { PUZZLE_TYPES, DAY_KEY } from './data/puzzles.js'
import { dayHasTurned } from './lib/day.js'
import { getRecord } from './lib/storage.js'
import { readTheme, applyTheme } from './lib/theme.js'
import { Ridge, ICONS, ThemeIcon } from './art/Mark.jsx'
import GlassDefs from './art/Glass.jsx'
import HowTo from './components/HowTo.jsx'
import Zoom from './puzzles/Zoom.jsx'
import Connections from './puzzles/Connections.jsx'
import ThenNow from './puzzles/ThenNow.jsx'
import HigherLower from './puzzles/HigherLower.jsx'
import WordGrid from './puzzles/WordGrid.jsx'

const VIEWS = {
  zoom: Zoom,
  connections: Connections,
  thennow: ThenNow,
  higherlower: HigherLower,
  wordgrid: WordGrid,
}

const N = PUZZLE_TYPES.length

export default function App() {
  const [active, setActive] = useState('zoom')
  const [theme, setTheme] = useState(readTheme)
  const View = VIEWS[active]
  const type = PUZZLE_TYPES.find((t) => t.id === active)

  // DAY_KEY and DAY_NUMBER are captured at import, so a phone left open
  // overnight keeps serving yesterday's puzzles and filing results under
  // yesterday's key. Catch the turn when the tab comes back.
  useEffect(() => {
    const check = () => {
      if (document.visibilityState === 'visible' && dayHasTurned()) location.reload()
    }
    document.addEventListener('visibilitychange', check)
    const t = setInterval(check, 60000)
    return () => {
      document.removeEventListener('visibilitychange', check)
      clearInterval(t)
    }
  }, [])

  const flipTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }

  // ── the section bar, which you can slide across ────────────────
  //
  // The navy pill is one element that moves, rather than a background
  // that blinks from one button to another, and it follows your finger
  // while the finger is down. Everything below is what that costs.

  const bar = useRef(null)
  const drag = useRef(null)
  const [slide, setSlide] = useState(null)

  const activeIndex = PUZZLE_TYPES.findIndex((t) => t.id === active)
  // Which slot is lit. `?? ` and not `||`, because slot 0 is Zoom.
  const shown = slide ?? activeIndex

  // Fractions, not pixels. The sheet is inside `zoom: var(--z)`, so a
  // slot is a different number of CSS pixels on every desktop step —
  // but it is always a fifth of the bar.
  const slotAt = (clientX) => {
    const r = bar.current.getBoundingClientRect()
    const f = ((clientX - r.left) / r.width) * N
    return Math.max(0, Math.min(N - 1, Math.floor(f)))
  }

  // The specular highlight, written straight to the DOM. Through state
  // it would re-render the whole app on every pointer move.
  const sheen = (clientX) => {
    const el = bar.current
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${((clientX - r.left) / r.width) * 100}%`)
  }

  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    // Not captured yet. A tap has to stay an ordinary click on the
    // button under it, so the keyboard and assistive tech keep working
    // through the same handler everyone else uses.
    drag.current = { id: e.pointerId, x0: e.clientX, moved: false }
    sheen(e.clientX)
  }

  const onMove = (e) => {
    sheen(e.clientX)
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    if (!d.moved) {
      if (Math.abs(e.clientX - d.x0) < 8) return
      d.moved = true
      bar.current.setPointerCapture(e.pointerId)
    }
    setSlide(slotAt(e.clientX))
  }

  const onUp = (e) => {
    const d = drag.current
    drag.current = null
    setSlide(null)
    if (!d || !d.moved) return
    // Let go well clear of the bar and nothing happens. A control that
    // acts on the pointer going down needs a way to change your mind
    // before it goes up (WCAG 2.5.2); this is it.
    const r = bar.current.getBoundingClientRect()
    if (e.clientY > r.top - 72 && e.clientY < r.bottom + 72) {
      setActive(PUZZLE_TYPES[slotAt(e.clientX)].id)
    }
  }

  const onCancel = () => {
    drag.current = null
    setSlide(null)
  }

  const recentre = useCallback(() => {
    bar.current?.style.setProperty('--gx', '50%')
  }, [])

  return (
    <>
      <GlassDefs />
      <Ridge />

      <div className="sheet">
        {/* A two-column grid, not two stacked rows.

            Stacked, the wordmark's row was floored at 44px by the icon
            buttons in it while the wordmark itself is 31px tall — 13px
            of the header existed only to hold a touch target. Here the
            buttons span both rows, so the left column sets the height
            and the targets stay 44px. */}
        <header className="lockup">
          <h1 className="flag">{TOWN.name}</h1>

          <div className="chrome">
            <HowTo key={active} game={active} />
            <button
              className="theme"
              onClick={flipTheme}
              aria-label={
                theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'
              }
            >
              <ThemeIcon dark={theme === 'dark'} />
            </button>
          </div>

          {/* Just the section name. The line under it used to repeat
              what the board already says — "Five letters, six tries"
              over six rows of five, "Name the place, five guesses" over
              five guess slots and a five-pip counter. Every game states
              its own rules by being drawn; the ? has the rest. */}
          <p className="deck">
            <span className="deck-game">{type.name}</span>
          </p>
        </header>

        <main>
          <View key={active} />
        </main>

        <nav
          className={'index' + (slide === null ? '' : ' is-sliding')}
          aria-label="Puzzles"
          ref={bar}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onCancel}
          onPointerLeave={recentre}
        >
          {/* The refraction pass. Its own layer because Safari ignores
              url() inside backdrop-filter and drops the declaration —
              there, this element renders as nothing and the blur on the
              bar itself carries on unchanged. */}
          <span className="index-lens" aria-hidden="true" />

          <span className="index-pill" style={{ '--i': shown }} aria-hidden="true" />

          {PUZZLE_TYPES.map((t, i) => {
            const Icon = ICONS[t.id]
            const done = getRecord(t.id)?.lastPlayed === DAY_KEY
            return (
              <button
                key={t.id}
                className={
                  'index-item' + (i === shown ? ' is-active' : '') + (done ? ' is-done' : '')
                }
                aria-current={t.id === active ? 'page' : undefined}
                aria-label={done ? `${t.name} — played today` : t.name}
                onClick={() => setActive(t.id)}
              >
                <Icon />
                <span className="index-name">{t.short}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
