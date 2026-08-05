import { Component } from 'react'
import { report } from '../lib/report.js'

// The whole game is one bundle, so a single throw anywhere unmounts all
// five puzzles and leaves a blank white page with no way back. A daily
// player who hits that on a Tuesday does not come back on Wednesday.
//
// This does not fix anything — it just means the failure is legible, has
// a door out of it, and gets reported. See lib/report.js for what is
// sent and what deliberately is not.
export default class Boundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    report(error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className="sheet">
        <header className="lockup">
          <h1 className="flag">Fremont</h1>
        </header>
        <div className="boundary">
          <h2 className="howto-title">That didn’t load.</h2>
          <p className="legal-para">
            Something went wrong drawing today’s puzzles. Reloading usually fixes it. If it keeps
            happening, clearing this site’s data will reset the day — you will lose today’s progress
            but not your streak.
          </p>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => location.reload()}>
              Reload
            </button>
            <button
              className="btn"
              onClick={() => {
                try {
                  localStorage.removeItem('fremont.today')
                } catch {
                  /* nothing else to try */
                }
                location.reload()
              }}
            >
              Reset today
            </button>
          </div>
        </div>
      </div>
    )
  }
}
