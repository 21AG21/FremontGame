// ─────────────────────────────────────────────────────────────
//  HIGHER OR LOWER — the fact pool.
//
//  Grouped by unit, because the only fair question is one where
//  both sides are measured the same way. A day's puzzle is five
//  pairs drawn from these by day number.
//
//  Everything here is real and checked. Where a number moves —
//  populations, mostly — the unit says so and the value is the
//  rounded census figure, not a live count. A hyperlocal puzzle
//  that invents numbers is worse than no puzzle: the first person
//  who knows better stops trusting it and never comes back.
// ─────────────────────────────────────────────────────────────

export const FACT_SETS = [
  {
    unit: 'feet above sea level',
    facts: [
      { name: 'Mission Peak', value: 2520, anchor: true },
      { name: 'Monument Peak', value: 2594, anchor: true },
      { name: 'Mount Allison', value: 2658 },
      { name: 'Mount Diablo', value: 3849, anchor: true },
      { name: 'Mount Hamilton', value: 4265, anchor: true },
      { name: 'Mount Tamalpais', value: 2571, anchor: true },
      { name: 'Mount Umunhum', value: 3486 },
      { name: 'Loma Prieta', value: 3786 },
      { name: 'Vollmer Peak', value: 1913 },
      { name: 'Grizzly Peak', value: 1759 },
      { name: 'Round Top, in the Oakland hills', value: 1763 },
      { name: 'Twin Peaks, in San Francisco', value: 922, anchor: true },
      { name: 'Mount Davidson, San Francisco', value: 928 },
      { name: 'Mount Saint Helena', value: 4344 },
      { name: 'Mount Sizer', value: 3216 },
      { name: 'Copernicus Peak', value: 4372 },
    ],
  },
  {
    unit: 'the year it opened',
    facts: [
      { name: 'Mission San José', value: 1797, anchor: true },
      { name: 'Mission Dolores, San Francisco', value: 1776 },
      { name: 'Mission Santa Clara de Asís', value: 1777 },
      { name: 'Mission San Francisco Solano, the last one', value: 1823 },
      { name: 'The Shinn House', value: 1876, anchor: true },
      { name: 'The Patterson House at Ardenwood', value: 1857, anchor: true },
      { name: 'Washington High School', value: 1892, anchor: true },
      { name: 'Ohlone College', value: 1967, anchor: true },
      { name: 'The Essanay studio in Niles', value: 1912, anchor: true },
      { name: 'The Fremont Assembly Plant', value: 1962, anchor: true },
      { name: 'NUMMI', value: 1984, anchor: true },
      { name: 'Tesla in Fremont', value: 2010, anchor: true },
      { name: 'BART, first passengers', value: 1972, anchor: true },
      { name: 'Warm Springs BART', value: 2017, anchor: true },
      { name: 'Milpitas and Berryessa BART', value: 2020, anchor: true },
      { name: 'The first Dumbarton Bridge', value: 1927 },
      { name: 'The Dumbarton Bridge you drive now', value: 1982, anchor: true },
      { name: 'The San Mateo–Hayward Bridge', value: 1929, anchor: true },
      { name: 'The Bay Bridge', value: 1936, anchor: true },
      { name: 'The Golden Gate Bridge', value: 1937, anchor: true },
      { name: 'The Richmond–San Rafael Bridge', value: 1956 },
      { name: 'The Carquinez Bridge, the first one', value: 1927 },
      { name: 'The transcontinental railroad through Niles Canyon', value: 1869, anchor: true },
    ],
  },
  {
    unit: 'the year it was founded',
    facts: [
      { name: 'Fremont', value: 1956, anchor: true },
      { name: 'Newark', value: 1955, anchor: true },
      { name: 'Union City', value: 1959, anchor: true },
      { name: 'Hayward', value: 1876, anchor: true },
      { name: 'Oakland', value: 1852, anchor: true },
      { name: 'San José, the pueblo', value: 1777, anchor: true },
      { name: 'Berkeley', value: 1878, anchor: true },
      { name: 'Alameda County', value: 1853, anchor: true },
      { name: 'California statehood', value: 1850, anchor: true },
      { name: 'Milpitas', value: 1954, anchor: true },
      { name: 'Pleasanton', value: 1894, anchor: true },
      { name: 'Livermore', value: 1876, anchor: true },
      { name: 'UC Berkeley', value: 1868, anchor: true },
      { name: 'Stanford, first classes', value: 1891, anchor: true },
      { name: 'Cal State East Bay', value: 1957 },
      { name: 'San José State', value: 1857 },
    ],
  },
  {
    unit: 'acres',
    facts: [
      { name: 'Central Park', value: 450, anchor: true },
      { name: 'Lake Elizabeth', value: 83, anchor: true },
      { name: 'Coyote Hills Regional Park', value: 978, anchor: true },
      { name: 'Quarry Lakes', value: 540, anchor: true },
      { name: 'Ardenwood Historic Farm', value: 205, anchor: true },
      { name: 'Mission Peak Regional Preserve', value: 3000, anchor: true },
      { name: 'Garin and Dry Creek Pioneer', value: 4800 },
      { name: 'Sunol Regional Wilderness', value: 6858 },
      { name: 'Tilden Regional Park', value: 2079 },
      { name: 'Anthony Chabot Regional Park', value: 3315 },
      { name: 'Don Edwards San Francisco Bay refuge', value: 30000 },
      { name: 'Golden Gate Park', value: 1017, anchor: true },
      { name: 'Central Park in New York', value: 843, anchor: true },
      { name: 'The Presidio', value: 1491 },
      { name: 'Point Reyes National Seashore', value: 71028 },
      { name: 'Henry W. Coe State Park', value: 87000 },
    ],
  },
  {
    unit: 'people, at the 2020 census',
    facts: [
      { name: 'Fremont', value: 230504, anchor: true },
      { name: 'Newark', value: 47529, anchor: true },
      { name: 'Union City', value: 70143, anchor: true },
      { name: 'Hayward', value: 162954, anchor: true },
      { name: 'Milpitas', value: 80273, anchor: true },
      { name: 'San Leandro', value: 91008, anchor: true },
      { name: 'Pleasanton', value: 79871, anchor: true },
      { name: 'Livermore', value: 87955, anchor: true },
      { name: 'Dublin', value: 72589, anchor: true },
      { name: 'San José', value: 1013240, anchor: true },
      { name: 'Oakland', value: 440646, anchor: true },
      { name: 'Berkeley', value: 124321, anchor: true },
      { name: 'Alameda', value: 78280, anchor: true },
      { name: 'Sunnyvale', value: 155805, anchor: true },
      { name: 'Santa Clara', value: 127647, anchor: true },
      { name: 'Palo Alto', value: 68572, anchor: true },
      { name: 'San Francisco', value: 873965, anchor: true },
      { name: 'Alameda County', value: 1682353, anchor: true },
    ],
  },
  {
    unit: 'square miles, total area',
    facts: [
      { name: 'Fremont', value: 92, anchor: true },
      { name: 'Newark', value: 14, anchor: true },
      { name: 'Union City', value: 20, anchor: true },
      { name: 'Hayward', value: 64, anchor: true },
      { name: 'San José', value: 180, anchor: true },
      { name: 'Oakland', value: 78, anchor: true },
      { name: 'San Francisco', value: 232, anchor: true },
      { name: 'Berkeley', value: 18, anchor: true },
      { name: 'Milpitas', value: 14, anchor: true },
      { name: 'Alameda County', value: 821, anchor: true },
      { name: 'Livermore', value: 26, anchor: true },
      { name: 'Pleasanton', value: 24, anchor: true },
    ],
  },
  {
    unit: 'years it ran under that name',
    facts: [
      { name: 'NUMMI', value: 26, anchor: true },
      { name: 'GM Fremont Assembly', value: 20, anchor: true },
      { name: 'The Essanay studio in Niles', value: 4, anchor: true },
      { name: 'Mission San José, as a working mission', value: 37, anchor: true },
      { name: 'The first Dumbarton Bridge', value: 57 },
      { name: 'The Southern Pacific', value: 131 },
    ],
  },
  {
    unit: 'miles',
    facts: [
      { name: 'The Alameda Creek Trail, end to end', value: 12, anchor: true },
      { name: 'Niles Canyon Road', value: 6, anchor: true },
      { name: 'The Dumbarton Bridge', value: 1.6, anchor: true },
      { name: 'The San Mateo–Hayward Bridge', value: 7, anchor: true },
      { name: 'The Bay Bridge', value: 4.5, anchor: true },
      { name: 'The Golden Gate Bridge', value: 1.7, anchor: true },
      { name: 'Alameda Creek, source to bay', value: 45, anchor: true },
      { name: 'Fremont BART to Downtown Berkeley', value: 26, anchor: true },
      { name: 'Mission Peak trail, Stanford Avenue and back', value: 6, anchor: true },
      { name: 'The whole BART system', value: 131, anchor: true },
    ],
  },
  {
    unit: 'feet',
    facts: [
      { name: 'The Golden Gate Bridge towers', value: 746, anchor: true },
      { name: 'Salesforce Tower', value: 1070, anchor: true },
      { name: 'The Campanile at Berkeley', value: 307, anchor: true },
      { name: 'Coit Tower', value: 210, anchor: true },
      { name: 'The Transamerica Pyramid', value: 853, anchor: true },
      { name: 'Mission San José’s bell tower', value: 60, anchor: true },
      { name: 'The Dumbarton Bridge, at its highest', value: 85 },
    ],
  },
  {
    unit: 'how many there are',
    facts: [
      { name: 'California missions', value: 21, anchor: true },
      { name: 'Townships that became Fremont', value: 5, anchor: true },
      { name: 'Comprehensive high schools in Fremont', value: 5, anchor: true },
      { name: 'BART stations in Fremont', value: 2, anchor: true },
      { name: 'BART stations, all of them', value: 50, anchor: true },
      { name: 'Bells at Mission San José', value: 4, anchor: true },
      { name: 'Counties in the Bay Area', value: 9, anchor: true },
      { name: 'Cities in Alameda County', value: 14, anchor: true },
      { name: 'Regional parks run by East Bay Parks', value: 73 },
      { name: 'Chaplin pictures made in Niles', value: 5, anchor: true },
    ],
  },
]

// Flat list, for anything that wants to count the pool.
export const ALL_FACTS = FACT_SETS.flatMap((s) =>
  s.facts.map((f) => ({ ...f, unit: s.unit }))
)

// A small deterministic hash. Day-indexed, not random: everyone in town
// has to get the same puzzle, and reloading must not reroll it.
const mix = (n) => {
  let h = (n * 2654435761) % 4294967296
  h ^= h >>> 15
  h = (h * 2246822519) % 4294967296
  h ^= h >>> 13
  return h >>> 0
}

// The shown side is always an anchor — somewhere you have stood, driven
// over, or can at least place on a map.
//
// This is the rule the whole game turns on. "Vollmer Peak vs Mount
// Sizer" is not a question; it is a coin flip wearing a puzzle costume,
// because there is no reasoning path from either name to a number. Give
// the player one end of the scale they can picture and the same obscure
// fact becomes an inference: you know Mission Peak is 2,520, so you can
// reason about whether some ridge behind it is taller.
// Every legal question in a unit, worked out once: an anchor on the
// shown side, anything on the hidden side, no self-pairs and no ties.
// Walking this list beats hashing into it — a hash repeated "The Bay
// Bridge vs The Golden Gate Bridge" verbatim on consecutive days, and
// a daily player spots that faster than they spot a hard question.
// The list is ordered anchor-major, so consecutive entries share a shown
// side. Stepping by about a third of it walked back onto the same anchor
// every three days; the golden-ratio step is the standard fix — it is
// the stride least likely to land near a small fraction of the length.
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const coprimeStep = (n) => {
  for (let s = Math.max(7, Math.round(n * 0.618)); s < n + 7; s++) if (gcd(s, n) === 1) return s
  return 1
}

const PAIRS = FACT_SETS.map((set) => {
  const list = []
  for (const a of set.facts) {
    if (!a.anchor) continue
    for (const b of set.facts) {
      if (a === b || a.value === b.value) continue
      list.push({ unit: set.unit, a, b })
    }
  }
  return { unit: set.unit, list, step: coprimeStep(list.length) }
})

// Five rounds, each a pair from the same unit, no fact used twice in a
// day and no unit used more than twice — five elevation questions in a
// row is one question asked five times.
//
// The day offsets walk rather than hash: a hashed pick repeated "The Bay
// Bridge vs The Golden Gate Bridge" verbatim on consecutive days, which
// a daily player spots immediately.
export function roundsForDay(day) {
  const rounds = []
  const usedFacts = new Set()
  const unitCount = {}

  for (let i = 0; rounds.length < 5 && i < 400; i++) {
    const set = PAIRS[(day * 3 + i) % PAIRS.length]
    if (!set.list.length) continue
    if ((unitCount[set.unit] || 0) >= 2) continue

    // Walk the unit's pair list. `nth` advances both with the day and
    // with how many times this unit has already been asked today, so
    // the two rounds a unit gets are never the same question.
    const nth = day * set.step + (unitCount[set.unit] || 0) * 17 + Math.floor(i / PAIRS.length)
    const { a, b } = set.list[nth % set.list.length]

    // A fact that has already appeared today gives its own answer away.
    const key = (f) => set.unit + '|' + f.name
    if (usedFacts.has(key(a)) || usedFacts.has(key(b))) continue

    usedFacts.add(key(a))
    usedFacts.add(key(b))
    unitCount[set.unit] = (unitCount[set.unit] || 0) + 1
    rounds.push({ unit: set.unit, a, b })
  }

  return rounds
}
