import { useState } from 'react'
import { TOWN } from '../data/town.js'

// Privacy, terms and an accessibility statement.
//
// These are drafts written to describe what this site actually does,
// which is very little: no accounts, no analytics, no cookies, no
// third-party anything, and three localStorage keys holding your own
// streaks, today's board and your theme. Most boilerplate policies describe tracking the site does
// not do, which is worse than nothing — it claims practices you would
// then have to honour.
//
// They are NOT legal advice and have not been reviewed by a lawyer.
// See the note at the end of PRIVACY.

const UPDATED = 'August 2026'

const PRIVACY = [
  ['What this site collects', [
    'This site has no accounts. It never asks for an email address, a name or a password, and there is nothing to log in to.',
    'There are no analytics, no advertising, no trackers and no third-party scripts of any kind. Nothing about your play is transmitted anywhere, and nothing is sold or shared.',
    'The one exception is the ordinary web server request needed to load the page, which is covered under Server logs below.',
  ]],
  ['What is stored on your device', [
    'Your puzzle results, streaks, the board you are part way through and your theme choice are kept in your browser’s local storage, under three keys beginning “fremont.”. That data never leaves your device and is not readable by this site’s operator.',
    'These are not cookies: nothing is attached to your requests, so nothing about you travels to a server and there is no cross-site tracking. We have not put a consent banner in front of it. Whether that is the right call under the ePrivacy rules is a legal question, and this document does not pretend to answer legal questions.',
    'Clearing your browser’s site data erases it. Doing so resets your streaks, which cannot then be recovered by anyone, including us.',
  ]],
  ['Server logs', [
    'Whoever hosts this site may keep ordinary web server logs, which typically include IP addresses, timestamps and requested URLs. That is standard hosting behaviour and outside this site’s code. Check your host’s own policy for how long they keep them.',
  ]],
  ['Children', [
    'The site asks no one for personal information, at any age. Server logs, described above, are kept by the host rather than by this site.',
  ]],
  ['Your rights', [
    'Your game data lives in your own browser, where you can inspect or delete it yourself at any time, without asking anyone. This site holds no database of players. If you want to know what your host retains in its request logs — IP addresses count as personal data under the GDPR — that is a question for whoever you host with.',
  ]],
  ['Changes', [
    `Last updated ${UPDATED}. If this ever changes to collect anything, that has to be written here before it starts.`,
  ]],
]

const TERMS = [
  ['The short version', [
    'This is a free puzzle game about a town. Play it, share your results, enjoy it.',
  ]],
  ['No warranty', [
    'The site is provided “as is”, without warranty of any kind, express or implied, including fitness for a particular purpose. It may be unavailable, may contain errors, and may stop existing.',
  ]],
  ['Accuracy', [
    'The facts in the puzzles are researched and sourced, and they are still capable of being wrong. Nothing here is authoritative — do not cite a puzzle game in an argument about local history, and do not rely on it for anything that matters.',
  ]],
  ['Liability', [
    'To the fullest extent permitted by law, the operator is not liable for any damages arising from use of the site.',
  ]],
  ['Content', [
    'Facts, dates and place names are not copyrightable. The code and the drawings are the operator’s. Some tiles name real businesses — those names belong to their owners and appear here only to refer to them, which is nominative use and not a claim of any association. Do not present the site as your own.',
  ]],
  ['Acceptable use', [
    'Do not attempt to disrupt the site or use it to harm others. There are no accounts, so there is nothing to ban — but this is the line.',
  ]],
]

const ACCESS = [
  ['What we aim for', [
    'This site targets WCAG 2.1 Level AA. That is the standard US courts have generally treated as the benchmark for ADA Title III claims about websites, and the one referenced by California’s Unruh Act cases.',
  ]],
  ['What has been done', [
    'Colours are measured rather than eyeballed. Body text meets the 4.5:1 minimum throughout, in both themes. Most interface elements meet 3:1; a few thin dividers and inactive states do not, and are listed under Known gaps.',
    'The Word puzzle marks every scored tile with a symbol (✓, ~, ×) as well as a colour, so its feedback does not depend on telling green from amber.',
    'Buttons, tabs and the section bar meet the 44-pixel minimum target size. The on-screen keyboard does not: at a 320-pixel screen width its keys are about 23 pixels wide, because ten of them have to share the row. They meet the spacing exception rather than the size rule.',
    'Everything is reachable and operable by keyboard, with a visible focus ring in the site’s own colours. The Then & Now slider takes arrow keys, Home and End, and can also be positioned by tapping the picture rather than dragging it.',
    'The drawings carry text alternatives. On four of the five games these name the subject; on Zoom the alternative deliberately withholds it, because naming it is the puzzle — which means a screen reader user is told a drawing is present but not what it shows.',
    'Some state changes are announced through live regions. This is not complete and not reliable: several regions are created at the same moment as their first message, which many screen readers do not announce.',
    'Animation is limited to colour fades, and those are switched off entirely when your system asks for reduced motion.',
    'The layout scales with the viewport and scrolls rather than clipping, so enlarging text or forcing your own line spacing does not destroy content. It has been checked by calculation down to 320 by 568.',
  ]],
  ['Known gaps', [
    'The Zoom puzzle is visual by nature and cannot be played without sight. There is no non-visual equivalent.',
    'The Word grid conveys its result through colour, a symbol, and the tile text — but the symbol is drawn in CSS, which screen readers do not reliably expose. The autocomplete on Zoom is not marked up as a combobox. Neither dialog traps focus, handles Escape, or returns focus on close.',
    'Contrast and structure have been checked by hand and by calculation. The site has NOT been tested by a screen reader user, and no automated accessibility test suite runs against it. Both are worth more than anything already done.',
  ]],
  ['Telling us', [
    'If something here is unusable for you, that is a bug and we want to hear about it. Add a contact address here before launch — this sentence is a placeholder and the site has no contact page yet.',
  ]],
]

const DOCS = {
  privacy: { title: 'Privacy', body: PRIVACY },
  terms: { title: 'Terms of use', body: TERMS },
  access: { title: 'Accessibility', body: ACCESS },
}

export default function Legal({ open, onClose }) {
  const [tab, setTab] = useState('privacy')
  if (!open) return null
  const doc = DOCS[tab]

  return (
    <div className="howto-scrim" onClick={onClose}>
      <div
        className="howto legal"
        role="dialog"
        aria-modal="true"
        aria-label="Privacy, terms and accessibility"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-tabs" role="tablist">
          {Object.entries(DOCS).map(([k, d]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              className={'legal-tab' + (tab === k ? ' is-active' : '')}
              onClick={() => setTab(k)}
            >
              {d.title}
            </button>
          ))}
        </div>

        <div className="legal-body">
          <h2 className="howto-title">
            {doc.title} · {TOWN.name}
          </h2>
          {doc.body.map(([heading, paras]) => (
            <section key={heading}>
              <h3 className="legal-heading">{heading}</h3>
              {paras.map((t) => (
                <p key={t} className="legal-para">
                  {t}
                </p>
              ))}
            </section>
          ))}

          <p className="legal-note">
            These are drafts, written to describe what this site actually does. They are not legal
            advice and have not been reviewed by a lawyer. Have one read them before you launch —
            especially if you ever add analytics, accounts or anything that leaves the device.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onClose} autoFocus>
          Close
        </button>
      </div>
    </div>
  )
}
