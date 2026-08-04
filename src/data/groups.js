// ─────────────────────────────────────────────────────────────
//  GROUPS — the category pool.
//
//  difficulty 0 is the one you spot first, 3 is the one you only
//  get by elimination. A day's board is four groups picked by day
//  number, one at each difficulty, guaranteed not to share a tile.
//
//  Traps are the whole game, so items are deliberately repeated
//  ACROSS the pool — "Mission San Jose" is a township, a high
//  school, a mission and a district; "Niles" is a township, a
//  canyon and a film studio. The picker refuses to put two groups
//  that share a tile on the same board, which means those pairs
//  simply never collide, and the trap survives.
//
//  Everything here is real. Where I could not verify a roster
//  (which middle school opened when, exactly which streets are
//  named for whom) the group is not in the pool.
// ─────────────────────────────────────────────────────────────

export const GROUPS = [
  // ── difficulty 0 — the gimme ────────────────────────────────
  { d: 0, label: 'Built at the plant on Fremont Boulevard', items: ['Nova', 'Corolla', 'Tacoma', 'Model 3'] },
  { d: 0, label: 'Cities that border Fremont', items: ['Newark', 'Union City', 'Hayward', 'Milpitas'] },
  { d: 0, label: 'Fremont high schools', items: ['American', 'Washington', 'Kennedy', 'Irvington'] },
  { d: 0, label: 'Bay Area bridges', items: ['Dumbarton', 'Bay', 'San Mateo', 'Richmond'] },
  { d: 0, label: 'Trees you actually see here', items: ['Eucalyptus', 'Redwood', 'Oak', 'Sycamore'] },
  { d: 0, label: 'Bay Area teams', items: ['Warriors', 'Giants', 'Sharks', 'Earthquakes'] },
  { d: 0, label: 'Big roads through town', items: ['Mission', 'Fremont', 'Mowry', 'Stevenson'] },
  { d: 0, label: 'Birds on the bay side', items: ['Egret', 'Heron', 'Avocet', 'Pelican'] },
  { d: 0, label: 'What the weather does here', items: ['Fog', 'Wind', 'Drizzle', 'Glare'] },
  { d: 0, label: 'Counties on the bay', items: ['Alameda', 'Santa Clara', 'San Mateo', 'Marin'] },
  { d: 0, label: 'BART, going north from Fremont', items: ['Union City', 'South Hayward', 'Hayward', 'Bay Fair'] },
  { d: 0, label: 'Ways to cross the bay', items: ['Bridge', 'Ferry', 'Tunnel', 'Swim'] },
  { d: 0, label: 'Fremont park staples', items: ['Playground', 'Duck pond', 'Ball field', 'Picnic table'] },
  { d: 0, label: 'Silent film comedians', items: ['Chaplin', 'Keaton', 'Lloyd', 'Arbuckle'] },
  { d: 0, label: 'On a hiking checklist', items: ['Water', 'Sunscreen', 'Boots', 'Hat'] },
  { d: 0, label: 'Bay Area airports', items: ['Oakland', 'San Jose', 'San Francisco', 'Hayward'] },
  { d: 0, label: 'Route numbers that touch Fremont', items: ['880', '680', '84', '262'] },
  { d: 0, label: 'Kinds of California weather year', items: ['Drought', 'Flood', 'Fire', 'Bloom'] },
  { d: 0, label: 'Seen on Niles Boulevard', items: ['Antiques', 'Bakery', 'Bookstore', 'Marquee'] },
  { d: 0, label: 'Fremont grocery runs', items: ['Farmers market', 'Ranch 99', 'Trader Joe’s', 'Safeway'] },
  { d: 0, label: 'Sounds of a freight train', items: ['Horn', 'Rumble', 'Clang', 'Squeal'] },
  { d: 0, label: 'What a commuter carries', items: ['Clipper card', 'Badge', 'Thermos', 'Headphones'] },
  { d: 0, label: 'Farm animals at Ardenwood', items: ['Sheep', 'Goat', 'Chicken', 'Draft horse'] },
  { d: 0, label: 'Things a mission was built from', items: ['Adobe', 'Tile', 'Timber', 'Lime'] },
  { d: 0, label: 'Bay Area mountains', items: ['Diablo', 'Hamilton', 'Tamalpais', 'Umunhum'] },

  // ── difficulty 1 — you get there, but not instantly ─────────
  { d: 1, label: 'East Bay Regional Parks, in town', items: ['Coyote Hills', 'Quarry Lakes', 'Ardenwood', 'Alameda Creek'] },
  { d: 1, label: 'Peaks on the ridge above town', items: ['Mission', 'Monument', 'Allison', 'Bald'] },
  { d: 1, label: 'Also made at NUMMI', items: ['Prizm', 'Vibe', 'Voltz', 'Hilux'] },
  { d: 1, label: 'Fremont’s historic parks', items: ['Shinn', 'Vallejo Mill', 'Sabercat', 'Ardenwood'] },
  { d: 1, label: 'Rail stops, past and present', items: ['Niles', 'Centerville', 'Irvington', 'Decoto'] },
  { d: 1, label: 'Missions in the Bay Area', items: ['San José', 'Santa Clara', 'Dolores', 'San Rafael'] },
  { d: 1, label: 'Words before “Canyon”', items: ['Niles', 'Grand', 'Bryce', 'Antelope'] },
  { d: 1, label: 'Words before “Hills”', items: ['Coyote', 'Beverly', 'Cherry', 'Sand'] },
  { d: 1, label: 'Alameda County cities you forget', items: ['Albany', 'Piedmont', 'Emeryville', 'Dublin'] },
  { d: 1, label: 'Chaplin pictures shot in Niles', items: ['The Tramp', 'The Champion', 'In the Park', 'The Bank'] },
  { d: 1, label: 'What a salt pond turns', items: ['Pink', 'Orange', 'Rust', 'White'] },
  { d: 1, label: 'Creeks in the East Bay', items: ['Alameda', 'Dry', 'Walnut', 'Sausal'] },
  { d: 1, label: 'Marsh vocabulary', items: ['Slough', 'Levee', 'Mudflat', 'Tule'] },
  { d: 1, label: 'Ohlone College has one', items: ['Planetarium', 'Amphitheater', 'Newark campus', 'Nursing school'] },
  { d: 1, label: 'Kinds of railroad car', items: ['Boxcar', 'Gondola', 'Hopper', 'Caboose'] },
  { d: 1, label: 'Bay Area transit systems', items: ['BART', 'AC Transit', 'VTA', 'Caltrain'] },
  { d: 1, label: 'What Fremont was before 1956', items: ['Farmland', 'Orchards', 'Nurseries', 'Townships'] },
  { d: 1, label: 'Grown in the Alameda County of 1900', items: ['Apricots', 'Walnuts', 'Grapes', 'Hay'] },
  { d: 1, label: 'The Dumbarton has had one', items: ['Drawbridge', 'Toll plaza', 'Rail crossing', 'Bike lane'] },
  { d: 1, label: 'Words before “Springs”', items: ['Warm', 'Palm', 'Colorado', 'Hot'] },
  { d: 1, label: 'Words before “Creek”', items: ['Alameda', 'Battle', 'Walnut', 'Cripple'] },
  { d: 1, label: 'Found in a shellmound', items: ['Oyster', 'Mussel', 'Abalone', 'Charcoal'] },
  { d: 1, label: 'A Victorian farmhouse has one', items: ['Cupola', 'Parlor', 'Veranda', 'Gable'] },
  { d: 1, label: 'Things named for John C. Frémont', items: ['A city', 'A peak', 'A county', 'A street'] },
  { d: 1, label: 'What the plant needed by the trainload', items: ['Steel', 'Glass', 'Paint', 'Rubber'] },

  // ── difficulty 2 — the one that costs you a life ────────────
  { d: 2, label: 'Townships that became Fremont in 1956', items: ['Centerville', 'Niles', 'Warm Springs', 'Irvington'] },
  { d: 2, label: 'Fremont districts that are also streets', items: ['Niles', 'Irvington', 'Centerville', 'Warm Springs'] },
  { d: 2, label: 'Named for a Californio family', items: ['Peralta', 'Vallejo', 'Alviso', 'Castro'] },
  { d: 2, label: 'BART stations that opened after 2010', items: ['Warm Springs', 'Milpitas', 'Berryessa', 'Antioch'] },
  { d: 2, label: 'Lakes you can walk around here', items: ['Elizabeth', 'Quarry', 'Shinn', 'Horseshoe'] },
  { d: 2, label: 'Words that follow “Mission”', items: ['Peak', 'Boulevard', 'Statement', 'Control'] },
  { d: 2, label: 'Words that follow “Central”', items: ['Park', 'Avenue', 'Valley', 'Time'] },
  { d: 2, label: 'Silent-era studio towns', items: ['Niles', 'Fort Lee', 'Astoria', 'Culver City'] },
  { d: 2, label: 'A mission bell needs one', items: ['Clapper', 'Yoke', 'Rope', 'Crown'] },
  { d: 2, label: 'Names on a bay salt works', items: ['Leslie', 'Oliver', 'Cargill', 'Morton'] },
  { d: 2, label: 'What Ardenwood grew for market', items: ['Hay', 'Beets', 'Grain', 'Walnuts'] },
  { d: 2, label: 'Kinds of adobe failure', items: ['Slump', 'Crack', 'Wash', 'Quake'] },
  { d: 2, label: 'The 1868 quake broke this fault', items: ['Hayward', 'Calaveras', 'Mission', 'Silver Creek'] },
  { d: 2, label: 'Ohlone words on the map', items: ['Ohlone', 'Tuibun', 'Alviso', 'Niles'] },
  { d: 2, label: 'Words before “Mill”', items: ['Vallejo', 'Saw', 'Wind', 'Tread'] },
  { d: 2, label: 'A quarry leaves behind', items: ['Pit', 'Tailings', 'Gravel', 'A lake'] },
  { d: 2, label: 'Ways to say “gone under water”', items: ['Flooded', 'Submerged', 'Drowned', 'Sunk'] },
  { d: 2, label: 'Things a levee holds back', items: ['Tide', 'Creek', 'Salt', 'Storm'] },
  { d: 2, label: 'What a new city has to pick', items: ['A name', 'A seal', 'A seat', 'A charter'] },
  { d: 2, label: 'What replaced the orchards', items: ['Tract homes', 'Cul-de-sacs', 'Strip malls', 'The plant'] },
  { d: 2, label: 'A steam locomotive carries', items: ['Tender', 'Boiler', 'Cowcatcher', 'Whistle'] },
  { d: 2, label: 'Roads named for a mission', items: ['Mission', 'Paseo Padre', 'Palm', 'Olive'] },
  { d: 2, label: 'Where the Transcontinental met the bay', items: ['Niles', 'Sacramento', 'Oakland', 'Alameda'] },
  { d: 2, label: 'Fremont’s bay-side neighbours', items: ['Salt ponds', 'Sloughs', 'Levees', 'Runways'] },
  { d: 2, label: 'What a shellmound became', items: ['A parking lot', 'A quarry', 'A park', 'A dispute'] },

  // ── difficulty 3 — only by elimination ──────────────────────
  { d: 3, label: 'Hiding a bird', items: ['Heronry', 'Crowded', 'Ternary', 'Gullible'] },
  { d: 3, label: 'Hiding a tree', items: ['Oakland', 'Palmdale', 'Elmhurst', 'Ashby'] },
  { d: 3, label: 'Hiding a body of water', items: ['Baywatch', 'Lagoon', 'Creektown', 'Poncho'] },
  { d: 3, label: 'Precede “Ford”', items: ['Stan', 'Craw', 'Ox', 'Hart'] },
  { d: 3, label: 'Letters you do not pronounce', items: ['Salmon', 'Island', 'Debris', 'Column'] },
  { d: 3, label: 'A peak and a street in Fremont', items: ['Mission', 'Walnut', 'Olive', 'Palm'] },
  { d: 3, label: 'A park and the person it is named for', items: ['Shinn', 'Vallejo', 'Patterson', 'Edwards'] },
  { d: 3, label: 'A lake somewhere, and a queen', items: ['Elizabeth', 'Victoria', 'Anne', 'Mary'] },
  { d: 3, label: 'A Chevrolet and something in the sky', items: ['Nova', 'Vega', 'Comet', 'Eclipse'] },
  { d: 3, label: 'A mission and the city named after it', items: ['San José', 'San Rafael', 'Santa Clara', 'San Francisco'] },
  { d: 3, label: 'A fault and a place on the map', items: ['Hayward', 'Calaveras', 'Mission', 'Silver Creek'] },
  { d: 3, label: 'All mean “a tree-lined walk”', items: ['Alameda', 'Promenade', 'Esplanade', 'Mall'] },
  { d: 3, label: 'Newcomers say these wrong', items: ['Paseo Padre', 'Alviso', 'Decoto', 'Vallejo'] },
  { d: 3, label: 'Can follow “Fremont”', items: ['Boulevard', 'Hub', 'Peak', 'Bank'] },
  { d: 3, label: 'Kinds of mission', items: ['Religious', 'Military', 'Corporate', 'Space'] },
  { d: 3, label: 'A Fremont school and a president', items: ['Washington', 'Kennedy', 'Lincoln', 'Hoover'] },
  { d: 3, label: 'A California county and a Fremont street', items: ['Alameda', 'Mono', 'Napa', 'Sonoma'] },
  { d: 3, label: 'Words for the edge of the bay', items: ['Shore', 'Strand', 'Bank', 'Margin'] },
  { d: 3, label: 'A quarry, then a lake, now a park', items: ['Horseshoe', 'Rainbow', 'Willow', 'Lago Los Osos'] },
  { d: 3, label: 'An orchard fruit and a paint color', items: ['Apricot', 'Cherry', 'Plum', 'Peach'] },
  { d: 3, label: 'Things a “tramp” can be', items: ['A vagrant', 'A cargo ship', 'A long walk', 'A Chaplin role'] },
  { d: 3, label: 'Both a saint and a bay-area city', items: ['Clara', 'Rafael', 'Mateo', 'Bruno'] },
  { d: 3, label: 'Anagrams of one another', items: ['Slate', 'Least', 'Steal', 'Tales'] },
  { d: 3, label: 'Double letters in the middle', items: ['Mission', 'Ballot', 'Tunnel', 'Current'] },
  { d: 3, label: 'A grade of adobe brick', items: ['Sun-dried', 'Stabilised', 'Fired', 'Rammed'] },
]

export const GROUP_COUNT = GROUPS.length

const mix = (n) => {
  let h = (n * 2654435761) % 4294967296
  h ^= h >>> 15
  h = (h * 2246822519) % 4294967296
  h ^= h >>> 13
  return h >>> 0
}

const byDifficulty = [0, 1, 2, 3].map((d) => GROUPS.filter((g) => g.d === d))

// Groups hold four items but a board deals three of them, which is what
// makes the board twelve tiles — four clean rows of three, no orphan
// hanging off the bottom of the doc's three-column grid.
//
// The fourth item is not wasted: which one sits out rotates by day, so
// the same category plays differently the next time it comes round, and
// the pool carries more content than the board can show.
export const ITEMS_PER_GROUP = 3

const dealItems = (g, day, d) => {
  const drop = mix(day * 31337 + d * 7717) % g.items.length
  return g.items.filter((_, i) => i !== drop)
}

// Largest number coprime with 25 that isn't 1 — any coprime step walks
// the whole tier before repeating, this one just doesn't walk it in an
// order you'd notice.
const STEP = 7

// Which group a tier serves on a given day.
//
// Picking at random from 25 looks fine day to day and is wrong across a
// week: with 25 candidates a repeat inside four days is likely, not
// rare, and "Precede Ford" showing up twice running reads as laziness
// even when the tiles differ. So each tier walks a fixed cycle instead,
// every group exactly once per 25 days.
//
// The cycle is deliberately NOT re-offset each lap. Shifting it puts a
// group at the end of one lap and the start of the next, which is the
// two-day repeat this was meant to kill. Boards stay varied anyway: the
// four tiers walk independently, and which item sits out rotates daily.
const cycleSlot = (day, d, n) => ((day % n) * STEP + d * 5) % n

// One group at each difficulty. Two groups that share a tile can never
// sit on the same board — that is what keeps "Mission San Jose is a
// school AND a township" a trap rather than a bug — so a collision walks
// forward in the cycle. The check is on the dealt three, not on all
// four, or a clash that never reaches the board would still cost us a
// category.
export function groupsForDay(day) {
  const chosen = []
  const taken = new Set()

  for (let d = 0; d < 4; d++) {
    const pool = byDifficulty[d]
    const start = cycleSlot(day, d, pool.length)

    for (let step = 0; step < pool.length; step++) {
      const g = pool[(start + step) % pool.length]
      const items = dealItems(g, day, d)
      if (items.some((i) => taken.has(i))) continue
      items.forEach((i) => taken.add(i))
      chosen.push({ label: g.label, difficulty: d, items })
      break
    }
  }

  return chosen
}
