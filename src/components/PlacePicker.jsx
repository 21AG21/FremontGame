import { useState } from 'react'
import { PLACES, placeGroups } from '../data/town.js'

// Choosing a place, without a keyboard.
//
// This was an autocomplete: type a few letters, pick from four matches.
// It worked, and it cost more than it looked like it did. On a phone the
// keyboard takes the bottom half of the screen the moment you touch the
// field — on the one game whose entire premise is a picture you are
// staring at. Everything that followed was built around that: the match
// list opened upward because down was buried, it was capped at four rows
// because more covered the drawing, and the rows ran worst-to-best so
// the good ones stayed pinned near the thumb. All of it was working
// around a keyboard that this now does not raise.
//
// A native <select> is the whole answer. What it opens is the platform's
// business and it changes — measured on iOS 26.5 in the simulator, it is
// a popover menu anchored to the control with the optgroup labels as
// headings, where older iOS gave a wheel at the bottom of the screen.
// Both are fine here and neither shows a keyboard, which is the only
// property this depends on. It is also a real listbox to VoiceOver and
// TalkBack without a line of aria, it cannot be typo'd into a place that
// does not exist, and it deletes the arrow-key cursor, the outside-click
// handler and the upward panel along with the input.
//
// One honest cost: the OS places that popover, and on a 393pt screen it
// covers most of the engraving while it is open. The old four-row cap
// existed to prevent exactly that. The difference is that this is modal
// and momentary — it is gone the instant you choose, where the keyboard
// sat there for as long as you were typing.
//
// What is lost is worth naming: somebody who knows exactly what they
// want used to reach it in three letters and now scrolls to it. The
// grouping below is what pays that back.

// The grouping itself lives in data/town.js, next to the district field
// it reads — see placeGroups there for why the districts are in the
// order they are.
export default function PlacePicker({ onGuess, disabled, used = [] }) {
  const [id, setId] = useState('')

  const groups = placeGroups(used)
  const chosen = PLACES.find((p) => p.id === id)

  // Two steps, not one. A wheel fires change as it settles, so guessing
  // on change spends one of five on a scroll that was still moving —
  // and unlike a search box there is no way to take it back. Choose,
  // then commit, which is also how Groups already works.
  const submit = () => {
    if (!chosen || disabled) return
    onGuess(chosen)
    setId('')
  }

  return (
    <div className="picker">
      <div className="picker-field">
        <select
          className={'picker-select' + (chosen ? '' : ' is-empty')}
          value={id}
          disabled={disabled}
          onChange={(e) => setId(e.target.value)}
          aria-label="Choose a place"
        >
          <option value="">{disabled ? 'Round over' : 'Choose a place'}</option>
          {groups.map(([district, places]) => (
            <optgroup key={district} label={district}>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {/* The select's own arrow is turned off so the control matches
            the rest of the app; this is the replacement. Purely
            decorative and outside the select, so it never eats a tap. */}
        <span className="picker-caret" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="btn btn-primary picker-go"
        disabled={disabled || !chosen}
        onClick={submit}
      >
        Guess
      </button>
    </div>
  )
}
