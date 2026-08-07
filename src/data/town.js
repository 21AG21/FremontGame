// ─────────────────────────────────────────────────────────────
//  FREMONT, CALIFORNIA
//
//  Coordinates are close enough for the distance-and-bearing hints
//  to read true — right district, right side of the freeway, right
//  relation to everything else. If you want them exact, right-click
//  any spot in a map app and paste the real pair in.
//
//  `motifs` is what the place is made of, and it drives the Zoom
//  engraving: the composer in art/Engraving.jsx builds a drawing
//  out of these parts. Order matters, back of the scene to front.
//  See art/Parts.jsx for the vocabulary.
//
//  `district` groups the list for browsing and keeps the decoys
//  spread across town rather than clustered next to the answer.
//
//  `fame` is how nameable a place is, and it decides what can be the
//  ZOOM answer:
//    1  a six-year resident can name it unprompted
//    2  a long-term resident can
//    3  nobody can name it cold — decoy only, never the answer
//
//  Tier 3 exists because losing to an answer you could not have
//  produced with the whole picture visible is the moment people leave.
//  Those places stay in the picker, where they are useful wrong
//  guesses, and out of the answer queue, where they are just cruel.
// ─────────────────────────────────────────────────────────────

export const TOWN = {
  name: 'Fremont',
  state: 'California',
  // Incorporated 23 January 1956 out of five townships.
  founded: 1956,
  center: { lat: 37.5485, lng: -121.9886 },
}

import PLACES_DATA from './generated/places.js'
export const PLACES = PLACES_DATA

export const placeById = (id) => PLACES.find((p) => p.id === id)

export const PLACE_COUNT = PLACES.length

// ── the town, grouped the way you scroll it ──────────────────
//
// Zoom's picker is a native <select>, and 113 names in one wheel is a
// scroll with no landmarks in it. Nine named districts is how anyone
// who lives here already holds the town in their head, and it is the
// same shape as the distance-and-bearing hint the game gives back.
//
// Districts keep source order, which is curated — the five towns
// Fremont was made out of, the hills between them, then Ardenwood, then
// the two catch-alls. Alphabetical would file "Around town" second,
// ahead of Centerville and Niles.
const DISTRICTS = PLACES.reduce(
  (order, p) => (order.includes(p.district) ? order : [...order, p.district]),
  []
)

// Alphabetical inside each district. The flat list this replaced was
// shuffled off the day number for a specific reason: unshuffled it was
// in source order, and source order put the day's answer near the top.
// Sorting by name has no such tell.
const BY_DISTRICT = DISTRICTS.map((district) => [
  district,
  PLACES.filter((p) => p.district === district).sort((a, b) => a.name.localeCompare(b.name)),
])

// Already-guessed places come out, and a district that empties out goes
// with them rather than leaving a heading over nothing.
//
// That last clause cannot be reached by playing: the smallest district
// holds six places and the game allows five guesses. Change either
// number and it is live code, which is what its test is for.
export const placeGroups = (used = []) =>
  BY_DISTRICT.map(([district, places]) => [
    district,
    places.filter((p) => !used.includes(p.id)),
  ]).filter(([, places]) => places.length > 0)
