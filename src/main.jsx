import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
