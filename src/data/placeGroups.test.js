import { describe, it, expect } from 'vitest'
import { placeGroups, PLACES } from './town.js'

// The only way to answer Zoom.
//
// Two failures here are silent and neither one throws. A place that
// falls out of the grouping is a place nobody can ever guess — on a
// board where it might be the answer, which is a game you cannot win
// and a bug that looks like bad luck. And a district heading left
// standing over no rows is a wheel with a dead stop in it.

const flat = (groups) => groups.flatMap(([, places]) => places)

describe('every place is reachable', () => {
  it('lists all of them, once each', () => {
    const ids = flat(placeGroups()).map((p) => p.id)
    expect(ids.length).toBe(PLACES.length)
    expect(new Set(ids).size).toBe(PLACES.length)
  })

  it('puts every place under its own district', () => {
    for (const [district, places] of placeGroups())
      for (const p of places) expect(p.district, p.name).toBe(district)
  })
})

describe('the order somebody scrolls through', () => {
  // Source order, not alphabetical: the five towns Fremont was made out
  // of come first and the catch-alls come last. Alphabetical would file
  // "Around town" second, ahead of Centerville and Niles.
  it('keeps the districts in the order the data curates', () => {
    const seen = []
    for (const p of PLACES) if (!seen.includes(p.district)) seen.push(p.district)
    expect(placeGroups().map(([d]) => d)).toEqual(seen)
  })

  it('sorts by name inside each district', () => {
    for (const [district, places] of placeGroups()) {
      const names = places.map((p) => p.name)
      expect(names, district).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    }
  })
})

describe('guessed places leave the list', () => {
  it('drops the ones already spent', () => {
    const used = PLACES.slice(0, 3).map((p) => p.id)
    const ids = flat(placeGroups(used)).map((p) => p.id)
    expect(ids).toHaveLength(PLACES.length - 3)
    for (const id of used) expect(ids).not.toContain(id)
  })

  // Unreachable in play — the smallest district has six places and the
  // game allows five guesses. It stops being unreachable the day either
  // number moves, and a heading over an empty group is not something a
  // native wheel renders gracefully.
  it('drops a district once nothing is left in it', () => {
    const smallest = placeGroups().reduce((a, b) => (a[1].length <= b[1].length ? a : b))
    const groups = placeGroups(smallest[1].map((p) => p.id))
    expect(groups.map(([d]) => d)).not.toContain(smallest[0])
    expect(flat(groups)).toHaveLength(PLACES.length - smallest[1].length)
  })

  it('survives being handed ids that are not places', () => {
    expect(flat(placeGroups(['not-a-place', '']))).toHaveLength(PLACES.length)
  })
})
