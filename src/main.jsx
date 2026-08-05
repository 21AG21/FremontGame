import React from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import Boundary from './components/Boundary.jsx'
import Sheet from './art/Sheet.jsx'

// Newsreader carries the wordmark, the captions and every numeral;
// Work Sans does the rest. Latin subsets only — the place names and
// puzzle copy never leave it.
import '@fontsource/newsreader/latin-400.css'
import '@fontsource/newsreader/latin-400-italic.css'
import '@fontsource/newsreader/latin-600.css'
import '@fontsource/work-sans/latin-400.css'
import '@fontsource/work-sans/latin-500.css'
import '@fontsource/work-sans/latin-600.css'
import '@fontsource/work-sans/latin-700.css'

import './styles.css'

// /?sheet renders the engraving contact sheet instead of the game.
// An authoring tool — see art/Sheet.jsx. Imported statically rather
// than awaited: a top-level await doesn't compile to the browser
// targets, and the parts library is already in the bundle for Zoom.
const Root = new URLSearchParams(location.search).has('sheet') ? Sheet : App

// Vercel Analytics.
//
// Everything it sends goes to /_vercel/insights on this origin, which is
// why the CSP can stay at connect-src 'self' and why no third-party
// domain appears in the network tab. Vercel's aggregate counts are
// cookieless and it does not build a cross-site profile — but it is
// still a request describing a visit, so the privacy policy says so
// plainly rather than continuing to claim the site sends nothing.
//
// Outside the panel it is a no-op: `mode` is 'development' on localhost,
// where it logs instead of sending, and the script only loads on Vercel.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Boundary>
      <Root />
    </Boundary>
    <Analytics />
  </React.StrictMode>
)
