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
// ─────────────────────────────────────────────────────────────

export const TOWN = {
  name: 'Fremont',
  state: 'California',
  // Incorporated 23 January 1956 out of five townships.
  founded: 1956,
  center: { lat: 37.5485, lng: -121.9886 },
}

export const PLACES = [
  // ── Mission San José ────────────────────────────────────────
  { id: 'mission-san-jose', name: 'Mission San José', lat: 37.5344, lng: -121.9199, district: 'Mission San José', motifs: ['ridge', 'mission', 'olives', 'road'] },
  { id: 'ohlone-college', name: 'Ohlone College', lat: 37.5330, lng: -121.9170, district: 'Mission San José', motifs: ['ridge', 'civic', 'dome', 'oaks'] },
  { id: 'msj-high', name: 'Mission San Jose High School', lat: 37.5290, lng: -121.9210, district: 'Mission San José', motifs: ['school', 'flagpole', 'field'] },
  { id: 'palmdale-estates', name: 'Palmdale Estates', lat: 37.5350, lng: -121.9260, district: 'Mission San José', motifs: ['palms', 'victorian', 'lawn'] },
  { id: 'mission-peak', name: 'Mission Peak', lat: 37.5124, lng: -121.8802, district: 'Mission San José', motifs: ['peak', 'grass', 'post'] },
  { id: 'mission-peak-trailhead', name: 'The Stanford Avenue Trailhead', lat: 37.5100, lng: -121.9060, district: 'Mission San José', motifs: ['peak', 'gate', 'trail'] },
  { id: 'monument-peak', name: 'Monument Peak', lat: 37.4570, lng: -121.8680, district: 'Mission San José', motifs: ['peak', 'towers', 'grass'] },
  { id: 'olive-hyde', name: 'The Olive Hyde Art Gallery', lat: 37.5352, lng: -121.9256, district: 'Mission San José', motifs: ['victorian', 'olives', 'lawn'] },
  { id: 'weibel', name: 'The old Weibel winery grounds', lat: 37.5180, lng: -121.9060, district: 'Mission San José', motifs: ['ridge', 'vines', 'barn'] },
  { id: 'msj-cemetery', name: 'The Mission San José Cemetery', lat: 37.5360, lng: -121.9210, district: 'Mission San José', motifs: ['ridge', 'stones', 'olives'] },
  { id: 'chadbourne', name: 'Chadbourne Elementary', lat: 37.5250, lng: -121.9280, district: 'Mission San José', motifs: ['school', 'field', 'oaks'] },
  { id: 'gomes-park', name: 'Gomes Park', lat: 37.5230, lng: -121.9180, district: 'Mission San José', motifs: ['field', 'oaks', 'playground'] },

  // ── Warm Springs ────────────────────────────────────────────
  { id: 'tesla-factory', name: 'The Fremont Assembly Plant', lat: 37.4936, lng: -121.9450, district: 'Warm Springs', motifs: ['factory', 'stacks', 'lot'] },
  { id: 'warm-springs-bart', name: 'Warm Springs BART', lat: 37.5022, lng: -121.9394, district: 'Warm Springs', motifs: ['guideway', 'train', 'lot'] },
  { id: 'warm-springs-district', name: 'The Warm Springs district', lat: 37.4900, lng: -121.9350, district: 'Warm Springs', motifs: ['ridge', 'warehouse', 'road'] },
  { id: 'lake-elizabeth-south', name: 'The Warm Springs Community Center', lat: 37.4870, lng: -121.9330, district: 'Warm Springs', motifs: ['civic', 'lawn', 'oaks'] },
  { id: 'higuera', name: 'The Higuera adobe site', lat: 37.4790, lng: -121.9180, district: 'Warm Springs', motifs: ['ridge', 'adobe', 'oaks'] },
  { id: 'south-sundale', name: 'Sundale', lat: 37.5080, lng: -121.9700, district: 'Warm Springs', motifs: ['tract', 'lawn', 'road'] },
  { id: 'kato-road', name: 'Kato Road', lat: 37.4830, lng: -121.9280, district: 'Warm Springs', motifs: ['warehouse', 'road', 'poles'] },
  { id: 'agua-caliente', name: 'The Agua Caliente springs', lat: 37.4880, lng: -121.9240, district: 'Warm Springs', motifs: ['ridge', 'pond', 'tules'] },

  // ── Irvington ───────────────────────────────────────────────
  { id: 'irvington-high', name: 'Irvington High School', lat: 37.5182, lng: -121.9629, district: 'Irvington', motifs: ['school', 'flagpole', 'field'] },
  { id: 'kennedy-high', name: 'Kennedy High School', lat: 37.5309, lng: -121.9718, district: 'Irvington', motifs: ['school', 'field', 'oaks'] },
  { id: 'sabercat', name: 'Sabercat Historical Park', lat: 37.5230, lng: -121.9430, district: 'Irvington', motifs: ['ridge', 'creek', 'trail'] },
  { id: 'five-corners', name: 'Five Corners', lat: 37.5170, lng: -121.9640, district: 'Irvington', motifs: ['shops', 'road', 'poles'] },
  { id: 'irvington-plaza', name: 'Irvington Plaza', lat: 37.5160, lng: -121.9660, district: 'Irvington', motifs: ['shops', 'lot', 'poles'] },
  { id: 'irvington-district', name: 'The Irvington district', lat: 37.5200, lng: -121.9600, district: 'Irvington', motifs: ['shops', 'road', 'oaks'] },
  { id: 'washington-hospital', name: 'Washington Hospital', lat: 37.5410, lng: -121.9800, district: 'Irvington', motifs: ['civic', 'lot', 'flagpole'] },
  { id: 'tule-ponds', name: 'Tule Ponds at Tyson Lagoon', lat: 37.5410, lng: -121.9560, district: 'Irvington', motifs: ['pond', 'tules', 'boardwalk'] },

  // ── Centerville ─────────────────────────────────────────────
  { id: 'centerville-depot', name: 'Centerville Depot', lat: 37.5586, lng: -121.9989, district: 'Centerville', motifs: ['depot', 'tracks', 'poles'] },
  { id: 'washington-high', name: 'Washington High School', lat: 37.5477, lng: -121.9855, district: 'Centerville', motifs: ['school', 'flagpole', 'oaks'] },
  { id: 'central-park', name: 'Central Park', lat: 37.5470, lng: -122.0020, district: 'Centerville', motifs: ['water', 'lawn', 'oaks'] },
  { id: 'lake-elizabeth', name: 'Lake Elizabeth', lat: 37.5473, lng: -122.0043, district: 'Centerville', motifs: ['water', 'geese', 'lawn'] },
  { id: 'main-library', name: 'Fremont Main Library', lat: 37.5490, lng: -121.9880, district: 'Centerville', motifs: ['civic', 'lawn', 'flagpole'] },
  { id: 'city-hall', name: 'Fremont City Hall', lat: 37.5482, lng: -121.9886, district: 'Centerville', motifs: ['civic', 'flagpole', 'lawn'] },
  { id: 'fremont-hub', name: 'The Fremont Hub', lat: 37.5510, lng: -121.9880, district: 'Centerville', motifs: ['shops', 'lot', 'poles'] },
  { id: 'fremont-bart', name: 'Fremont BART', lat: 37.5574, lng: -121.9766, district: 'Centerville', motifs: ['guideway', 'train', 'lot'] },
  { id: 'centerville-district', name: 'The Centerville district', lat: 37.5560, lng: -121.9950, district: 'Centerville', motifs: ['shops', 'road', 'poles'] },
  { id: 'shinn-park', name: 'Shinn Historical Park', lat: 37.5637, lng: -122.0113, district: 'Centerville', motifs: ['victorian', 'orchard', 'lawn'] },
  { id: 'downtown-fremont', name: 'Downtown Fremont', lat: 37.5500, lng: -121.9860, district: 'Centerville', motifs: ['civic', 'shops', 'road'] },
  { id: 'capitol-avenue', name: 'Capitol Avenue', lat: 37.5495, lng: -121.9845, district: 'Centerville', motifs: ['shops', 'road', 'lawn'] },
  { id: 'fremont-theatre', name: 'The old Centerville theatre', lat: 37.5570, lng: -121.9940, district: 'Centerville', motifs: ['shops', 'marquee', 'road'] },
  { id: 'centerville-junction', name: 'Centerville Junction', lat: 37.5600, lng: -121.9960, district: 'Centerville', motifs: ['tracks', 'poles', 'warehouse'] },

  // ── Niles ───────────────────────────────────────────────────
  { id: 'essanay-museum', name: 'Niles Essanay Silent Film Museum', lat: 37.5786, lng: -121.9757, district: 'Niles', motifs: ['shops', 'marquee', 'road'] },
  { id: 'niles-depot', name: 'Niles Depot', lat: 37.5793, lng: -121.9709, district: 'Niles', motifs: ['depot', 'tracks', 'watertower'] },
  { id: 'niles-canyon', name: 'Niles Canyon', lat: 37.5836, lng: -121.9382, district: 'Niles', motifs: ['canyon', 'creek', 'tracks'] },
  { id: 'vallejo-mill', name: 'Vallejo Mill Historical Park', lat: 37.5755, lng: -121.9822, district: 'Niles', motifs: ['ruin', 'creek', 'eucalyptus'] },
  { id: 'niles-flea', name: 'The Niles Flea Market', lat: 37.5790, lng: -121.9750, district: 'Niles', motifs: ['shops', 'awnings', 'road'] },
  { id: 'niles-canyon-railway', name: 'The Niles Canyon Railway', lat: 37.5820, lng: -121.9500, district: 'Niles', motifs: ['canyon', 'locomotive', 'tracks'] },
  { id: 'niles-plaza', name: 'Niles Town Plaza', lat: 37.5788, lng: -121.9744, district: 'Niles', motifs: ['plaza', 'shops', 'oaks'] },
  { id: 'niles-boulevard', name: 'Niles Boulevard', lat: 37.5789, lng: -121.9760, district: 'Niles', motifs: ['shops', 'awnings', 'poles'] },
  { id: 'california-nursery', name: 'The California Nursery Historical Park', lat: 37.5740, lng: -121.9830, district: 'Niles', motifs: ['orchard', 'barn', 'eucalyptus'] },
  { id: 'niles-staircase', name: 'The Niles staircase', lat: 37.5800, lng: -121.9720, district: 'Niles', motifs: ['canyon', 'stairs', 'oaks'] },
  { id: 'alameda-creek', name: 'The Alameda Creek Trail', lat: 37.5760, lng: -122.0300, district: 'Niles', motifs: ['creek', 'levee', 'trail'] },
  { id: 'quarry-lakes', name: 'Quarry Lakes', lat: 37.5686, lng: -122.0286, district: 'Niles', motifs: ['water', 'quarry', 'oaks'] },
  { id: 'shinn-pond', name: 'Shinn Pond', lat: 37.5720, lng: -122.0230, district: 'Niles', motifs: ['water', 'quarry', 'tules'] },

  // ── Ardenwood and the bay side ──────────────────────────────
  { id: 'ardenwood', name: 'Ardenwood Historic Farm', lat: 37.5569, lng: -122.0546, district: 'Ardenwood', motifs: ['victorian', 'windmill', 'orchard'] },
  { id: 'patterson-house', name: 'The Patterson House', lat: 37.5573, lng: -122.0552, district: 'Ardenwood', motifs: ['victorian', 'lawn', 'eucalyptus'] },
  { id: 'coyote-hills', name: 'Coyote Hills Regional Park', lat: 37.5578, lng: -122.0928, district: 'Ardenwood', motifs: ['hills', 'marsh', 'boardwalk'] },
  { id: 'coyote-hills-shellmound', name: 'The Coyote Hills shellmound', lat: 37.5560, lng: -122.0960, district: 'Ardenwood', motifs: ['hills', 'mound', 'tules'] },
  { id: 'don-edwards', name: 'Don Edwards Wildlife Refuge', lat: 37.4949, lng: -122.0743, district: 'Ardenwood', motifs: ['saltponds', 'levee', 'birds'] },
  { id: 'dumbarton', name: 'The Dumbarton Bridge', lat: 37.4970, lng: -122.1080, district: 'Ardenwood', motifs: ['bay', 'bridge', 'levee'] },
  { id: 'dumbarton-rail-bridge', name: 'The Dumbarton rail bridge', lat: 37.5020, lng: -122.1150, district: 'Ardenwood', motifs: ['bay', 'trestle', 'tules'] },
  { id: 'american-high', name: 'American High School', lat: 37.5480, lng: -122.0100, district: 'Ardenwood', motifs: ['school', 'flagpole', 'field'] },
  { id: 'ardenwood-forge', name: 'The blacksmith shop at Ardenwood', lat: 37.5565, lng: -122.0540, district: 'Ardenwood', motifs: ['barn', 'forge', 'orchard'] },
  { id: 'ardenwood-railroad', name: 'The Ardenwood horsecar line', lat: 37.5575, lng: -122.0530, district: 'Ardenwood', motifs: ['tracks', 'orchard', 'lawn'] },
  { id: 'ardenwood-boulevard', name: 'Ardenwood Boulevard', lat: 37.5540, lng: -122.0560, district: 'Ardenwood', motifs: ['road', 'eucalyptus', 'poles'] },
  { id: 'pacific-commons', name: 'Pacific Commons', lat: 37.4970, lng: -121.9660, district: 'Ardenwood', motifs: ['shops', 'lot', 'marsh'] },
  { id: 'fremont-marsh', name: 'The Fremont marshlands', lat: 37.5150, lng: -122.0700, district: 'Ardenwood', motifs: ['marsh', 'tules', 'birds'] },
  { id: 'salt-ponds', name: 'The salt ponds', lat: 37.5050, lng: -122.0900, district: 'Ardenwood', motifs: ['saltponds', 'levee', 'bay'] },
  { id: 'coyote-hills-boardwalk', name: 'The Coyote Hills boardwalk', lat: 37.5600, lng: -122.0900, district: 'Ardenwood', motifs: ['marsh', 'boardwalk', 'tules'] },

  // ── The hills and the back country ──────────────────────────
  { id: 'mission-ridge', name: 'The Mission ridge', lat: 37.5200, lng: -121.8900, district: 'The hills', motifs: ['peak', 'ridge', 'grass'] },
  { id: 'ohlone-wilderness', name: 'The Ohlone Wilderness Trail', lat: 37.5100, lng: -121.8500, district: 'The hills', motifs: ['ridge', 'trail', 'oaks'] },
  { id: 'mill-creek-road', name: 'Mill Creek Road', lat: 37.5400, lng: -121.8900, district: 'The hills', motifs: ['canyon', 'creek', 'oaks'] },
  { id: 'sunol-ridge', name: 'The Sunol ridge', lat: 37.5950, lng: -121.8700, district: 'The hills', motifs: ['ridge', 'grass', 'oaks'] },
  { id: 'vargas-plateau', name: 'Vargas Plateau', lat: 37.5670, lng: -121.9070, district: 'The hills', motifs: ['ridge', 'grass', 'gate'] },
  { id: 'morrison-canyon', name: 'Morrison Canyon Road', lat: 37.5580, lng: -121.9180, district: 'The hills', motifs: ['canyon', 'oaks', 'road'] },
  { id: 'niles-canyon-narrows', name: 'The narrows in Niles Canyon', lat: 37.5850, lng: -121.9250, district: 'The hills', motifs: ['canyon', 'creek', 'trestle'] },
  { id: 'alameda-creek-quarry', name: 'The creek quarries', lat: 37.5750, lng: -122.0100, district: 'The hills', motifs: ['quarry', 'creek', 'gravel'] },

  // ── Around the edges ────────────────────────────────────────
  { id: 'newark', name: 'Newark', lat: 37.5297, lng: -122.0402, district: 'Next door', motifs: ['shops', 'road', 'marsh'] },
  { id: 'union-city', name: 'Union City', lat: 37.5934, lng: -122.0438, district: 'Next door', motifs: ['guideway', 'shops', 'road'] },
  { id: 'milpitas', name: 'Milpitas', lat: 37.4323, lng: -121.8996, district: 'Next door', motifs: ['warehouse', 'road', 'hills'] },
  { id: 'hayward', name: 'Hayward', lat: 37.6688, lng: -122.0808, district: 'Next door', motifs: ['civic', 'shops', 'hills'] },
  { id: 'sunol', name: 'Sunol', lat: 37.5946, lng: -121.8858, district: 'Next door', motifs: ['depot', 'oaks', 'creek'] },
  { id: 'decoto', name: 'Decoto', lat: 37.5880, lng: -122.0230, district: 'Next door', motifs: ['tracks', 'shops', 'road'] },
  { id: 'alvarado', name: 'Alvarado', lat: 37.5980, lng: -122.0530, district: 'Next door', motifs: ['victorian', 'creek', 'road'] },
  { id: 'niles-junction', name: 'Niles Junction', lat: 37.5810, lng: -121.9800, district: 'Next door', motifs: ['tracks', 'poles', 'watertower'] },

  // ── Schools, parks and streets people actually name ─────────
  { id: 'horner-middle', name: 'Horner Middle School', lat: 37.5330, lng: -121.9880, district: 'Around town', motifs: ['school', 'field', 'flagpole'] },
  { id: 'thornton-middle', name: 'Thornton Middle School', lat: 37.5590, lng: -122.0180, district: 'Around town', motifs: ['school', 'field', 'oaks'] },
  { id: 'centerville-middle', name: 'Centerville Middle School', lat: 37.5560, lng: -121.9880, district: 'Around town', motifs: ['school', 'flagpole', 'lawn'] },
  { id: 'hopkins-middle', name: 'Hopkins Junior High', lat: 37.5250, lng: -121.9330, district: 'Around town', motifs: ['school', 'field', 'oaks'] },
  { id: 'walters-middle', name: 'Walters Middle School', lat: 37.4960, lng: -121.9600, district: 'Around town', motifs: ['school', 'lawn', 'flagpole'] },
  { id: 'robertson-high', name: 'Robertson High School', lat: 37.5450, lng: -121.9800, district: 'Around town', motifs: ['school', 'lot', 'flagpole'] },
  { id: 'mission-boulevard', name: 'Mission Boulevard', lat: 37.5400, lng: -121.9500, district: 'Around town', motifs: ['road', 'poles', 'ridge'] },
  { id: 'fremont-boulevard', name: 'Fremont Boulevard', lat: 37.5400, lng: -121.9900, district: 'Around town', motifs: ['road', 'shops', 'poles'] },
  { id: 'paseo-padre', name: 'Paseo Padre Parkway', lat: 37.5450, lng: -121.9750, district: 'Around town', motifs: ['road', 'eucalyptus', 'lawn'] },
  { id: 'mowry-avenue', name: 'Mowry Avenue', lat: 37.5470, lng: -122.0000, district: 'Around town', motifs: ['road', 'shops', 'poles'] },
  { id: 'stevenson-boulevard', name: 'Stevenson Boulevard', lat: 37.5330, lng: -121.9860, district: 'Around town', motifs: ['road', 'lawn', 'poles'] },
  { id: 'grimmer-boulevard', name: 'Grimmer Boulevard', lat: 37.5140, lng: -121.9450, district: 'Around town', motifs: ['road', 'tract', 'poles'] },
  { id: 'walnut-avenue', name: 'Walnut Avenue', lat: 37.5490, lng: -121.9900, district: 'Around town', motifs: ['road', 'lawn', 'oaks'] },
  { id: 'thornton-avenue', name: 'Thornton Avenue', lat: 37.5590, lng: -122.0400, district: 'Around town', motifs: ['road', 'shops', 'marsh'] },
  { id: 'decoto-road', name: 'Decoto Road', lat: 37.5800, lng: -122.0200, district: 'Around town', motifs: ['road', 'tracks', 'poles'] },
  { id: 'peralta-boulevard', name: 'Peralta Boulevard', lat: 37.5610, lng: -122.0030, district: 'Around town', motifs: ['road', 'lawn', 'shops'] },
  { id: 'niles-boulevard-east', name: 'The east end of Niles Boulevard', lat: 37.5800, lng: -121.9680, district: 'Around town', motifs: ['canyon', 'road', 'creek'] },
  { id: 'lake-elizabeth-dock', name: 'The Lake Elizabeth boat dock', lat: 37.5468, lng: -122.0050, district: 'Around town', motifs: ['water', 'dock', 'lawn'] },
  { id: 'central-park-fountain', name: 'The Central Park fountain', lat: 37.5480, lng: -122.0010, district: 'Around town', motifs: ['lawn', 'fountain', 'oaks'] },
  { id: 'aqua-adventure', name: 'Aqua Adventure', lat: 37.5455, lng: -122.0035, district: 'Around town', motifs: ['water', 'lawn', 'poles'] },
  { id: 'fremont-festival', name: 'Where the street festival sets up', lat: 37.5497, lng: -121.9850, district: 'Around town', motifs: ['awnings', 'road', 'shops'] },
  { id: 'irvington-community-park', name: 'Irvington Community Park', lat: 37.5150, lng: -121.9700, district: 'Around town', motifs: ['field', 'lawn', 'oaks'] },
  { id: 'mission-hills-park', name: 'Mission Hills', lat: 37.5300, lng: -121.9100, district: 'Around town', motifs: ['ridge', 'tract', 'oaks'] },
  { id: 'glenmoor', name: 'Glenmoor', lat: 37.5480, lng: -122.0050, district: 'Around town', motifs: ['tract', 'lawn', 'oaks'] },
  { id: 'brookvale', name: 'Brookvale', lat: 37.5330, lng: -122.0000, district: 'Around town', motifs: ['tract', 'lawn', 'road'] },
  { id: 'cabrillo', name: 'Cabrillo', lat: 37.5620, lng: -122.0080, district: 'Around town', motifs: ['tract', 'road', 'lawn'] },
  { id: 'parkmont', name: 'Parkmont', lat: 37.5540, lng: -121.9700, district: 'Around town', motifs: ['tract', 'lawn', 'oaks'] },
  { id: 'sundale-park', name: 'Sundale Park', lat: 37.5090, lng: -121.9720, district: 'Around town', motifs: ['field', 'lawn', 'playground'] },
]

export const placeById = (id) => PLACES.find((p) => p.id === id)

export const PLACE_COUNT = PLACES.length
