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
      { name: 'Mission Peak', value: 2520 },
      { name: 'Monument Peak', value: 2594 },
      { name: 'Mount Allison', value: 2658 },
      { name: 'Mount Diablo', value: 3849 },
      { name: 'Mount Hamilton', value: 4265 },
      { name: 'Mount Tamalpais', value: 2571 },
      { name: 'Mount Umunhum', value: 3486 },
      { name: 'Loma Prieta', value: 3786 },
      { name: 'Vollmer Peak', value: 1913 },
      { name: 'Grizzly Peak', value: 1759 },
      { name: 'Round Top, in the Oakland hills', value: 1763 },
      { name: 'Twin Peaks, in San Francisco', value: 922 },
      { name: 'Mount Davidson, San Francisco', value: 928 },
      { name: 'Mount Saint Helena', value: 4344 },
      { name: 'Mount Sizer', value: 3216 },
      { name: 'Copernicus Peak', value: 4372 },
    ],
  },
  {
    unit: 'the year it opened',
    facts: [
      { name: 'Mission San José', value: 1797 },
      { name: 'Mission Dolores, San Francisco', value: 1776 },
      { name: 'Mission Santa Clara de Asís', value: 1777 },
      { name: 'Mission San Francisco Solano, the last one', value: 1823 },
      { name: 'The Shinn House', value: 1876 },
      { name: 'The Patterson House at Ardenwood', value: 1857 },
      { name: 'Washington High School', value: 1892 },
      { name: 'Ohlone College', value: 1967 },
      { name: 'The Essanay studio in Niles', value: 1912 },
      { name: 'The Fremont Assembly Plant', value: 1962 },
      { name: 'NUMMI', value: 1984 },
      { name: 'Tesla in Fremont', value: 2010 },
      { name: 'BART, first passengers', value: 1972 },
      { name: 'Warm Springs BART', value: 2017 },
      { name: 'Milpitas and Berryessa BART', value: 2020 },
      { name: 'The first Dumbarton Bridge', value: 1927 },
      { name: 'The Dumbarton Bridge you drive now', value: 1982 },
      { name: 'The San Mateo–Hayward Bridge', value: 1929 },
      { name: 'The Bay Bridge', value: 1936 },
      { name: 'The Golden Gate Bridge', value: 1937 },
      { name: 'The Richmond–San Rafael Bridge', value: 1956 },
      { name: 'The Carquinez Bridge, the first one', value: 1927 },
      { name: 'The transcontinental railroad through Niles Canyon', value: 1869 },
    ],
  },
  {
    unit: 'the year it was founded',
    facts: [
      { name: 'Fremont', value: 1956 },
      { name: 'Newark', value: 1955 },
      { name: 'Union City', value: 1959 },
      { name: 'Hayward', value: 1876 },
      { name: 'Oakland', value: 1852 },
      { name: 'San José, the pueblo', value: 1777 },
      { name: 'Berkeley', value: 1878 },
      { name: 'Alameda County', value: 1853 },
      { name: 'California statehood', value: 1850 },
      { name: 'Milpitas', value: 1954 },
      { name: 'Pleasanton', value: 1894 },
      { name: 'Livermore', value: 1876 },
      { name: 'UC Berkeley', value: 1868 },
      { name: 'Stanford, first classes', value: 1891 },
      { name: 'Cal State East Bay', value: 1957 },
      { name: 'San José State', value: 1857 },
    ],
  },
  {
    unit: 'acres',
    facts: [
      { name: 'Central Park', value: 450 },
      { name: 'Lake Elizabeth', value: 83 },
      { name: 'Coyote Hills Regional Park', value: 978 },
      { name: 'Quarry Lakes', value: 540 },
      { name: 'Ardenwood Historic Farm', value: 205 },
      { name: 'Mission Peak Regional Preserve', value: 3000 },
      { name: 'Garin and Dry Creek Pioneer', value: 4800 },
      { name: 'Sunol Regional Wilderness', value: 6858 },
      { name: 'Tilden Regional Park', value: 2079 },
      { name: 'Anthony Chabot Regional Park', value: 3315 },
      { name: 'Don Edwards San Francisco Bay refuge', value: 30000 },
      { name: 'Golden Gate Park', value: 1017 },
      { name: 'Central Park in New York', value: 843 },
      { name: 'The Presidio', value: 1491 },
      { name: 'Point Reyes National Seashore', value: 71028 },
      { name: 'Henry W. Coe State Park', value: 87000 },
    ],
  },
  {
    unit: 'people, at the 2020 census',
    facts: [
      { name: 'Fremont', value: 230504 },
      { name: 'Newark', value: 47529 },
      { name: 'Union City', value: 70143 },
      { name: 'Hayward', value: 162954 },
      { name: 'Milpitas', value: 80273 },
      { name: 'San Leandro', value: 91008 },
      { name: 'Pleasanton', value: 79871 },
      { name: 'Livermore', value: 87955 },
      { name: 'Dublin', value: 72589 },
      { name: 'San José', value: 1013240 },
      { name: 'Oakland', value: 440646 },
      { name: 'Berkeley', value: 124321 },
      { name: 'Alameda', value: 78280 },
      { name: 'Sunnyvale', value: 155805 },
      { name: 'Santa Clara', value: 127647 },
      { name: 'Palo Alto', value: 68572 },
      { name: 'San Francisco', value: 873965 },
      { name: 'Alameda County', value: 1682353 },
    ],
  },
  {
    unit: 'square miles',
    facts: [
      { name: 'Fremont', value: 92 },
      { name: 'Newark', value: 14 },
      { name: 'Union City', value: 20 },
      { name: 'Hayward', value: 64 },
      { name: 'San José', value: 180 },
      { name: 'Oakland', value: 78 },
      { name: 'San Francisco', value: 47 },
      { name: 'Berkeley', value: 18 },
      { name: 'Milpitas', value: 14 },
      { name: 'Alameda County', value: 821 },
      { name: 'Livermore', value: 26 },
      { name: 'Pleasanton', value: 24 },
    ],
  },
  {
    unit: 'years it ran under that name',
    facts: [
      { name: 'NUMMI, 1984–2010', value: 26 },
      { name: 'GM Fremont Assembly, 1962–1982', value: 20 },
      { name: 'The Essanay studio in Niles, 1912–1916', value: 4 },
      { name: 'Mission San José as a mission, 1797–1834', value: 37 },
      { name: 'The first Dumbarton Bridge, 1927–1984', value: 57 },
      { name: 'Fremont, so far', value: 70 },
      { name: 'The Key System, 1903–1958', value: 55 },
      { name: 'The Southern Pacific, 1865–1996', value: 131 },
    ],
  },
  {
    unit: 'miles',
    facts: [
      { name: 'The Alameda Creek Trail, end to end', value: 12 },
      { name: 'Niles Canyon Road', value: 6 },
      { name: 'The Dumbarton Bridge', value: 1.6 },
      { name: 'The San Mateo–Hayward Bridge', value: 7 },
      { name: 'The Bay Bridge', value: 4.5 },
      { name: 'The Golden Gate Bridge', value: 1.7 },
      { name: 'Alameda Creek, source to bay', value: 45 },
      { name: 'Fremont BART to Downtown Berkeley', value: 26 },
      { name: 'Mission Peak trail, Stanford Avenue and back', value: 6 },
      { name: 'The whole BART system', value: 131 },
    ],
  },
  {
    unit: 'feet',
    facts: [
      { name: 'The Golden Gate Bridge towers', value: 746 },
      { name: 'Salesforce Tower', value: 1070 },
      { name: 'The Campanile at Berkeley', value: 307 },
      { name: 'Coit Tower', value: 210 },
      { name: 'The Transamerica Pyramid', value: 853 },
      { name: 'Mission San José’s bell tower', value: 60 },
      { name: 'The Dumbarton Bridge, at its highest', value: 85 },
    ],
  },
  {
    unit: 'how many there are',
    facts: [
      { name: 'California missions', value: 21 },
      { name: 'Townships that became Fremont', value: 5 },
      { name: 'Comprehensive high schools in Fremont', value: 5 },
      { name: 'BART stations in Fremont', value: 2 },
      { name: 'BART stations, all of them', value: 50 },
      { name: 'Bells at Mission San José', value: 4 },
      { name: 'Counties touching San Francisco Bay', value: 9 },
      { name: 'Cities in Alameda County', value: 14 },
      { name: 'Regional parks run by East Bay Parks', value: 73 },
      { name: 'Chaplin pictures made in Niles', value: 5 },
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

// Five rounds, each a pair from the same unit, no fact used twice in a
// day and no unit used more than twice — five elevation questions in a
// row is one question asked five times.
export function roundsForDay(day) {
  const rounds = []
  const usedFacts = new Set()
  const unitCount = {}

  for (let i = 0; rounds.length < 5 && i < 200; i++) {
    const h = mix(day * 977 + i * 31)
    const set = FACT_SETS[h % FACT_SETS.length]

    if ((unitCount[set.unit] || 0) >= 2) continue

    const n = set.facts.length
    const ai = (h >>> 8) % n
    const bi = (ai + 1 + ((h >>> 16) % (n - 1))) % n
    const a = set.facts[ai]
    const b = set.facts[bi]

    // Equal values make the question unanswerable, and a fact that
    // already appeared today gives its own answer away.
    const key = (f) => set.unit + '|' + f.name
    if (a.value === b.value) continue
    if (usedFacts.has(key(a)) || usedFacts.has(key(b))) continue

    usedFacts.add(key(a))
    usedFacts.add(key(b))
    unitCount[set.unit] = (unitCount[set.unit] || 0) + 1
    rounds.push({ unit: set.unit, a, b })
  }

  return rounds
}
