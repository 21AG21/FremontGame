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
//  Those places stay in the autocomplete, where they are useful wrong
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
