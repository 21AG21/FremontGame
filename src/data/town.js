// ─────────────────────────────────────────────────────────────
//  FREMONT, CALIFORNIA
//
//  Coordinates are close enough for the distance-and-bearing
//  hints to read true. If you want them exact, right-click any
//  spot in a map app and paste the real pair in.
// ─────────────────────────────────────────────────────────────

export const TOWN = {
  name: 'Fremont',
  state: 'California',
  // Incorporated 23 January 1956 out of five townships.
  founded: 1956,
  center: { lat: 37.5485, lng: -121.9886 },
}

export const PLACES = [
  // ── Mission San José district ──
  { id: 'mission-san-jose', name: 'Mission San José', lat: 37.5344, lng: -121.9199 },
  { id: 'ohlone-college', name: 'Ohlone College', lat: 37.5330, lng: -121.9170 },
  { id: 'msj-high', name: 'Mission San Jose High School', lat: 37.5290, lng: -121.9210 },
  { id: 'palmdale-estates', name: 'Palmdale Estates', lat: 37.5350, lng: -121.9260 },
  { id: 'mission-peak', name: 'Mission Peak', lat: 37.5124, lng: -121.8802 },

  // ── Niles ──
  { id: 'essanay-museum', name: 'Niles Essanay Silent Film Museum', lat: 37.5786, lng: -121.9757 },
  { id: 'niles-depot', name: 'Niles Depot', lat: 37.5793, lng: -121.9709 },
  { id: 'niles-canyon', name: 'Niles Canyon', lat: 37.5836, lng: -121.9382 },
  { id: 'vallejo-mill', name: 'Vallejo Mill Historical Park', lat: 37.5755, lng: -121.9822 },
  { id: 'niles-flea', name: 'The Niles Flea Market', lat: 37.5790, lng: -121.9750 },

  // ── Centerville ──
  { id: 'centerville-depot', name: 'Centerville Depot', lat: 37.5586, lng: -121.9989 },
  { id: 'washington-high', name: 'Washington High School', lat: 37.5477, lng: -121.9855 },
  { id: 'shinn-park', name: 'Shinn Historical Park', lat: 37.5637, lng: -122.0113 },
  { id: 'central-park', name: 'Central Park', lat: 37.5470, lng: -122.0020 },
  { id: 'lake-elizabeth', name: 'Lake Elizabeth', lat: 37.5473, lng: -122.0043 },
  { id: 'main-library', name: 'Fremont Main Library', lat: 37.5490, lng: -121.9880 },
  { id: 'fremont-hub', name: 'The Fremont Hub', lat: 37.5510, lng: -121.9880 },
  { id: 'fremont-bart', name: 'Fremont BART', lat: 37.5574, lng: -121.9766 },

  // ── Irvington ──
  { id: 'irvington-high', name: 'Irvington High School', lat: 37.5182, lng: -121.9629 },
  { id: 'kennedy-high', name: 'Kennedy High School', lat: 37.5309, lng: -121.9718 },
  { id: 'sabercat', name: 'Sabercat Historical Park', lat: 37.5230, lng: -121.9430 },

  // ── Warm Springs ──
  { id: 'tesla-factory', name: 'The Fremont Assembly Plant', lat: 37.4936, lng: -121.9450 },
  { id: 'warm-springs-bart', name: 'Warm Springs BART', lat: 37.5022, lng: -121.9394 },

  // ── West side / the bay ──
  { id: 'ardenwood', name: 'Ardenwood Historic Farm', lat: 37.5569, lng: -122.0546 },
  { id: 'coyote-hills', name: 'Coyote Hills Regional Park', lat: 37.5578, lng: -122.0928 },
  { id: 'quarry-lakes', name: 'Quarry Lakes', lat: 37.5686, lng: -122.0286 },
  { id: 'don-edwards', name: 'Don Edwards Wildlife Refuge', lat: 37.4949, lng: -122.0743 },
  { id: 'dumbarton', name: 'The Dumbarton Bridge', lat: 37.4970, lng: -122.1080 },
  { id: 'american-high', name: 'American High School', lat: 37.5480, lng: -122.0100 },
  { id: 'alameda-creek', name: 'The Alameda Creek Trail', lat: 37.5760, lng: -122.0300 },
]

export const placeById = (id) => PLACES.find((p) => p.id === id)
