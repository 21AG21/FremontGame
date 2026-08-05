import { track } from '@vercel/analytics'

// Where a crash goes.
//
// To the console for whoever is looking, and to analytics for the nine
// days out of ten when nobody is. A daily game fails on somebody else's
// phone, on a browser you do not own, and without this the first sign of
// it is a number that stops going up a fortnight later.
//
// Deliberately narrow. The message and the component name say which
// puzzle threw and roughly where, which is enough to reproduce it. The
// full stack is not sent: minified frames tell you nothing a source map
// would not, and this is a string travelling over somebody's data on a
// phone that is already having a bad time. Nothing here is derived from
// anything a player typed or guessed — the privacy document says so, so
// it has to stay true.
export function report(error, info) {
  const detail = {
    message: String(error?.message ?? error).slice(0, 200),
    // First line of the component stack — the component that threw.
    at: String(info?.componentStack ?? '')
      .trim()
      .split('\n')[0]
      .trim()
      .slice(0, 100),
  }

  console.error('Fremont: a puzzle failed to render.', error, info)

  // Reporting a crash must never be able to cause one. This runs while
  // the app is already on fire, and the crash screen is the last thing
  // between the player and a blank page.
  try {
    track('render_error', detail)
  } catch {
    /* offline, blocked, or analytics never loaded — the console still has it */
  }
}
