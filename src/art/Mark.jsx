// The ridge behind everything, the nameplate mark, and the five
// section icons.
//
// A mark did live here once and was dropped as illegible — correctly,
// because it was a filled triangle, and a filled triangle at 24px is
// every mountain in the world. What makes this one Mission Peak is the
// pole at the summit: the thing everybody queues to be photographed
// beside, and a single vertical stroke, which is the one detail that
// survives being shrunk. The ridgeline is the same profile as the
// full-bleed ridge below, so the mark and the background are one hill.

// Fixed to the viewport, not to the column: a ridge scoped to the 440px
// sheet reads as a grey slab with two hard edges once the window is
// wider than the sheet. Stretched rather than cropped, so the skyline
// stays in frame instead of the crop landing on the flat base.
export function Ridge() {
  return (
    <svg
      className="ridge"
      viewBox="0 0 340 660"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="0,660 0,300 84,140 150,214 232,36 300,180 340,120 340,660"
        fill="currentColor"
      />
    </svg>
  )
}

// The nameplate mark. Points taken off the Ridge polygon above and
// rescaled, so the skyline beside the wordmark is the skyline behind
// the page rather than a second, different set of hills.
export function PeakMark() {
  return (
    <svg
      className="peak"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* One summit, not four, and nothing else on the slopes. The
            ridge's real profile has three false tops in it, which at
            this size came out as a zigzag — a heart-rate trace, not a
            hill. A shoulder stroke on the left flank was no better: at
            26px a short diagonal beside a peak is a stray tick. */}
        {/* Ink centred in the box, not the path bounds. Drawn from 2.2
            to 20.6 the mark sat 0.6 units — half a point on screen —
            above the two icons and the wordmark it stands beside. */}
        <path d="M13 8.8V2.8" />
        <path d="M1.6 21.2 13 8.8 22.4 21.2" />
      </g>
    </svg>
  )
}

// The two header controls, drawn to the same recipe as the section
// icons below: 24-unit box, 1.9 stroke, round joins, no fill. The help
// control used to be a bold sans "?" set as text, which was the one
// glyph on the site that belonged to no drawing — beside a stroked moon
// it read as a different alphabet, and at 10px wide against the moon's
// 16 it did not even weigh the same.
export function ThemeIcon({ dark }) {
  return (
    <HeaderFrame>
      {dark ? (
        <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
        </g>
      ) : (
        <path
          d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
      )}
    </HeaderFrame>
  )
}

// The question mark is stroked, not set: the hook is drawn as a path and
// the point below it is a zero-length segment with a round cap, so both
// take the same 1.9 as everything else in the chrome.
export function HelpIcon() {
  return (
    <HeaderFrame>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9.3 9.4a2.8 2.8 0 1 1 3.5 3.1c-.55.2-.9.72-.9 1.3v.5" />
        <path d="M12 17.4v.01" />
      </g>
    </HeaderFrame>
  )
}

// 20, not 16. Two small glyphs adrift in 44px targets read as an
// afterthought at the end of an empty row; at 20 they carry the same
// weight as the wordmark opposite them.
function HeaderFrame({ children }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

// Section icons, 18px, drawn in currentColor so the active item can
// flip the whole thing to white against navy without a second asset.
//
// All five draw their ink from 3 to 21 of the 24-unit box. That is not
// tidiness — the box being identical is exactly what hid the problem.
// Measured in the bar, the drawings inside those identical boxes ran
// from 8 units tall (the word row, a third of its frame) to 20 (the
// then-and-now divider, which overshot its own rectangle), so a row of
// nominally equal icons rendered at wildly unequal weights and the bar
// read as ragged. The word row went from a letterbox to three full-height
// cells, the arrow grew from 14 to 18, and the divider was pulled back
// inside the frame it splits.
//
// Widths still differ, and should: an arrow is narrower than a grid and
// forcing it wider would only make it a worse arrow. It is the height
// that sets the line the eye reads across.
const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Frame({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

export const ICONS = {
  // a crop, closing in
  zoom: () => (
    <Frame>
      <path d="M3 8V3h5" {...line} />
      <path d="M21 16v5h-5" {...line} />
      <circle cx="12" cy="12" r="5" {...line} />
    </Frame>
  ),
  // four cells, two of them claimed
  connections: () => (
    <Frame>
      <rect x="3" y="3" width="7.5" height="7.5" {...line} fill="currentColor" />
      <rect x="13.5" y="3" width="7.5" height="7.5" {...line} />
      <rect x="3" y="13.5" width="7.5" height="7.5" {...line} />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" {...line} fill="currentColor" />
    </Frame>
  ),
  // one frame, split down the middle
  thennow: () => (
    <Frame>
      <rect x="3" y="3" width="18" height="18" {...line} />
      <path d="M12 3v18" {...line} />
    </Frame>
  ),
  // higher
  higherlower: () => (
    <Frame>
      <path d="M12 3v18" {...line} />
      <path d="M5 10l7-7 7 7" {...line} />
    </Frame>
  ),
  // letters in a row, one of them found. The fill is what keeps this
  // from being the then-and-now frame with an extra line in it — both
  // are a rectangle divided by verticals, and once the word row was
  // grown to the same height as everything else the two read as the
  // same icon. A solved cell is also what the game itself draws.
  wordgrid: () => (
    <Frame>
      <rect x="3" y="3" width="18" height="18" {...line} />
      <rect x="9" y="3" width="6" height="18" {...line} fill="currentColor" />
    </Frame>
  ),
}
