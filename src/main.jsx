import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
