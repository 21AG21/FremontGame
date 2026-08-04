import { useState } from 'react'
import Legal from './Legal.jsx'

// How to play.
//
// The site shipped with none of this, on the theory that Wordle and
// Connections are formats everyone knows. They aren't. Our oldest
// reviewer worked out four of the five games from the board alone and
// concluded the fifth was *broken* — five yellow squares with no legend
// is not obviously feedback if you have never seen it before.
//
// It does NOT open by itself. Rules that greet you before the board
// does are read with nothing to attach them to, and five modals in a
// first session is a wall between the player and the game. The board
// goes first; the ? is there the moment anyone wants it.

const RULES = {
  zoom: {
    title: 'Zoom',
    lines: [
      'A drawing of somewhere in Fremont, opened close up.',
      'Name the place. Every wrong guess pulls the picture back a little, so it gets easier as you go.',
      'Wrong guesses tell you how warm you are and which way to look — “Cool · 3.1 mi east” means keep going east.',
      'Five guesses.',
    ],
  },
  connections: {
    title: 'Groups',
    lines: [
      'Twelve tiles hide four groups of three.',
      'Tap three that belong together, then Submit. Get it right and they lift out with their category named.',
      'Some tiles fit more than one group. That is the puzzle.',
      'Three wrong guesses and the round is over.',
    ],
  },
  thennow: {
    title: 'Then & Now',
    lines: [
      'One place, two eras, laid over each other.',
      'Drag the handle — or just tap anywhere on the picture — to wipe between them.',
      'Then pick the year of the older one.',
      'Three guesses. A wrong year tells you whether the real one is earlier or later.',
    ],
  },
  higherlower: {
    title: 'Higher or Lower',
    lines: [
      'Two things, measured the same way, at least one of them local. One number is shown.',
      'Say whether the hidden one is higher or lower.',
      'The side you can see is always something you can picture, so you have somewhere to reason from.',
      'Five rounds, four right to win.',
    ],
  },
  wordgrid: {
    title: 'The Word',
    lines: [
      'Guess a five-letter word in six tries. Often a word from around here.',
      'After each guess every letter is marked: ✓ right letter, right place. ~ right letter, wrong place. × not in the word.',
      'The mark is on the tile as well as the colour, so you do not have to tell green from amber.',
      'The same word for everybody in town, today only.',
      'Guesses have to be real words.',
    ],
  },
}

export default function HowTo({ game }) {
  const rules = RULES[game]
  const [open, setOpen] = useState(false)
  const [legal, setLegal] = useState(false)

  const close = () => setOpen(false)

  if (!rules) return null

  return (
    <>
      <button className="howto-open" onClick={() => setOpen(true)} aria-label={`How to play ${rules.title}`}>
        ?
      </button>

      {open && (
        <div className="howto-scrim" onClick={close}>
          <div
            className="howto"
            role="dialog"
            aria-modal="true"
            aria-label={`How to play ${rules.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="howto-title">{rules.title}</h2>
            <ul className="howto-list">
              {rules.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <button className="btn btn-primary" onClick={close} autoFocus>
              Got it
            </button>

            <p className="howto-legal">
              <button className="linkish" onClick={() => setLegal(true)}>
                Privacy, terms and accessibility
              </button>
            </p>
          </div>
        </div>
      )}

      <Legal open={legal} onClose={() => setLegal(false)} />
    </>
  )
}
