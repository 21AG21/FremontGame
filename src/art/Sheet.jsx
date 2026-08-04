// A contact sheet of every composed engraving, at localhost:5173/?sheet
//
// Authoring tool, not a screen anyone plays. Composing 106 drawings out
// of a shared parts library means a bad motif combination is invisible
// until someone happens to get that day's puzzle — this puts all of
// them on one page so you can see the broken one immediately.

import { ZOOM_POOL, focusFor, LEVELS } from '../data/zoom.js'
import Engraving from './Engraving.jsx'

export default function Sheet() {
  return (
    <div style={{ padding: 24, background: '#fff', color: '#0c2033', minHeight: '100vh' }}>
      <h1 style={{ font: "600 22px 'Work Sans', sans-serif", marginBottom: 4 }}>
        {ZOOM_POOL.length} plates
      </h1>
      <p style={{ font: "400 13px 'Work Sans', sans-serif", color: '#5b7794', marginBottom: 20 }}>
        Each one as it opens, then the whole plate. The crosshair is the zoom focus.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
        {ZOOM_POOL.map((place) => {
          const f = focusFor(place)
          return (
            <figure key={place.id} style={{ margin: 0 }}>
              <div
                style={{
                  position: 'relative',
                  height: 130,
                  overflow: 'hidden',
                  border: '1px solid rgba(4,55,100,.2)',
                  borderRadius: 10,
                  background: '#fff',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: `scale(${LEVELS[0]})`,
                    transformOrigin: `${f.x * 100}% ${f.y * 100}%`,
                  }}
                >
                  <Engraving place={place} />
                </div>
              </div>

              <div
                style={{
                  position: 'relative',
                  height: 130,
                  marginTop: 4,
                  overflow: 'hidden',
                  border: '1px solid rgba(4,55,100,.2)',
                  borderRadius: 10,
                  background: '#fff',
                }}
              >
                <Engraving place={place} />
                <span
                  style={{
                    position: 'absolute',
                    left: `${f.x * 100}%`,
                    top: `${f.y * 100}%`,
                    width: 11,
                    height: 11,
                    marginLeft: -6,
                    marginTop: -6,
                    borderRadius: '50%',
                    border: '2px solid #c8971b',
                  }}
                />
              </div>

              <figcaption style={{ font: "600 12px 'Work Sans', sans-serif", marginTop: 6 }}>
                {place.name}
                <span style={{ display: 'block', fontWeight: 400, color: '#5b7794' }}>
                  {(place.motifs || []).join(' · ')}
                </span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}
