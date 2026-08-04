// Distance + bearing between two lat/lng points.
// Used for the "1.4 mi northeast" hint after a wrong guess in the Zoom puzzle.

const R_MILES = 3958.8

const toRad = (d) => (d * Math.PI) / 180
const toDeg = (r) => (r * 180) / Math.PI

export function distanceMiles(a, b) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * R_MILES * Math.asin(Math.sqrt(h))
}

export function bearingDegrees(a, b) {
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const dLng = toRad(b.lng - a.lng)

  const y = Math.sin(dLng) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

const COMPASS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']

export function compassFrom(degrees) {
  return { label: COMPASS[Math.round(degrees / 45) % 8] }
}

export function formatDistance(miles) {
  if (miles < 0.1) return 'right there'
  if (miles < 1) return `${Math.round(miles * 5280 / 100) * 100} ft`
  return `${miles.toFixed(1)} mi`
}

// How "warm" a guess is, 0 (cold) to 1 (basically on top of it).
// Anything past 6 miles reads as fully cold in a town-sized game.
export function warmth(miles) {
  return Math.max(0, Math.min(1, 1 - miles / 6))
}

// "7.5 mi east" assumes a map of Fremont in your head, in miles, with
// compass bearings. Plenty of people who live here do not have that,
// and for them the hint teaches nothing — the same blind guess, five
// times. One word in front of it gives everyone something to act on.
export function warmthWord(miles) {
  if (miles < 0.4) return 'Almost'
  if (miles < 1.2) return 'Hot'
  if (miles < 2.5) return 'Warm'
  if (miles < 5) return 'Cool'
  return 'Cold'
}
