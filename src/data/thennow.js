// ─────────────────────────────────────────────────────────────
//  THEN & NOW — the pool.
//
//  Four separate reviewers called this the best game on the site and
//  it had exactly one puzzle in it. The blocker was always that a
//  then/now pair means two matched photographs per day, which is a
//  sourcing job. The engraving composer removes that: both sides are
//  drawn from motifs, so a pair is two motif lists and a date.
//
//  Fourteen entries, not a hundred. Every year below is one I could
//  stand behind — where I could not pin a date (when Lake Elizabeth
//  was dedicated, when the California Nursery moved to Niles) the
//  entry is not here. A wrong date in a history game is worse than a
//  short queue, because the person who catches it never comes back.
// ─────────────────────────────────────────────────────────────

export const SCENES = [
  {
    id: 'niles-essanay',
    placeId: 'niles-boulevard',
    caption: 'Niles Boulevard, looking east toward the canyon',
    year: 1915,
    then: ['ridge', 'shops', 'awnings', 'marquee', 'poles', 'road'],
    now: ['ridge', 'shops', 'awnings', 'poles', 'road'],
  },
  {
    id: 'mission-founded',
    placeId: 'mission-san-jose',
    caption: 'The mission on the road between San José and the East Bay',
    year: 1797,
    then: ['ridge', 'adobe', 'olives', 'oaks'],
    now: ['ridge', 'mission', 'olives', 'road'],
  },
  {
    id: 'transcontinental-niles',
    placeId: 'niles-canyon',
    caption: 'The first through train down Niles Canyon',
    year: 1869,
    then: ['canyon', 'locomotive', 'tracks', 'creek'],
    now: ['canyon', 'creek', 'tracks', 'road'],
  },
  {
    id: 'patterson-house',
    placeId: 'patterson-house',
    caption: 'The Patterson house, new on the ranch',
    year: 1857,
    then: ['victorian', 'orchard', 'lawn'],
    now: ['victorian', 'windmill', 'orchard'],
  },
  {
    id: 'shinn-house',
    placeId: 'shinn-park',
    caption: 'The Shinn house and its nursery grounds',
    year: 1876,
    then: ['victorian', 'orchard', 'oaks'],
    now: ['victorian', 'orchard', 'lawn'],
  },
  {
    id: 'washington-high',
    placeId: 'washington-high',
    caption: 'The first high school in the township',
    year: 1892,
    then: ['victorian', 'flagpole', 'field'],
    now: ['school', 'flagpole', 'oaks'],
  },
  {
    id: 'essanay-opens',
    placeId: 'essanay-museum',
    caption: 'The picture company sets up shop in Niles',
    year: 1912,
    then: ['shops', 'marquee', 'poles', 'road'],
    now: ['shops', 'marquee', 'road'],
  },
  {
    id: 'first-dumbarton',
    placeId: 'dumbarton',
    caption: 'The first highway bridge across the lower bay',
    year: 1927,
    then: ['bay', 'trestle', 'levee'],
    now: ['bay', 'bridge', 'levee'],
  },
  {
    id: 'incorporation',
    placeId: 'city-hall',
    caption: 'Five townships vote to become one city',
    year: 1956,
    then: ['orchard', 'barn', 'road'],
    now: ['civic', 'flagpole', 'lawn'],
  },
  {
    id: 'gm-plant',
    placeId: 'tesla-factory',
    caption: 'The assembly plant opens on Fremont Boulevard',
    year: 1962,
    then: ['orchard', 'factory', 'lot'],
    now: ['factory', 'stacks', 'lot'],
  },
  {
    id: 'nummi',
    placeId: 'tesla-factory',
    caption: 'The plant reopens under two flags',
    year: 1984,
    then: ['factory', 'lot', 'poles'],
    // Deliberately not the same `now` as gm-plant: two scenes sharing a
    // placeId and an identical now-list render the same Today half with
    // two different correct answers.
    now: ['factory', 'stacks', 'guideway'],
  },
  {
    id: 'bart-arrives',
    placeId: 'fremont-bart',
    caption: 'The first train reaches the end of the line',
    year: 1972,
    then: ['orchard', 'guideway', 'lot'],
    now: ['guideway', 'train', 'lot'],
  },
  {
    id: 'warm-springs-bart',
    placeId: 'warm-springs-bart',
    caption: 'The line pushes south past the old end of the road',
    year: 2017,
    then: ['warehouse', 'road', 'poles'],
    now: ['guideway', 'train', 'lot'],
  },
  {
    id: 'ohlone-college',
    placeId: 'ohlone-college',
    caption: 'The college opens its campus on the hill',
    year: 1974,
    then: ['ridge', 'orchard', 'oaks'],
    now: ['ridge', 'civic', 'dome', 'oaks'],
  },
]

export const SCENE_COUNT = SCENES.length

const mix = (n) => {
  let h = (n * 2654435761) % 4294967296
  h ^= h >>> 15
  h = (h * 2246822519) % 4294967296
  h ^= h >>> 13
  return h >>> 0
}

const FIRST_YEAR = 1760
const LAST_YEAR = 2024

// Six years to choose from, the true one among them. The decoys are
// spaced far enough apart to be separable by what is in the picture —
// offering 1912 and 1915 together makes it a coin flip between two
// answers the drawing cannot distinguish.
//
// Bounded on purpose. The obvious version of this walks outward until
// it has six, which never terminates for a scene near either end of
// the range: past a certain offset every candidate is out of bounds and
// the loop spins. Here the candidates are a fixed list, tried once
// each, with the spacing rule relaxed rather than the loop extended.
function optionsFor(scene, day) {
  const h = mix(day * 61 + scene.year)
  const wide = scene.year < 1900
  const offsets = wide
    ? [-58, -34, -19, 14, 29, 47, -71, -46, -27, 22, 38, 61]
    : [-41, -26, -13, 11, 23, 38, -55, -33, -19, 17, 30, 49]

  const picked = [scene.year]

  const tryFill = (minGap) => {
    for (let i = 0; i < offsets.length && picked.length < 6; i++) {
      const y = scene.year + offsets[(i + h) % offsets.length]
      if (y < FIRST_YEAR || y > LAST_YEAR) continue
      if (picked.some((p) => Math.abs(p - y) < minGap)) continue
      picked.push(y)
    }
  }

  tryFill(8)
  tryFill(4) // a scene near 1797 or 2017 has less room; take what fits
  tryFill(1)

  // Deliberately NOT sorted. Sorted years turn the earlier/later hint
  // into a binary search: pick the middle button and a player who knows
  // nothing at all wins 100% of the time, without looking at the
  // drawing. Shuffled, the hint still helps but you have to read the
  // picture to use it.
  const order = mix(day * 7717 + scene.year)
  return picked
    .map((y, i) => ({ y, k: mix(order + i * 2654435761) }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.y)
}

// Fourteen scenes hashed at random repeated back-to-back 39 times in 400
// days — one day in ten showed yesterday's puzzle again, same answer.
// A walk cannot do that.
const SCENE_STEP = 9 // coprime with 14

export function thenNowForDay(day) {
  const scene = SCENES[(day * SCENE_STEP) % SCENES.length]
  return {
    id: 'thennow',
    scene,
    place: scene.caption,
    answerYear: scene.year,
    options: optionsFor(scene, day),
    maxGuesses: 3,
  }
}
