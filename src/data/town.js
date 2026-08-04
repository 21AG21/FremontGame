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

export const PLACES = [
  // ── Mission San José ────────────────────────────────────────
  { id: 'mission-san-jose', name: 'Mission San José', lat: 37.5344, lng: -121.9199, district: 'Mission San José', motifs: ['ridge', 'mission', 'olives', 'road'], fame: 1 },
  { id: 'ohlone-college', name: 'Ohlone College', lat: 37.5330, lng: -121.9170, district: 'Mission San José', motifs: ['ridge', 'civic', 'dome', 'oaks'], fame: 1 },
  { id: 'msj-high', name: 'Mission San Jose High School', lat: 37.5290, lng: -121.9210, district: 'Mission San José', motifs: ['school', 'flagpole', 'field'], fame: 1 },
  { id: 'palmdale-estates', name: 'Palmdale Estates', lat: 37.5350, lng: -121.9260, district: 'Mission San José', motifs: ['palms', 'victorian', 'lawn'], fame: 2 },
  { id: 'mission-peak', name: 'Mission Peak', lat: 37.5124, lng: -121.8802, district: 'Mission San José', motifs: ['peak', 'grass', 'post'], fame: 1 },
  { id: 'mission-peak-trailhead', name: 'The Stanford Avenue Trailhead', lat: 37.5100, lng: -121.9060, district: 'Mission San José', motifs: ['peak', 'gate', 'trail'], fame: 3 },
  { id: 'monument-peak', name: 'Monument Peak', lat: 37.4570, lng: -121.8680, district: 'The hills', motifs: ['peak', 'towers', 'grass'], fame: 2 },
  { id: 'olive-hyde', name: 'The Olive Hyde Art Gallery', lat: 37.5352, lng: -121.9256, district: 'Mission San José', motifs: ['victorian', 'olives', 'lawn'], fame: 2 },
  { id: 'weibel', name: 'The old Weibel winery grounds', lat: 37.5180, lng: -121.9060, district: 'Mission San José', motifs: ['ridge', 'vines', 'barn'], fame: 3 },
  { id: 'msj-cemetery', name: 'The Mission San José Cemetery', lat: 37.5360, lng: -121.9210, district: 'Mission San José', motifs: ['ridge', 'stones', 'olives'], fame: 3 },
  { id: 'chadbourne', name: 'Chadbourne Elementary', lat: 37.5250, lng: -121.9280, district: 'Mission San José', motifs: ['school', 'field', 'oaks'], fame: 2 },
  { id: 'gomes-park', name: 'Gomes Park', lat: 37.5230, lng: -121.9180, district: 'Mission San José', motifs: ['field', 'oaks', 'playground'], fame: 2 },

  // ── Warm Springs ────────────────────────────────────────────
  { id: 'tesla-factory', name: 'The Fremont Assembly Plant', lat: 37.4936, lng: -121.9450, district: 'Warm Springs', motifs: ['factory', 'stacks', 'lot'], fame: 1 },
  { id: 'warm-springs-bart', name: 'Warm Springs BART', lat: 37.5022, lng: -121.9394, district: 'Warm Springs', motifs: ['guideway', 'train', 'lot'], fame: 1 },
  { id: 'warm-springs-district', name: 'The Warm Springs district', lat: 37.4900, lng: -121.9350, district: 'Warm Springs', motifs: ['ridge', 'warehouse', 'road'], fame: 1 },
  { id: 'warm-springs-center', name: 'The Warm Springs Community Center', lat: 37.4870, lng: -121.9330, district: 'Warm Springs', motifs: ['civic', 'lawn', 'oaks'], fame: 3 },
  { id: 'higuera', name: 'The Higuera adobe site', lat: 37.4790, lng: -121.9180, district: 'Warm Springs', motifs: ['ridge', 'adobe', 'oaks'], fame: 3 },
  { id: 'kato-road', name: 'Kato Road', lat: 37.4830, lng: -121.9280, district: 'Warm Springs', motifs: ['warehouse', 'road', 'poles'], fame: 3 },
  { id: 'agua-caliente', name: 'The Agua Caliente springs', lat: 37.4880, lng: -121.9240, district: 'Warm Springs', motifs: ['ridge', 'pond', 'tules'], fame: 3 },

  // ── Irvington ───────────────────────────────────────────────
  { id: 'irvington-high', name: 'Irvington High School', lat: 37.5182, lng: -121.9629, district: 'Irvington', motifs: ['school', 'flagpole', 'field'], fame: 1 },
  { id: 'kennedy-high', name: 'Kennedy High School', lat: 37.5309, lng: -121.9718, district: 'Irvington', motifs: ['school', 'field', 'oaks'], fame: 1 },
  { id: 'sabercat', name: 'Sabercat Historical Park', lat: 37.5230, lng: -121.9430, district: 'Irvington', motifs: ['ridge', 'creek', 'trail'], fame: 2 },
  { id: 'five-corners', name: 'Five Corners', lat: 37.5170, lng: -121.9640, district: 'Irvington', motifs: ['shops', 'road', 'poles'], fame: 2 },
  { id: 'irvington-plaza', name: 'Irvington Plaza', lat: 37.5160, lng: -121.9660, district: 'Irvington', motifs: ['shops', 'lot', 'poles'], fame: 2 },
  { id: 'irvington-district', name: 'The Irvington district', lat: 37.5200, lng: -121.9600, district: 'Irvington', motifs: ['shops', 'road', 'oaks'], fame: 1 },
  { id: 'washington-hospital', name: 'Washington Hospital', lat: 37.5455, lng: -121.9855, district: 'Centerville', motifs: ['civic', 'lot', 'flagpole'], fame: 2 },
  { id: 'tule-ponds', name: 'Tule Ponds at Tyson Lagoon', lat: 37.5525, lng: -121.9720, district: 'Centerville', motifs: ['pond', 'tules', 'boardwalk'], fame: 2 },

  // ── Centerville ─────────────────────────────────────────────
  { id: 'centerville-depot', name: 'Centerville Depot', lat: 37.5586, lng: -121.9989, district: 'Centerville', motifs: ['depot', 'tracks', 'poles'], fame: 1 },
  { id: 'washington-high', name: 'Washington High School', lat: 37.5477, lng: -121.9855, district: 'Centerville', motifs: ['school', 'flagpole', 'oaks'], fame: 1 },
  { id: 'central-park', name: 'Central Park', lat: 37.5470, lng: -122.0020, district: 'Centerville', motifs: ['water', 'lawn', 'oaks'], fame: 1 },
  { id: 'lake-elizabeth', name: 'Lake Elizabeth', lat: 37.5473, lng: -122.0043, district: 'Centerville', motifs: ['water', 'geese', 'lawn'], fame: 1 },
  { id: 'main-library', name: 'Fremont Main Library', lat: 37.5490, lng: -121.9880, district: 'Centerville', motifs: ['civic', 'lawn', 'flagpole'], fame: 1 },
  { id: 'city-hall', name: 'Fremont City Hall', lat: 37.5482, lng: -121.9886, district: 'Centerville', motifs: ['civic', 'flagpole', 'lawn'], fame: 1 },
  { id: 'fremont-hub', name: 'The Fremont Hub', lat: 37.5510, lng: -121.9880, district: 'Centerville', motifs: ['shops', 'lot', 'poles'], fame: 1 },
  { id: 'fremont-bart', name: 'Fremont BART', lat: 37.5574, lng: -121.9766, district: 'Centerville', motifs: ['guideway', 'train', 'lot'], fame: 1 },
  { id: 'centerville-district', name: 'The Centerville district', lat: 37.5560, lng: -121.9950, district: 'Centerville', motifs: ['shops', 'road', 'poles'], fame: 1 },
  { id: 'shinn-park', name: 'Shinn Historical Park', lat: 37.5637, lng: -122.0113, district: 'Centerville', motifs: ['victorian', 'orchard', 'lawn'], fame: 1 },
  { id: 'downtown-fremont', name: 'Downtown Fremont', lat: 37.5500, lng: -121.9860, district: 'Centerville', motifs: ['civic', 'shops', 'road'], fame: 1 },
  { id: 'capitol-avenue', name: 'Capitol Avenue', lat: 37.5495, lng: -121.9845, district: 'Centerville', motifs: ['shops', 'road', 'lawn'], fame: 2 },
  { id: 'fremont-theatre', name: 'The old Centerville theatre', lat: 37.5570, lng: -121.9940, district: 'Centerville', motifs: ['shops', 'marquee', 'road'], fame: 2 },
  { id: 'centerville-junction', name: 'Centerville Junction', lat: 37.5600, lng: -121.9960, district: 'Centerville', motifs: ['tracks', 'poles', 'warehouse'], fame: 3 },

  // ── Niles ───────────────────────────────────────────────────
  { id: 'essanay-museum', name: 'Niles Essanay Silent Film Museum', lat: 37.5786, lng: -121.9757, district: 'Niles', motifs: ['shops', 'marquee', 'road'], fame: 1 },
  { id: 'niles-depot', name: 'Niles Depot', lat: 37.5793, lng: -121.9709, district: 'Niles', motifs: ['depot', 'tracks', 'watertower'], fame: 1 },
  { id: 'niles-canyon', name: 'Niles Canyon', lat: 37.5836, lng: -121.9382, district: 'Niles', motifs: ['canyon', 'creek', 'tracks'], fame: 1 },
  { id: 'vallejo-mill', name: 'Vallejo Mill Historical Park', lat: 37.5755, lng: -121.9822, district: 'Niles', motifs: ['ruin', 'creek', 'eucalyptus'], fame: 1 },
  { id: 'niles-flea', name: 'The Niles Flea Market', lat: 37.5790, lng: -121.9750, district: 'Niles', motifs: ['shops', 'awnings', 'road'], fame: 3 },
  { id: 'niles-canyon-railway', name: 'The Niles Canyon Railway', lat: 37.5820, lng: -121.9500, district: 'Niles', motifs: ['canyon', 'locomotive', 'tracks'], fame: 1 },
  { id: 'niles-plaza', name: 'Niles Town Plaza', lat: 37.5788, lng: -121.9744, district: 'Niles', motifs: ['plaza', 'shops', 'oaks'], fame: 3 },
  { id: 'niles-boulevard', name: 'Niles Boulevard', lat: 37.5789, lng: -121.9760, district: 'Niles', motifs: ['shops', 'awnings', 'poles'], fame: 1 },
  { id: 'california-nursery', name: 'The California Nursery Historical Park', lat: 37.5740, lng: -121.9830, district: 'Niles', motifs: ['orchard', 'barn', 'eucalyptus'], fame: 2 },
  { id: 'niles-staircase', name: 'The Niles staircase', lat: 37.5800, lng: -121.9720, district: 'Niles', motifs: ['canyon', 'stairs', 'oaks'], fame: 3 },
  { id: 'alameda-creek', name: 'The Alameda Creek Trail', lat: 37.5760, lng: -122.0300, district: 'Niles', motifs: ['creek', 'levee', 'trail'], fame: 1 },
  { id: 'quarry-lakes', name: 'Quarry Lakes', lat: 37.5686, lng: -122.0286, district: 'Niles', motifs: ['water', 'quarry', 'oaks'], fame: 1 },
  { id: 'shinn-pond', name: 'Shinn Pond', lat: 37.5720, lng: -122.0230, district: 'Niles', motifs: ['water', 'quarry', 'tules'], fame: 3 },

  // ── Ardenwood and the bay side ──────────────────────────────
  { id: 'ardenwood', name: 'Ardenwood Historic Farm', lat: 37.5569, lng: -122.0546, district: 'Ardenwood', motifs: ['victorian', 'windmill', 'orchard'], fame: 1 },
  { id: 'patterson-house', name: 'The Patterson House', lat: 37.5573, lng: -122.0552, district: 'Ardenwood', motifs: ['victorian', 'lawn', 'eucalyptus'], fame: 3 },
  { id: 'coyote-hills', name: 'Coyote Hills Regional Park', lat: 37.5578, lng: -122.0928, district: 'Ardenwood', motifs: ['hills', 'marsh', 'boardwalk'], fame: 1 },
  { id: 'coyote-hills-shellmound', name: 'The Coyote Hills shellmound', lat: 37.5560, lng: -122.0960, district: 'Ardenwood', motifs: ['hills', 'mound', 'tules'], fame: 3 },
  { id: 'don-edwards', name: 'Don Edwards Wildlife Refuge', lat: 37.4949, lng: -122.0743, district: 'Ardenwood', motifs: ['saltponds', 'levee', 'birds'], fame: 1 },
  { id: 'dumbarton', name: 'The Dumbarton Bridge', lat: 37.4970, lng: -122.1080, district: 'Ardenwood', motifs: ['bay', 'bridge', 'levee'], fame: 1 },
  { id: 'dumbarton-rail-bridge', name: 'The Dumbarton rail bridge', lat: 37.5020, lng: -122.1150, district: 'Ardenwood', motifs: ['bay', 'trestle', 'tules'], fame: 3 },
  { id: 'american-high', name: 'American High School', lat: 37.5480, lng: -122.0100, district: 'Ardenwood', motifs: ['school', 'flagpole', 'field'], fame: 1 },
  { id: 'ardenwood-forge', name: 'The blacksmith shop at Ardenwood', lat: 37.5565, lng: -122.0540, district: 'Ardenwood', motifs: ['barn', 'forge', 'orchard'], fame: 3 },
  { id: 'ardenwood-railroad', name: 'The Ardenwood horsecar line', lat: 37.5575, lng: -122.0530, district: 'Ardenwood', motifs: ['tracks', 'orchard', 'lawn'], fame: 3 },
  { id: 'ardenwood-boulevard', name: 'Ardenwood Boulevard', lat: 37.5540, lng: -122.0560, district: 'Ardenwood', motifs: ['road', 'eucalyptus', 'poles'], fame: 2 },
  { id: 'pacific-commons', name: 'Pacific Commons', lat: 37.4970, lng: -121.9660, district: 'Warm Springs', motifs: ['shops', 'lot', 'marsh'], fame: 1 },
  { id: 'fremont-marsh', name: 'The Fremont marshlands', lat: 37.5150, lng: -122.0700, district: 'Ardenwood', motifs: ['marsh', 'tules', 'birds'], fame: 3 },
  { id: 'salt-ponds', name: 'The salt ponds', lat: 37.5050, lng: -122.0900, district: 'Ardenwood', motifs: ['saltponds', 'levee', 'bay'], fame: 2 },
  { id: 'coyote-hills-boardwalk', name: 'The Coyote Hills boardwalk', lat: 37.5600, lng: -122.0900, district: 'Ardenwood', motifs: ['marsh', 'boardwalk', 'tules'], fame: 2 },

  // ── The hills and the back country ──────────────────────────
  { id: 'mission-ridge', name: 'The Mission ridge', lat: 37.5200, lng: -121.8900, district: 'The hills', motifs: ['peak', 'ridge', 'grass'], fame: 3 },
  { id: 'ohlone-wilderness', name: 'The Ohlone Wilderness Trail', lat: 37.5100, lng: -121.8500, district: 'The hills', motifs: ['ridge', 'trail', 'oaks'], fame: 3 },
  { id: 'mill-creek-road', name: 'Mill Creek Road', lat: 37.5400, lng: -121.8900, district: 'The hills', motifs: ['canyon', 'creek', 'oaks'], fame: 3 },
  { id: 'sunol-ridge', name: 'The Sunol ridge', lat: 37.5950, lng: -121.8700, district: 'The hills', motifs: ['ridge', 'grass', 'oaks'], fame: 3 },
  { id: 'vargas-plateau', name: 'Vargas Plateau', lat: 37.5670, lng: -121.9070, district: 'The hills', motifs: ['ridge', 'grass', 'gate'], fame: 3 },
  { id: 'morrison-canyon', name: 'Morrison Canyon Road', lat: 37.5580, lng: -121.9180, district: 'The hills', motifs: ['canyon', 'oaks', 'road'], fame: 3 },
  { id: 'niles-canyon-narrows', name: 'The narrows in Niles Canyon', lat: 37.5850, lng: -121.9250, district: 'The hills', motifs: ['canyon', 'creek', 'trestle'], fame: 3 },
  { id: 'alameda-creek-quarry', name: 'The creek quarries', lat: 37.5750, lng: -122.0100, district: 'The hills', motifs: ['quarry', 'creek', 'gravel'], fame: 3 },

  // ── Around the edges ────────────────────────────────────────
  { id: 'newark', name: 'Newark', lat: 37.5297, lng: -122.0402, district: 'Next door', motifs: ['shops', 'road', 'marsh'], fame: 2 },
  { id: 'union-city', name: 'Union City', lat: 37.5934, lng: -122.0438, district: 'Next door', motifs: ['guideway', 'shops', 'road'], fame: 2 },
  { id: 'milpitas', name: 'Milpitas', lat: 37.4323, lng: -121.8996, district: 'Next door', motifs: ['warehouse', 'road', 'hills'], fame: 2 },
  { id: 'hayward', name: 'Hayward', lat: 37.6688, lng: -122.0808, district: 'Next door', motifs: ['civic', 'shops', 'hills'], fame: 2 },
  { id: 'sunol', name: 'Sunol', lat: 37.5946, lng: -121.8858, district: 'Next door', motifs: ['depot', 'oaks', 'creek'], fame: 2 },
  { id: 'decoto', name: 'Decoto', lat: 37.5880, lng: -122.0230, district: 'Next door', motifs: ['tracks', 'shops', 'road'], fame: 2 },
  { id: 'alvarado', name: 'Alvarado', lat: 37.5980, lng: -122.0530, district: 'Next door', motifs: ['victorian', 'creek', 'road'], fame: 2 },
  { id: 'niles-junction', name: 'Niles Junction', lat: 37.5810, lng: -121.9800, district: 'Niles', motifs: ['tracks', 'poles', 'watertower'], fame: 3 },

  // ── Schools, parks and streets people actually name ─────────
  { id: 'horner-middle', name: 'Horner Middle School', lat: 37.5330, lng: -121.9880, district: 'Around town', motifs: ['school', 'field', 'flagpole'], fame: 2 },
  { id: 'thornton-middle', name: 'Thornton Middle School', lat: 37.5590, lng: -122.0180, district: 'Around town', motifs: ['school', 'field', 'oaks'], fame: 2 },
  { id: 'centerville-middle', name: 'Centerville Middle School', lat: 37.5560, lng: -121.9880, district: 'Around town', motifs: ['school', 'flagpole', 'lawn'], fame: 2 },
  { id: 'hopkins-middle', name: 'Hopkins Middle School', lat: 37.5250, lng: -121.9330, district: 'Around town', motifs: ['school', 'field', 'oaks'], fame: 2 },
  { id: 'walters-middle', name: 'Walters Middle School', lat: 37.4960, lng: -121.9600, district: 'Around town', motifs: ['school', 'lawn', 'flagpole'], fame: 2 },
  { id: 'robertson-high', name: 'Robertson High School', lat: 37.5450, lng: -121.9800, district: 'Around town', motifs: ['school', 'lot', 'flagpole'], fame: 2 },
  { id: 'mission-boulevard', name: 'Mission Boulevard', lat: 37.5400, lng: -121.9500, district: 'Around town', motifs: ['road', 'poles', 'ridge'], fame: 1 },
  { id: 'fremont-boulevard', name: 'Fremont Boulevard', lat: 37.5400, lng: -121.9900, district: 'Around town', motifs: ['road', 'shops', 'poles'], fame: 1 },
  { id: 'paseo-padre', name: 'Paseo Padre Parkway', lat: 37.5450, lng: -121.9750, district: 'Around town', motifs: ['road', 'eucalyptus', 'lawn'], fame: 1 },
  { id: 'mowry-avenue', name: 'Mowry Avenue', lat: 37.5470, lng: -122.0000, district: 'Around town', motifs: ['road', 'shops', 'poles'], fame: 1 },
  { id: 'stevenson-boulevard', name: 'Stevenson Boulevard', lat: 37.5330, lng: -121.9860, district: 'Around town', motifs: ['road', 'lawn', 'poles'], fame: 1 },
  { id: 'grimmer-boulevard', name: 'Grimmer Boulevard', lat: 37.5140, lng: -121.9450, district: 'Around town', motifs: ['road', 'tract', 'poles'], fame: 2 },
  { id: 'walnut-avenue', name: 'Walnut Avenue', lat: 37.5490, lng: -121.9900, district: 'Around town', motifs: ['road', 'lawn', 'oaks'], fame: 2 },
  { id: 'thornton-avenue', name: 'Thornton Avenue', lat: 37.5590, lng: -122.0400, district: 'Around town', motifs: ['road', 'shops', 'marsh'], fame: 1 },
  { id: 'decoto-road', name: 'Decoto Road', lat: 37.5800, lng: -122.0200, district: 'Around town', motifs: ['road', 'tracks', 'poles'], fame: 1 },
  { id: 'peralta-boulevard', name: 'Peralta Boulevard', lat: 37.5610, lng: -122.0030, district: 'Around town', motifs: ['road', 'lawn', 'shops'], fame: 2 },
  { id: 'niles-boulevard-east', name: 'The east end of Niles Boulevard', lat: 37.5800, lng: -121.9680, district: 'Around town', motifs: ['canyon', 'road', 'creek'], fame: 2 },
  { id: 'lake-elizabeth-dock', name: 'The Lake Elizabeth boat dock', lat: 37.5468, lng: -122.0050, district: 'Around town', motifs: ['water', 'dock', 'lawn'], fame: 3 },
  { id: 'central-park-fountain', name: 'The Central Park fountain', lat: 37.5480, lng: -122.0010, district: 'Around town', motifs: ['lawn', 'fountain', 'oaks'], fame: 3 },
  { id: 'aqua-adventure', name: 'Aqua Adventure', lat: 37.5455, lng: -122.0035, district: 'Around town', motifs: ['water', 'lawn', 'poles'], fame: 3 },
  { id: 'fremont-festival', name: 'Where the street festival sets up', lat: 37.5497, lng: -121.9850, district: 'Around town', motifs: ['awnings', 'road', 'shops'], fame: 3 },
  { id: 'irvington-community-park', name: 'Irvington Community Park', lat: 37.5150, lng: -121.9700, district: 'Around town', motifs: ['field', 'lawn', 'oaks'], fame: 2 },
  { id: 'mission-hills-park', name: 'Mission Hills', lat: 37.5300, lng: -121.9100, district: 'Around town', motifs: ['ridge', 'tract', 'oaks'], fame: 2 },
  { id: 'glenmoor', name: 'Glenmoor', lat: 37.5535, lng: -121.9985, district: 'Around town', motifs: ['tract', 'lawn', 'oaks'], fame: 2 },
  { id: 'brookvale', name: 'Brookvale', lat: 37.5330, lng: -122.0000, district: 'Around town', motifs: ['tract', 'lawn', 'road'], fame: 2 },
  { id: 'cabrillo', name: 'Cabrillo', lat: 37.5620, lng: -122.0080, district: 'Around town', motifs: ['tract', 'road', 'lawn'], fame: 2 },
  { id: 'parkmont', name: 'Parkmont', lat: 37.5540, lng: -121.9700, district: 'Around town', motifs: ['tract', 'lawn', 'oaks'], fame: 2 },
  { id: 'sundale-park', name: 'Sundale Park', lat: 37.5090, lng: -121.9720, district: 'Around town', motifs: ['field', 'lawn', 'playground'], fame: 2 },
]

export const placeById = (id) => PLACES.find((p) => p.id === id)

export const PLACE_COUNT = PLACES.length
