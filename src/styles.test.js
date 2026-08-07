import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// The stylesheet, held to the rules it was rewritten to follow.
//
// This file exists because of one shipped bug. `margin-block: -4px` was
// migrated to `margin-block: -var(--s-2)`, which is not CSS — there is
// no unary minus in front of var(), you have to write calc(x * -1). The
// browser dropped the declaration silently, the header quietly grew the
// 8px that rule existed to take off it, and nothing anywhere noticed.
//
// A stylesheet is the one part of this app with no compiler and no
// runtime error to catch a typo: a bad declaration is simply ignored.
// So the invariants get asserted here instead. None of these are style
// preferences — each is a rule the file was measured against, and each
// can regress without any other test going red.

const css = readFileSync(fileURLToPath(new URL('./styles.css', import.meta.url)), 'utf8')

// Comments hold prose about pixel values — "at -6px the moon sat 8px
// inside the margin" — which would read as declarations to every regex
// below.
const src = css.replace(/\/\*[\s\S]*?\*\//g, '')

const declarations = [...src.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)[;}]/g)].map((m) => ({
  prop: m[1],
  value: m[2].trim(),
  text: `${m[1]}: ${m[2].trim()}`,
}))

describe('declarations the browser would throw away', () => {
  // The bug above, exactly.
  it('never negates a custom property with a bare minus', () => {
    expect(src).not.toMatch(/-var\(/)
  })

  it('closes every var() it opens', () => {
    for (const d of declarations) {
      const opens = (d.value.match(/var\(/g) || []).length
      if (!opens) continue
      const [l, r] = [d.value.split('(').length - 1, d.value.split(')').length - 1]
      expect(l, d.text).toBe(r)
    }
  })

  // A misspelt token resolves to nothing and the declaration is dropped
  // — the same silent failure, from a different direction.
  it('only reads custom properties that something defines', () => {
    const defined = new Set([...src.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]))
    // Set on the element by React, not by this file: the pill's slot.
    defined.add('--i')
    const used = new Set([...src.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]))
    expect([...used].filter((u) => !defined.has(u))).toEqual([])
  })
})

// The three scales. Off-grid values are how a stylesheet drifts: each
// one is a number that was nudged until a screenshot looked right, and
// none of them agree with each other. There were 15 before the scale
// went in.
describe('the scales hold', () => {
  const SPACING =
    /^(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left|block|inline))?$/

  it('spaces in multiples of four, or not in pixels at all', () => {
    // 1px is a hairline, not a gap — a rule that has to land on a device
    // pixel. Rounding it to 4 would draw a bar.
    const HAIRLINE = /^-?1px$/
    const offGrid = []
    for (const d of declarations) {
      if (!SPACING.test(d.prop)) continue
      for (const term of d.value.split(/\s+/)) {
        if (!/^-?[\d.]+px$/.test(term)) continue
        if (parseFloat(term) === 0 || HAIRLINE.test(term)) continue
        offGrid.push(d.text)
      }
    }
    expect([...new Set(offGrid)]).toEqual([])
  })

  it('rounds every corner from the radius scale', () => {
    const raw = declarations.filter((d) => d.prop === 'border-radius' && /[\d.]+px/.test(d.value))
    expect(raw.map((d) => d.text)).toEqual([])
  })

  it('sets every size from the type ramp', () => {
    const raw = declarations.filter((d) => d.prop === 'font-size' && /[\d.]+px/.test(d.value))
    expect(raw.map((d) => d.text)).toEqual([])
  })
})

// The section bar is the one place where a label can quietly draw over
// its neighbour: five fixed slots, no wrapping, and nothing clipping it.
// "Then/Now" did exactly that on a 320px screen for as long as it was
// the label — 61px of text in a 54px slot, spilling both ways.
describe('the section bar', () => {
  const rule = (selector) => {
    const m = src.match(new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`))
    return m ? m[1] : ''
  }

  it('keeps a label on one line, so the bar cannot grow one', () => {
    expect(rule('.index-name')).toMatch(/white-space:\s*nowrap/)
  })

  it('has no side padding to give away', () => {
    // The label's whole budget is the slot. There is no per-item
    // background to inset — the pill behind them is a full slot wide.
    expect(rule('.index-item')).toMatch(/padding:\s*var\(--s-\d\)\s+0/)
  })

  // The pill is full-bleed: it fills the bar's height and runs into its
  // ends, and the bar's own overflow is what rounds it there. Round the
  // pill as well and every middle slot shows a wedge of glass at its
  // corners; stop the bar clipping and the end slots square off outside
  // the bar's curve. The two go together.
  it('lets the bar shape the pill rather than the pill shaping itself', () => {
    expect(rule('.index')).toMatch(/overflow:\s*hidden/)
    expect(rule('.index-pill')).toMatch(/border-radius:\s*0/)
  })
})
