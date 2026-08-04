import { useState } from 'react'
import { TOWN } from '../data/town.js'

// Privacy, terms and an accessibility statement.
//
// These are drafts written to describe what this site actually does,
// which is very little: no accounts, no analytics, no cookies, no
// third-party anything, and one localStorage key holding your own
// streaks. Most boilerplate policies describe tracking the site does
// not do, which is worse than nothing — it claims practices you would
// then have to honour.
//
// They are NOT legal advice and have not been reviewed by a lawyer.
// See the note at the end of PRIVACY.

const UPDATED = 'August 2026'

const PRIVACY = [
  ['What this site collects', [
    'Nothing is sent anywhere. There is no server that stores anything about you: no account, no email address, no name, no login.',
    'There are no analytics, no advertising, no trackers and no third-party scripts of any kind. No data is sold or shared, because none is collected.',
  ]],
  ['What is stored on your device', [
    'Your puzzle results, streaks and theme choice are kept in your browser’s local storage, under keys beginning “fremont.”. That data never leaves your device and is not readable by this site’s operator.',
    'These are not cookies. Nothing is transmitted with your requests, so there is no cross-site tracking and nothing to consent to under the ePrivacy rules — the storage is strictly necessary for the game to remember your own progress.',
    'Clearing your browser’s site data erases it. Doing so resets your streaks, which cannot then be recovered by anyone, including us.',
  ]],
  ['Server logs', [
    'Whoever hosts this site may keep ordinary web server logs, which typically include IP addresses, timestamps and requested URLs. That is standard hosting behaviour and outside this site’s code. Check your host’s own policy for how long they keep them.',
  ]],
  ['Children', [
    'The site collects no personal information from anyone, of any age, so there is nothing to obtain parental consent for under COPPA.',
  ]],
  ['Your rights', [
    'Rights to access, correct, delete or port your personal data — under the GDPR, the CCPA/CPRA or anything similar — apply to data a business holds about you. This site holds none. The only data that exists is in your own browser, where you can inspect or delete it yourself at any time.',
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
    'Place names, historical facts and public data are not owned by anyone. The code and the drawings are the operator’s. Do not present the site as your own.',
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
    'All text and interface colours have been measured, not eyeballed, and meet the 4.5:1 minimum for body text and 3:1 for interface elements, in both the light and dark themes.',
    'The Word puzzle marks every scored tile with a symbol (✓, ~, ×) as well as a colour, so its feedback does not depend on telling green from amber.',
    'Every control is at least 44 by 44 pixels.',
    'Everything is reachable and operable by keyboard, with a visible focus ring in the site’s own colours. The Then & Now slider takes arrow keys, Home and End, and can also be positioned by tapping the picture rather than dragging it.',
    'The drawings carry text alternatives that describe them without giving away the answer.',
    'Game state changes are announced to screen readers.',
    'Animation is limited to colour fades, and those are switched off entirely when your system asks for reduced motion.',
    'The layout scales with the viewport and reflows without loss of content down to 320 pixels wide.',
  ]],
  ['Known gaps', [
    'The Zoom puzzle is visual by nature. A screen reader user is told what kind of place is drawn, but the game cannot be fully played without sight, and there is currently no non-visual equivalent.',
    'Automated checks have been run against the code, but the site has not been tested by actual screen reader users. That testing is the thing most worth doing next.',
  ]],
  ['Telling us', [
    'If something here is unusable for you, that is a bug and worth reporting. Contact details belong here — fill them in before launch.',
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
