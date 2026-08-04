// Composes one plate out of a place's motifs.
//
// A hundred Zoom puzzles need a hundred drawings, and a hundred
// hand-drawn engravings is not a thing anyone is going to finish.
// So the drawing is assembled: town.js says what a place is made
// of, Parts.jsx knows how to draw each of those things, and this
// stacks them back to front on one 800×600 plate.
//
// The seed comes from the place id, so a place's drawing is the
// same every time and no two places come out identical.

import { PARTS, Plates, Sky, seededRandom, K, W } from './Parts.jsx'

const hashId = (id) => {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// `motifs` overrides what the place is made of, which is how Then & Now
// draws the same location in two eras: same seed, same layout, different
// parts. `variant` keeps the two plates' pattern ids apart.
export default function Engraving({ place, motifs: override, variant = '' }) {
  const motifs = override || place.motifs || ['ridge', 'shops', 'road']
  const p = `e-${place.id}${variant}`

  // Back to front. A motif list is written in the order the place
  // reads, not the order it draws — sorting by layer means town.js
  // can say "creek, canyon, tracks" without the creek burying the
  // canyon it runs through.
  const ordered = motifs
    .map((name, i) => ({ name, i, part: PARTS[name] }))
    .filter((m) => m.part)
    .sort((a, b) => a.part.layer - b.part.layer || a.i - b.i)

  const r = seededRandom(hashId(place.id))

  return (
    <svg viewBox="0 0 800 600" className="scene" preserveAspectRatio="xMidYMid slice">
      <Plates p={p} />
      <Sky p={p} />
      {ordered.map(({ name, part }) => (
        <g key={name}>{part.draw({ p, r, K, W })}</g>
      ))}
    </svg>
  )
}
