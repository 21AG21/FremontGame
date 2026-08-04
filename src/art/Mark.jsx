// The ridge behind everything, and the five section icons.
//
// There is no logo lockup any more — the design doc sets the wordmark
// in Newsreader on its own, with the day's question after a hairline
// rule. A mark small enough to sit beside 23px type was never legible
// as Mission Peak anyway; the ridge does that job full-bleed at 9%.

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
        fill="var(--ridge)"
      />
    </svg>
  )
}

// Section icons, 18px, drawn in currentColor so the active item can
// flip the whole thing to white against navy without a second asset.
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
      <rect x="3" y="4" width="18" height="16" {...line} />
      <path d="M12 2v20" {...line} />
    </Frame>
  ),
  // higher
  higherlower: () => (
    <Frame>
      <path d="M12 5v14" {...line} />
      <path d="M6 11l6-6 6 6" {...line} />
    </Frame>
  ),
  // letters in a row
  wordgrid: () => (
    <Frame>
      <rect x="3" y="8" width="18" height="8" {...line} />
      <path d="M9 8v8" {...line} />
      <path d="M15 8v8" {...line} />
    </Frame>
  ),
}
