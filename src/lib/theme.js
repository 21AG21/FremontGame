// Light/dark, and who decides.
//
// With nothing stored, the CSS media query governs and the app follows
// the system live. The moment you press the toggle we write [data-theme]
// on <html>, which outranks the media query in styles.css, and remember
// it. There is no third "follow system" state on the button — clearing
// the key is the way back, and nobody presses a three-way toggle twice.

export const THEME_KEY = 'fremont.theme'

// The browser chrome above the page has to change with it, or the
// status bar sits in the old theme.
const BAR = { light: '#f1f5f8', dark: '#07203a' }

export function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') return t
  } catch {
    /* private mode, or storage disabled — fall through to the system */
  }
  return systemTheme()
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* the theme still applies for this session */
  }
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', BAR[theme])
}
