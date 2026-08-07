// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { TOWN } from './data/town.js'
import { PUZZLE_TYPES } from './data/puzzles.js'

// The static first paint, checked against the app it stands in for.
//
// index.html ships the masthead and the section bar written out flat, so
// the page arrives as itself while the 355kB bundle is still coming down
// instead of as a white rectangle. The whole value of that depends on it
// being the *same* frame React draws a moment later — a shell that
// disagrees trades a blank page for a flicker, which is worse than what
// it replaced.
//
// Nothing else can catch that. The shell is hand-written HTML with no
// import of its own, so renaming a puzzle or redrawing the mark leaves
// it stale and silent, and the two only differ for the few hundred
// milliseconds nobody is looking at with a debugger open.

const read = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8')
const html = read('../index.html')
const mark = read('./art/Mark.jsx')

const doc = new DOMParser().parseFromString(html, 'text/html')
const root = doc.getElementById('root')
const text = (el) => el.textContent.trim()

describe('the page has something to draw before the bundle lands', () => {
  it('does not ship an empty root', () => {
    expect(root).not.toBeNull()
    expect(root.children.length).toBeGreaterThan(0)
  })

  it('draws the masthead and the section bar', () => {
    expect(root.querySelector('.lockup')).not.toBeNull()
    expect(root.querySelector('.index')).not.toBeNull()
  })

  it('leaves the board empty, because the day decides it', () => {
    // Not an oversight. Which puzzle you get is computed in the bundle,
    // so an empty main is the honest shape of what is still pending —
    // and it is what stops the shell inventing a board that then moves.
    expect(text(root.querySelector('main'))).toBe('')
  })

  it('says so plainly when there is no scripting at all', () => {
    expect(doc.querySelector('noscript')).not.toBeNull()
  })
})

describe('the shell says what the app says', () => {
  it('carries the town’s name as the wordmark', () => {
    expect(text(root.querySelector('.flag'))).toBe(TOWN.name)
  })

  it('names the five sections exactly as the bar will', () => {
    const labels = [...root.querySelectorAll('.index-name')].map(text)
    expect(labels).toEqual(PUZZLE_TYPES.map((t) => t.short))
  })

  it('lights the section the app opens on', () => {
    const items = [...root.querySelectorAll('.index-item')]
    const active = items.filter((el) => el.classList.contains('is-active'))
    expect(active).toHaveLength(1)
    // App opens on Zoom, and the pill has to start under the same slot
    // or it slides across the bar on mount.
    expect(items.indexOf(active[0])).toBe(0)
    expect(root.querySelector('.index-pill').getAttribute('style')).toMatch(/--i:\s*0/)
  })

  // Every drawing in the shell is copied out of Mark.jsx by hand.
  // Redraw one there and these fail, rather than the app spending its
  // first half-second wearing a different set of hills.
  const drawing = (name) => {
    const body = mark.match(new RegExp(`function ${name}\\([^)]*\\)[\\s\\S]*?\\n}`))[0]
    return [...body.matchAll(/d="([^"]+)"/g)].map((m) => m[1])
  }

  it('draws the same hills as the app does', () => {
    const ridge = mark.match(/points="([^"]+)"/)[1]
    expect(root.querySelector('.ridge polygon').getAttribute('points')).toBe(ridge)

    const shellPeak = [...root.querySelectorAll('.peak path')].map((p) => p.getAttribute('d'))
    expect(shellPeak).toEqual(drawing('PeakMark'))
  })

  it('draws the same two utilities', () => {
    const inShell = [...root.querySelectorAll('.chrome path')].map((p) => p.getAttribute('d'))
    // Both theme glyphs are present; CSS picks one off the saved theme,
    // so the first frame is already the right one either way.
    for (const d of [...drawing('HelpIcon'), ...drawing('ThemeIcon')]) {
      expect(inShell, d).toContain(d)
    }
    expect(root.querySelector('.boot-sun')).not.toBeNull()
    expect(root.querySelector('.boot-moon')).not.toBeNull()
  })
})

describe('nothing in it can be pressed', () => {
  // There is nothing to press yet. A control that answers no click, or
  // that a screen reader announces a moment before it vanishes, is worse
  // than a masthead that is plainly still loading.
  it('holds no interactive elements', () => {
    expect(root.querySelectorAll('button, a, input, [tabindex], [onclick]')).toHaveLength(0)
  })

  it('is hidden from assistive technology', () => {
    expect(root.querySelector('.sheet').getAttribute('aria-hidden')).toBe('true')
  })
})
