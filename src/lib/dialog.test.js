// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { trapFocus } from './dialog.js'

const tab = (shift = false) => {
  const e = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: shift, bubbles: true })
  document.activeElement.dispatchEvent(e)
  return e
}
const escape = () =>
  document.activeElement.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  )

let opener, box, releases

function build() {
  document.body.innerHTML = `
    <button id="opener">?</button>
    <main><button id="behind">a button in the game</button></main>
    <div id="box" tabindex="-1" role="dialog">
      <button id="first">first</button>
      <a href="#x" id="middle">a link</a>
      <button id="last">last</button>
    </div>`
  opener = document.getElementById('opener')
  box = document.getElementById('box')
  opener.focus()
}

beforeEach(() => {
  releases = []
  build()
})

afterEach(() => {
  releases.forEach((r) => r())
  document.body.innerHTML = ''
})

const open = (onEscape) => {
  const release = trapFocus(box, onEscape)
  releases.push(release)
  return release
}

describe('trapFocus', () => {
  it('moves focus to the dialog, not to its first button', () => {
    open()
    // The dialogs here are mostly prose. Landing on "Got it" has skipped
    // everything the dialog was opened to say.
    expect(document.activeElement).toBe(box)
  })

  it('sends Tab from the dialog itself to the first control', () => {
    open()
    tab()
    expect(document.activeElement.id).toBe('first')
  })

  it('sends Shift+Tab from the dialog itself to the last control', () => {
    open()
    tab(true)
    expect(document.activeElement.id).toBe('last')
  })

  it('wraps forward off the end instead of leaving the dialog', () => {
    open()
    document.getElementById('last').focus()
    tab()
    expect(document.activeElement.id).toBe('first')
  })

  it('wraps backward off the start', () => {
    open()
    document.getElementById('first').focus()
    tab(true)
    expect(document.activeElement.id).toBe('last')
  })

  it('leaves Tab alone in the middle of the dialog', () => {
    open()
    document.getElementById('first').focus()
    const e = tab()
    // Not prevented: the browser's own order is correct here.
    expect(e.defaultPrevented).toBe(false)
  })

  it('pulls focus back if it lands outside the dialog', () => {
    open()
    document.getElementById('behind').focus()
    tab()
    expect(document.activeElement.id).toBe('first')
  })

  it('closes on Escape', () => {
    const onEscape = vi.fn()
    open(onEscape)
    escape()
    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('returns focus to whatever opened it', () => {
    const release = open()
    document.getElementById('middle').focus()
    release()
    expect(document.activeElement).toBe(opener)
  })

  it('does not throw if the opener has since been removed', () => {
    const release = open()
    opener.remove()
    expect(() => release()).not.toThrow()
  })

  it('stops trapping once released', () => {
    const onEscape = vi.fn()
    const release = open(onEscape)
    release()
    document.getElementById('behind').focus()
    tab()
    escape()
    expect(onEscape).not.toHaveBeenCalled()
    expect(document.activeElement.id).toBe('behind')
  })
})

// The rules dialog can open the legal one over itself and both stay
// mounted. Without a stack one Escape closes both, and the reader is
// thrown back to the board instead of back one step.
describe('two dialogs at once', () => {
  let inner

  beforeEach(() => {
    inner = document.createElement('div')
    inner.id = 'inner'
    inner.tabIndex = -1
    inner.innerHTML = '<button id="inner-only">close</button>'
    document.body.appendChild(inner)
  })

  it('gives Escape to the top dialog only', () => {
    const outerClose = vi.fn()
    const innerClose = vi.fn()
    open(outerClose)
    const releaseInner = trapFocus(inner, innerClose)
    releases.push(releaseInner)

    escape()
    expect(innerClose).toHaveBeenCalledTimes(1)
    expect(outerClose).not.toHaveBeenCalled()
  })

  it('hands Escape back to the lower dialog once the top one closes', () => {
    const outerClose = vi.fn()
    const innerClose = vi.fn()
    open(outerClose)
    const releaseInner = trapFocus(inner, innerClose)
    releaseInner()

    escape()
    expect(outerClose).toHaveBeenCalledTimes(1)
  })

  it('returns focus one step, to the control inside the dialog below', () => {
    open()
    const opened = document.getElementById('middle')
    opened.focus()
    const releaseInner = trapFocus(inner, () => {})
    expect(document.activeElement).toBe(inner)
    releaseInner()
    expect(document.activeElement).toBe(opened)
  })

  it('traps Tab in the top dialog, not the one underneath', () => {
    open()
    const releaseInner = trapFocus(inner, () => {})
    releases.push(releaseInner)
    tab()
    expect(document.activeElement.id).toBe('inner-only')
  })
})
