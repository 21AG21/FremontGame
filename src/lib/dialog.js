// What a modal dialog owes a keyboard.
//
// Both dialogs on this site had role="dialog" and aria-modal="true" and
// neither of them meant anything: Tab walked straight out of the box and
// into the game behind it, Escape did nothing, and closing left focus on
// <body> — so the next Tab started again from the top of the page. For
// somebody who does not use a mouse that is not a rough edge, it is the
// difference between reading the rules and being lost in them.
//
// Written against the DOM rather than as a hook so the behaviour can be
// tested directly. useDialog below is the thin React wrapper.

import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Which dialog is on top. The rules dialog can open the legal one over
// itself, and both stay mounted — without this, one Escape closes both
// and the reader is thrown back to the board instead of back one step.
const stack = []

/**
 * Traps the keyboard inside `box` until the returned function is called.
 * That function also puts focus back where it came from.
 */
export function trapFocus(box, onEscape) {
  const returnTo = document.activeElement
  const token = {}
  stack.push(token)

  // Focus the box itself, not its first button. These dialogs are mostly
  // prose — the rules, the privacy policy — and a screen reader landing
  // on "Got it" has skipped everything the dialog was opened to say.
  box.focus()

  const items = () =>
    [...box.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true'
    )

  const onKey = (e) => {
    if (stack[stack.length - 1] !== token) return

    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onEscape?.()
      return
    }

    if (e.key !== 'Tab') return
    const list = items()
    if (!list.length) {
      e.preventDefault()
      return
    }

    const first = list[0]
    const last = list[list.length - 1]
    const active = document.activeElement

    // Wrap at both ends, and catch the case where focus is on the box
    // itself: Tab from there goes to the first control, Shift+Tab to
    // the last, rather than escaping into the page behind.
    if (!box.contains(active) || active === box) {
      e.preventDefault()
      ;(e.shiftKey ? last : first).focus()
    } else if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  document.addEventListener('keydown', onKey, true)

  return () => {
    document.removeEventListener('keydown', onKey, true)
    const at = stack.indexOf(token)
    if (at > -1) stack.splice(at, 1)
    // Back to the control that opened it. Without this the next Tab
    // restarts from the top of the document.
    if (returnTo && document.contains(returnTo)) returnTo.focus?.()
  }
}

export function useDialog(open, onClose) {
  const box = useRef(null)

  // onClose is almost always an inline arrow, so a new function every
  // render. Held in a ref so the trap is set up once per opening rather
  // than torn down and rebuilt — which would steal focus back to the
  // top of the dialog on every keystroke.
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })

  useEffect(() => {
    if (!open || !box.current) return
    return trapFocus(box.current, () => close.current?.())
  }, [open])

  return box
}
