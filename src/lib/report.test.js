import { describe, it, expect, vi, beforeEach } from 'vitest'

const track = vi.fn()
vi.mock('@vercel/analytics', () => ({ track: (...a) => track(...a) }))

const { report } = await import('./report.js')

beforeEach(() => {
  track.mockReset()
  track.mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

const stack =
  '\n    at WordGrid (http://localhost/src/puzzles/WordGrid.jsx:31:5)\n    at main\n    at App'

describe('report', () => {
  it('sends the message and the component that threw', () => {
    report(new TypeError('answer is undefined'), { componentStack: stack })
    expect(track).toHaveBeenCalledWith('render_error', {
      message: 'answer is undefined',
      at: 'at WordGrid (http://localhost/src/puzzles/WordGrid.jsx:31:5)',
    })
  })

  it('still says something useful when a non-Error is thrown', () => {
    report('everything broke', { componentStack: stack })
    expect(track.mock.calls[0][1].message).toBe('everything broke')
  })

  it('survives a throw with no info at all', () => {
    expect(() => report(undefined, undefined)).not.toThrow()
    expect(track.mock.calls[0][1]).toEqual({ message: 'undefined', at: '' })
  })

  // One string travelling over somebody's data, on a phone that is
  // already having a bad time.
  it('truncates so a runaway message cannot be sent whole', () => {
    report(new Error('x'.repeat(5000)), { componentStack: 'y'.repeat(5000) })
    const sent = track.mock.calls[0][1]
    expect(sent.message).toHaveLength(200)
    expect(sent.at).toHaveLength(100)
  })

  // The crash screen is the last thing standing between a player and a
  // blank page. Reporting must not be able to take it down.
  it('does not rethrow when analytics itself fails', () => {
    track.mockImplementation(() => {
      throw new Error('blocked by an ad blocker')
    })
    expect(() => report(new Error('boom'), { componentStack: stack })).not.toThrow()
  })

  it('always writes to the console, whatever analytics does', () => {
    track.mockImplementation(() => {
      throw new Error('offline')
    })
    report(new Error('boom'), { componentStack: stack })
    expect(console.error).toHaveBeenCalled()
  })
})
