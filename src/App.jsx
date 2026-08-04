import { useState } from 'react'
import { TOWN } from './data/town.js'
import { PUZZLE_TYPES, DAY_KEY } from './data/puzzles.js'
import { getRecord } from './lib/storage.js'
import { Ridge, ICONS } from './art/Mark.jsx'
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

export default function App() {
  const [active, setActive] = useState('zoom')
  const View = VIEWS[active]
  const type = PUZZLE_TYPES.find((t) => t.id === active)

  return (
    <>
      <Ridge />

      <div className="sheet">
        <header className="lockup">
          <h1 className="flag">{TOWN.name}</h1>
          <span className="lockup-rule" aria-hidden="true" />
          <span className="prompt">{type.prompt}</span>
        </header>

        <main>
          <View key={active} />
        </main>

        <nav className="index" aria-label="Puzzles">
          {PUZZLE_TYPES.map((t) => {
            const Icon = ICONS[t.id]
            const done = getRecord(t.id)?.lastPlayed === DAY_KEY
            return (
              <button
                key={t.id}
                className={
                  'index-item' +
                  (t.id === active ? ' is-active' : '') +
                  (done ? ' is-done' : '')
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
