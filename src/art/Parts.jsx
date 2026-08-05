// ─────────────────────────────────────────────────────────────
//  The engraving vocabulary.
//
//  Every part draws into the same 800×600 plate and knows which
//  band it belongs to: `back` is sky and horizon, `mid` is the
//  subject, `front` is everything between you and it. The composer
//  in Engraving.jsx stacks them back to front.
//
//  All of it is one ink on one paper, and every tone is hatch
//  density — no opacity, no grays. That is how engraving works,
//  and it is also why a 5× crop still shows real structure
//  instead of a smooth gradient.
// ─────────────────────────────────────────────────────────────

const range = (n) => Array.from({ length: n }, (_, i) => i)

// currentColor, not var(). A CSS custom property inside an SVG
// *presentation attribute* is spec-legal and has a long history of
// failing in WebKit; when it fails the attribute is invalid, fill falls
// back to black and stroke to none, and every plate in the game becomes
// a solid black rectangle. currentColor in a presentation attribute has
// never been buggy anywhere. The ink is set on .plate svg in CSS.
//
// The paper is a literal because it is #fff in both themes — inverting
// a line drawing turns it into a photographic negative.
export const K = 'currentColor'
export const W = '#fff'
const FACE = "'Work Sans', system-ui, sans-serif"

// Deterministic noise, so a place's drawing never changes between
// loads and two places never come out identical.
export function seededRandom(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
}

export function Plates({ p }) {
  return (
    <defs>
      <pattern
        id={`${p}-h1`}
        width="9"
        height="9"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="9" height="9" fill={W} />
        <line x1="0" y1="0" x2="0" y2="9" stroke={K} strokeWidth="0.7" />
      </pattern>
      <pattern
        id={`${p}-h2`}
        width="5"
        height="5"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="5" height="5" fill={W} />
        <line x1="0" y1="0" x2="0" y2="5" stroke={K} strokeWidth="0.9" />
      </pattern>
      <pattern
        id={`${p}-h3`}
        width="3"
        height="3"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="3" height="3" fill={W} />
        <line x1="0" y1="0" x2="0" y2="3" stroke={K} strokeWidth="1.3" />
      </pattern>
      <pattern id={`${p}-cross`} width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={W} />
        <line x1="0" y1="0" x2="0" y2="6" stroke={K} strokeWidth="0.7" />
        <line x1="0" y1="0" x2="6" y2="0" stroke={K} strokeWidth="0.7" />
      </pattern>
      <pattern id={`${p}-stipple`} width="7" height="7" patternUnits="userSpaceOnUse">
        <rect width="7" height="7" fill={W} />
        <circle cx="1.6" cy="1.6" r="0.75" fill={K} />
        <circle cx="5.2" cy="5.2" r="0.6" fill={K} />
      </pattern>
      <pattern id={`${p}-brick`} width="24" height="12" patternUnits="userSpaceOnUse">
        <rect width="24" height="12" fill={W} />
        <line x1="0" y1="0" x2="24" y2="0" stroke={K} strokeWidth="0.6" />
        <line x1="0" y1="0" x2="0" y2="12" stroke={K} strokeWidth="0.6" />
        <line x1="12" y1="6" x2="12" y2="12" stroke={K} strokeWidth="0.6" />
        <line x1="0" y1="6" x2="24" y2="6" stroke={K} strokeWidth="0.6" />
      </pattern>
      <pattern id={`${p}-wave`} width="26" height="10" patternUnits="userSpaceOnUse">
        <rect width="26" height="10" fill={W} />
        <path d="M0 5 q6.5 -3 13 0 t13 0" fill="none" stroke={K} strokeWidth="0.7" />
      </pattern>
    </defs>
  )
}

// The sky is always ruled — it is what keeps the top of the plate from
// going blank when the Zoom crop lands there.
export function Sky() {
  return (
    <g>
      <rect width="800" height="600" fill={W} />
      {[24, 40, 58, 80, 106, 138, 176].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="800" y2={y} stroke={K} strokeWidth="0.6" />
      ))}
    </g>
  )
}

/* ── back: sky and horizon ──────────────────────────────────── */

const ridge = ({ p, r }) => {
  const pts = range(9)
    .map((i) => `${i * 100},${230 - Math.round(r() * 60)}`)
    .join(' ')
  return (
    <g>
      <polygon points={`0,300 ${pts} 800,300`} fill={`url(#${p}-h1)`} />
      <polyline points={pts} fill="none" stroke={K} strokeWidth="1.6" />
    </g>
  )
}

const peak = ({ p, r }) => {
  const x = 260 + Math.round(r() * 200)
  return (
    <g>
      <polygon
        points={`0,320 ${x - 220},190 ${x - 90},240 ${x},96 ${x + 130},210 ${x + 260},160 800,240 800,320`}
        fill={`url(#${p}-h2)`}
      />
      <polyline
        points={`0,320 ${x - 220},190 ${x - 90},240 ${x},96 ${x + 130},210 ${x + 260},160 800,240`}
        fill="none"
        stroke={K}
        strokeWidth="2.2"
      />
      {range(7).map((i) => (
        <path
          key={i}
          d={`M${x - 40 + i * 14} ${140 + i * 22} l${20 + i * 4} ${34 + i * 8}`}
          stroke={K}
          strokeWidth="0.8"
          fill="none"
        />
      ))}
    </g>
  )
}

const hills = ({ p, r }) => (
  <g>
    <path
      d={`M0 300 Q${140 + r() * 60} 196 300 250 T620 232 T800 262 L800 320 L0 320 Z`}
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="1.6"
    />
    {range(12).map((i) => (
      <path
        key={i}
        d={`M${40 + i * 62} ${256 + (i % 3) * 12} q14 -10 30 -2`}
        fill="none"
        stroke={K}
        strokeWidth="0.7"
      />
    ))}
  </g>
)

const canyon = ({ p }) => (
  <g>
    <polygon
      points="0,300 0,60 150,120 260,250 340,300"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2"
    />
    <polygon
      points="800,300 800,40 640,110 520,240 450,300"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(9).map((i) => (
      <path
        key={i}
        d={`M${20 + i * 26} ${110 + i * 18} l40 ${60 - i * 3}`}
        stroke={K}
        strokeWidth="0.7"
        fill="none"
      />
    ))}
    {range(9).map((i) => (
      <path
        key={`b${i}`}
        d={`M${780 - i * 24} ${96 + i * 18} l-40 ${58 - i * 3}`}
        stroke={K}
        strokeWidth="0.7"
        fill="none"
      />
    ))}
  </g>
)

const bay = ({ p }) => (
  <g>
    <rect x="0" y="240" width="800" height="120" fill={`url(#${p}-wave)`} />
    <line x1="0" y1="240" x2="800" y2="240" stroke={K} strokeWidth="1.4" />
    <polyline
      points="0,236 120,228 260,234 420,224 560,232 700,222 800,230"
      fill="none"
      stroke={K}
      strokeWidth="1"
    />
  </g>
)

const towers = ({ r }) => (
  <g>
    {range(3).map((i) => {
      const x = 180 + i * 220 + Math.round(r() * 30)
      return (
        <g key={i}>
          <path
            d={`M${x} 250 L${x - 14} 120 M${x} 250 L${x + 14} 120 M${x - 12} 168 L${x + 12} 168 M${x - 7} 132 L${x + 7} 132`}
            stroke={K}
            strokeWidth="1.6"
            fill="none"
          />
          <path d={`M${x - 14} 120 L${x + 14} 120`} stroke={K} strokeWidth="2" />
        </g>
      )
    })}
  </g>
)

/* ── mid: the subject ───────────────────────────────────────── */

const mission = ({ p }) => (
  <g>
    <rect x="150" y="150" width="112" height="300" fill={W} stroke={K} strokeWidth="2.4" />
    <path
      d="M150 150 L150 128 L182 128 L182 108 L230 108 L230 128 L262 128 L262 150 Z"
      fill={W}
      stroke={K}
      strokeWidth="2.4"
    />
    <path d="M206 108 L206 84 M194 96 L218 96" stroke={K} strokeWidth="3" />
    {[
      [178, 180],
      [234, 180],
      [178, 268],
      [234, 268],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <path
          d={`M${cx - 20} ${cy + 30} L${cx - 20} ${cy} A20 20 0 0 1 ${cx + 20} ${cy} L${cx + 20} ${cy + 30} Z`}
          fill={`url(#${p}-h3)`}
          stroke={K}
          strokeWidth="2"
        />
        <path
          d={`M${cx - 10} ${cy + 20} Q${cx - 10} ${cy - 1} ${cx} ${cy - 1} Q${cx + 10} ${cy - 1} ${cx + 10} ${cy + 20} Z`}
          fill={W}
          stroke={K}
          strokeWidth="1.8"
        />
        <circle cx={cx} cy={cy + 28} r="2.2" fill={K} />
      </g>
    ))}
    {range(11).map((i) => (
      <line
        key={i}
        x1="166"
        y1={168 + i * 26}
        x2="262"
        y2={168 + i * 26}
        stroke={K}
        strokeWidth="0.7"
      />
    ))}
    <rect
      x="262"
      y="238"
      width="404"
      height="212"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path
      d="M252 238 L676 238 L666 214 L262 214 Z"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2.2"
    />
    <path
      d="M420 450 L420 330 A34 34 0 0 1 488 330 L488 450 Z"
      fill={`url(#${p}-cross)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <g transform="translate(454, 282)">
      {range(4).map((i) => (
        <circle
          key={i}
          cx={Math.cos((i * Math.PI) / 2) * 13}
          cy={Math.sin((i * Math.PI) / 2) * 13}
          r="13"
          fill={W}
          stroke={K}
          strokeWidth="2"
        />
      ))}
    </g>
  </g>
)

const adobe = ({ p }) => (
  <g>
    <rect
      x="230"
      y="280"
      width="340"
      height="170"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path
      d="M215 280 L585 280 L560 250 L240 250 Z"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2.2"
    />
    <rect
      x="360"
      y="360"
      width="60"
      height="90"
      fill={`url(#${p}-cross)`}
      stroke={K}
      strokeWidth="2"
    />
    {[270, 480].map((x, i) => (
      <rect
        key={i}
        x={x}
        y="326"
        width="46"
        height="52"
        fill={`url(#${p}-h3)`}
        stroke={K}
        strokeWidth="1.8"
      />
    ))}
  </g>
)

const civic = ({ p }) => (
  <g>
    <rect
      x="180"
      y="252"
      width="440"
      height="198"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="2.4"
    />
    {range(4).map((i) => (
      <rect
        key={i}
        x="196"
        y={266 + i * 46}
        width="408"
        height="26"
        fill={`url(#${p}-h3)`}
        stroke={K}
        strokeWidth="1.2"
      />
    ))}
    {range(9).map((i) => (
      <line
        key={`m${i}`}
        x1={196 + i * 51}
        y1="266"
        x2={196 + i * 51}
        y2="450"
        stroke={K}
        strokeWidth="1"
      />
    ))}
    <rect
      x="360"
      y="392"
      width="72"
      height="58"
      fill={`url(#${p}-cross)`}
      stroke={K}
      strokeWidth="2"
    />
  </g>
)

const dome = ({ p }) => (
  <g>
    <path d="M330 300 A80 80 0 0 1 490 300 Z" fill={`url(#${p}-h2)`} stroke={K} strokeWidth="2.4" />
    <rect
      x="322"
      y="300"
      width="176"
      height="20"
      fill={`url(#${p}-h3)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(6).map((i) => (
      <path
        key={i}
        d={`M410 220 Q${340 + i * 28} ${250 + i * 6} ${338 + i * 29} 300`}
        fill="none"
        stroke={K}
        strokeWidth="0.8"
      />
    ))}
  </g>
)

const school = ({ p }) => (
  <g>
    <rect
      x="140"
      y="300"
      width="520"
      height="150"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path
      d="M130 300 L670 300 L650 272 L150 272 Z"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(8).map((i) => (
      <g key={i}>
        <rect
          x={168 + i * 62}
          y="326"
          width="40"
          height="48"
          fill={`url(#${p}-h3)`}
          stroke={K}
          strokeWidth="1.6"
        />
        <line x1={168 + i * 62} y1="350" x2={208 + i * 62} y2="350" stroke={K} strokeWidth="1" />
      </g>
    ))}
    <rect
      x="368"
      y="398"
      width="64"
      height="52"
      fill={`url(#${p}-cross)`}
      stroke={K}
      strokeWidth="2"
    />
  </g>
)

const factory = ({ p }) => (
  <g>
    <rect
      x="90"
      y="300"
      width="620"
      height="150"
      fill={`url(#${p}-stipple)`}
      stroke={K}
      strokeWidth="2.4"
    />
    {range(7).map((i) => (
      <path
        key={i}
        d={`M${96 + i * 88} 300 L${96 + i * 88} 268 L${140 + i * 88} 300 Z`}
        fill={W}
        stroke={K}
        strokeWidth="1.8"
      />
    ))}
    {range(7).map((i) => (
      <rect
        key={`w${i}`}
        x={112 + i * 88}
        y="336"
        width="52"
        height="40"
        fill={`url(#${p}-h3)`}
        stroke={K}
        strokeWidth="1.4"
      />
    ))}
  </g>
)

const stacks = ({ r }) => (
  <g>
    {range(2).map((i) => {
      const x = 600 + i * 70 + Math.round(r() * 20)
      return (
        <g key={i}>
          <path
            d={`M${x} 300 L${x + 4} 150 L${x + 26} 150 L${x + 30} 300 Z`}
            fill={W}
            stroke={K}
            strokeWidth="2"
          />
          {range(5).map((k) => (
            <line
              key={k}
              x1={x + 2}
              y1={172 + k * 26}
              x2={x + 28}
              y2={172 + k * 26}
              stroke={K}
              strokeWidth="0.8"
            />
          ))}
        </g>
      )
    })}
  </g>
)

const warehouse = ({ p }) => (
  <g>
    <rect
      x="120"
      y="320"
      width="560"
      height="130"
      fill={`url(#${p}-stipple)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path
      d="M110 320 L690 320 L670 296 L130 296 Z"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(5).map((i) => (
      <rect
        key={i}
        x={152 + i * 108}
        y="356"
        width="72"
        height="94"
        fill={`url(#${p}-h1)`}
        stroke={K}
        strokeWidth="1.8"
      />
    ))}
  </g>
)

const shops = ({ p, r }) => (
  <g>
    {range(4).map((i) => {
      const x = 30 + i * 190
      const top = 250 + Math.round(r() * 24)
      return (
        <g key={i}>
          <rect
            x={x}
            y={top}
            width="176"
            height={450 - top}
            fill={`url(#${p}-stipple)`}
            stroke={K}
            strokeWidth="2.2"
          />
          <path
            d={`M${x - 6} ${top} L${x + 182} ${top} L${x + 182} ${top - 22} L${x - 6} ${top - 22} Z`}
            fill={`url(#${p}-h1)`}
            stroke={K}
            strokeWidth="2.2"
          />
          {range(3).map((k) => (
            <rect
              key={k}
              x={x + 20 + k * 50}
              y={top + 26}
              width="30"
              height="46"
              fill={`url(#${p}-h3)`}
              stroke={K}
              strokeWidth="1.8"
            />
          ))}
          <rect
            x={x + 16}
            y={top + 108}
            width="144"
            height="74"
            fill={`url(#${p}-cross)`}
            stroke={K}
            strokeWidth="2"
          />
        </g>
      )
    })}
  </g>
)

const awnings = () => (
  <g>
    {range(4).map((i) => {
      const x = 30 + i * 190
      return (
        <g key={i}>
          <path
            d={`M${x - 4} 296 L${x + 180} 296 L${x + 168} 264 L${x + 8} 264 Z`}
            fill={W}
            stroke={K}
            strokeWidth="1.8"
          />
          {range(8).map((k) => (
            <line
              key={k}
              x1={x + 10 + k * 21}
              y1="264"
              x2={x + 2 + k * 21}
              y2="296"
              stroke={K}
              strokeWidth="0.9"
            />
          ))}
        </g>
      )
    })}
  </g>
)

const marquee = () => (
  <g>
    <rect x="214" y="192" width="216" height="50" fill={W} stroke={K} strokeWidth="2.6" />
    <text
      x="322"
      y="224"
      textAnchor="middle"
      fontFamily={FACE}
      fontWeight="700"
      fontSize="17"
      letterSpacing="2"
      fill={K}
    >
      NILES
    </text>
    {range(14).map((i) => (
      <circle key={i} cx={222 + i * 15.5} cy="250" r="3" fill={W} stroke={K} strokeWidth="1.4" />
    ))}
  </g>
)

const depot = ({ p }) => (
  <g>
    <rect
      x="180"
      y="290"
      width="380"
      height="140"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path
      d="M150 290 L590 290 L560 254 L180 254 Z"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2.2"
    />
    {range(4).map((i) => (
      <rect
        key={i}
        x={212 + i * 88}
        y="318"
        width="52"
        height="56"
        fill={`url(#${p}-h3)`}
        stroke={K}
        strokeWidth="1.8"
      />
    ))}
    <rect
      x="330"
      y="386"
      width="70"
      height="44"
      fill={`url(#${p}-cross)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(6).map((i) => (
      <line
        key={`b${i}`}
        x1={190 + i * 70}
        y1="254"
        x2={190 + i * 70}
        y2="290"
        stroke={K}
        strokeWidth="1.2"
      />
    ))}
  </g>
)

const watertower = ({ p }) => (
  <g>
    <path
      d="M620 250 L620 200 L724 200 L724 250 Z"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2.2"
    />
    <path d="M614 200 L730 200 L706 176 L638 176 Z" fill={W} stroke={K} strokeWidth="2" />
    <path
      d="M630 250 L636 380 M714 250 L708 380 M660 250 L664 380 M684 250 L682 380"
      stroke={K}
      strokeWidth="2"
    />
    <path d="M632 300 L712 306 M634 340 L710 344" stroke={K} strokeWidth="1.2" />
  </g>
)

const guideway = ({ p }) => (
  <g>
    <rect
      x="0"
      y="270"
      width="800"
      height="42"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2.2"
    />
    {range(5).map((i) => (
      <path
        key={i}
        d={`M${70 + i * 170} 312 L${58 + i * 170} 450 L${106 + i * 170} 450 L${94 + i * 170} 312 Z`}
        fill={W}
        stroke={K}
        strokeWidth="2"
      />
    ))}
  </g>
)

const train = ({ p }) => (
  <g>
    <rect x="150" y="196" width="460" height="76" rx="14" fill={W} stroke={K} strokeWidth="2.4" />
    {range(6).map((i) => (
      <rect
        key={i}
        x={172 + i * 74}
        y="212"
        width="50"
        height="34"
        fill={`url(#${p}-h3)`}
        stroke={K}
        strokeWidth="1.6"
      />
    ))}
    <line x1="150" y1="258" x2="610" y2="258" stroke={K} strokeWidth="1.4" />
  </g>
)

const locomotive = ({ p }) => (
  <g>
    <rect
      x="220"
      y="300"
      width="240"
      height="90"
      fill={`url(#${p}-h2)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path
      d="M200 390 L200 320 A44 44 0 0 1 288 320 L288 390 Z"
      fill={W}
      stroke={K}
      strokeWidth="2.4"
    />
    <path d="M226 276 L226 246 L262 246 L262 276 Z" fill={W} stroke={K} strokeWidth="2" />
    <path
      d="M214 246 L274 246 L266 226 L222 226 Z"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="1.8"
    />
    {[240, 320, 400].map((cx, i) => (
      <g key={i}>
        <circle cx={cx} cy="404" r="26" fill={W} stroke={K} strokeWidth="2.6" />
        {range(8).map((s) => (
          <line
            key={s}
            x1={cx}
            y1="404"
            x2={cx + Math.cos((s * Math.PI) / 4) * 24}
            y2={404 + Math.sin((s * Math.PI) / 4) * 24}
            stroke={K}
            strokeWidth="1"
          />
        ))}
      </g>
    ))}
  </g>
)

const victorian = ({ p }) => (
  <g>
    <rect
      x="230"
      y="280"
      width="300"
      height="170"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path d="M214 280 L546 280 L380 178 Z" fill={`url(#${p}-h1)`} stroke={K} strokeWidth="2.2" />
    <path
      d="M352 178 L352 140 L408 140 L408 178 Z"
      fill={`url(#${p}-h3)`}
      stroke={K}
      strokeWidth="2"
    />
    <path d="M344 140 L416 140 L380 112 Z" fill={`url(#${p}-h2)`} stroke={K} strokeWidth="1.8" />
    <path d="M380 112 L380 90" stroke={K} strokeWidth="2.4" />
    {range(4).map((i) => (
      <rect
        key={i}
        x={256 + i * 70}
        y="312"
        width="42"
        height="60"
        fill={`url(#${p}-h3)`}
        stroke={K}
        strokeWidth="1.8"
      />
    ))}
    <rect
      x="356"
      y="392"
      width="52"
      height="58"
      fill={`url(#${p}-cross)`}
      stroke={K}
      strokeWidth="2"
    />
    <path d="M222 288 L538 288" stroke={K} strokeWidth="1.6" />
    {range(14).map((i) => (
      <line
        key={`t${i}`}
        x1={236 + i * 22}
        y1="280"
        x2={236 + i * 22}
        y2="292"
        stroke={K}
        strokeWidth="1"
      />
    ))}
  </g>
)

const barn = ({ p }) => (
  <g>
    <rect
      x="250"
      y="310"
      width="280"
      height="140"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path d="M236 310 L544 310 L500 258 L280 258 Z" fill={W} stroke={K} strokeWidth="2.2" />
    <path d="M338 450 L338 356 L442 356 L442 450" fill={W} stroke={K} strokeWidth="2.2" />
    <path d="M338 356 L442 450 M442 356 L338 450" stroke={K} strokeWidth="1.4" />
    {range(9).map((i) => (
      <line
        key={i}
        x1={258 + i * 31}
        y1="310"
        x2={258 + i * 31}
        y2="450"
        stroke={K}
        strokeWidth="0.8"
      />
    ))}
  </g>
)

const windmill = () => (
  <g>
    <path d="M560 450 L588 190 L620 190 L648 450" fill="none" stroke={K} strokeWidth="2.4" />
    {range(5).map((i) => (
      <line
        key={i}
        x1={568 + i * 4}
        y1={410 - i * 52}
        x2={640 - i * 4}
        y2={410 - i * 52}
        stroke={K}
        strokeWidth="1.2"
      />
    ))}
    <g transform="translate(604, 174)">
      {range(6).map((i) => (
        <path
          key={i}
          d={`M0 0 L${Math.cos((i * Math.PI) / 3) * 44} ${Math.sin((i * Math.PI) / 3) * 44}`}
          stroke={K}
          strokeWidth="1.8"
        />
      ))}
      <circle r="44" fill="none" stroke={K} strokeWidth="1.6" />
      <circle r="7" fill={W} stroke={K} strokeWidth="2" />
    </g>
  </g>
)

const forge = ({ p }) => (
  <g>
    <rect
      x="290"
      y="330"
      width="220"
      height="120"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="2.2"
    />
    <path d="M330 330 L330 288 L370 288 L370 330 Z" fill={W} stroke={K} strokeWidth="2" />
    <rect
      x="400"
      y="372"
      width="70"
      height="78"
      fill={`url(#${p}-h3)`}
      stroke={K}
      strokeWidth="1.8"
    />
  </g>
)

const bridge = ({ p }) => (
  <g>
    <rect
      x="0"
      y="300"
      width="800"
      height="18"
      fill={`url(#${p}-h3)`}
      stroke={K}
      strokeWidth="2.2"
    />
    {range(6).map((i) => (
      <path
        key={i}
        d={`M${40 + i * 140} 300 L${110 + i * 140} 216 L${180 + i * 140} 300`}
        fill="none"
        stroke={K}
        strokeWidth="2"
      />
    ))}
    {range(6).map((i) => (
      <line
        key={`v${i}`}
        x1={110 + i * 140}
        y1="216"
        x2={110 + i * 140}
        y2="300"
        stroke={K}
        strokeWidth="1.4"
      />
    ))}
    {range(9).map((i) => (
      <path
        key={`p${i}`}
        d={`M${30 + i * 96} 318 L${34 + i * 96} 440 L${62 + i * 96} 440 L${58 + i * 96} 318 Z`}
        fill={`url(#${p}-h2)`}
        stroke={K}
        strokeWidth="1.6"
      />
    ))}
  </g>
)

const trestle = () => (
  <g>
    <rect x="0" y="288" width="800" height="16" fill={W} stroke={K} strokeWidth="2" />
    {range(11).map((i) => (
      <g key={i}>
        <path
          d={`M${26 + i * 76} 304 L${34 + i * 76} 450 M${68 + i * 76} 304 L${60 + i * 76} 450`}
          stroke={K}
          strokeWidth="1.8"
        />
        <path
          d={`M${28 + i * 76} 356 L${66 + i * 76} 356 M${26 + i * 76} 304 L${60 + i * 76} 450`}
          stroke={K}
          strokeWidth="0.9"
        />
      </g>
    ))}
  </g>
)

const quarry = ({ p }) => (
  <g>
    <path
      d="M0 320 L200 300 L280 250 L520 240 L620 290 L800 300 L800 430 L0 430 Z"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(5).map((i) => (
      <path
        key={i}
        d={`M${60 + i * 30} ${340 + i * 20} L${700 - i * 40} ${332 + i * 20}`}
        fill="none"
        stroke={K}
        strokeWidth="1.1"
      />
    ))}
    {range(16).map((i) => (
      <line
        key={`s${i}`}
        x1={40 + i * 48}
        y1="300"
        x2={54 + i * 48}
        y2="430"
        stroke={K}
        strokeWidth="0.6"
      />
    ))}
  </g>
)

const water = ({ p }) => (
  <g>
    <rect x="0" y="330" width="800" height="270" fill={`url(#${p}-wave)`} />
    <line x1="0" y1="330" x2="800" y2="330" stroke={K} strokeWidth="1.8" />
    {range(6).map((i) => (
      <line
        key={i}
        x1={60 + i * 130}
        y1={368 + i * 30}
        x2={200 + i * 130}
        y2={368 + i * 30}
        stroke={K}
        strokeWidth="1.4"
      />
    ))}
  </g>
)

const pond = ({ p }) => (
  <g>
    <ellipse
      cx="400"
      cy="410"
      rx="330"
      ry="90"
      fill={`url(#${p}-wave)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(5).map((i) => (
      <line
        key={i}
        x1={200 + i * 40}
        y1={392 + i * 16}
        x2={330 + i * 40}
        y2={392 + i * 16}
        stroke={K}
        strokeWidth="1.1"
      />
    ))}
  </g>
)

const saltponds = ({ p }) => (
  <g>
    {range(3).map((row) =>
      range(3).map((col) => (
        <rect
          key={`${row}-${col}`}
          x={20 + col * 262}
          y={318 + row * 84}
          width="248"
          height="72"
          fill={row % 2 === col % 2 ? `url(#${p}-stipple)` : `url(#${p}-h1)`}
          stroke={K}
          strokeWidth="1.8"
        />
      ))
    )}
  </g>
)

const marsh = ({ p }) => (
  <g>
    <rect x="0" y="330" width="800" height="270" fill={`url(#${p}-stipple)`} />
    {range(18).map((i) => (
      <path
        key={i}
        d={`M${20 + i * 44} 430 q6 -40 -2 -66 M${28 + i * 44} 430 q10 -36 6 -58`}
        fill="none"
        stroke={K}
        strokeWidth="1.1"
      />
    ))}
    <line x1="0" y1="430" x2="800" y2="430" stroke={K} strokeWidth="1.4" />
  </g>
)

const mound = ({ p }) => (
  <g>
    <path d="M180 430 Q400 300 620 430 Z" fill={`url(#${p}-stipple)`} stroke={K} strokeWidth="2" />
    {range(24).map((i) => (
      <ellipse
        key={i}
        cx={220 + ((i * 61) % 380)}
        cy={360 + ((i * 37) % 60)}
        rx="6"
        ry="3.4"
        fill={W}
        stroke={K}
        strokeWidth="0.8"
      />
    ))}
  </g>
)

const ruin = ({ p }) => (
  <g>
    <path
      d="M250 450 L250 300 L330 300 L330 350 L400 350 L400 290 L470 290 L470 450 Z"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="2.4"
    />
    <path
      d="M470 290 L520 330 L520 450 L470 450"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="1.8"
    />
  </g>
)

const plaza = ({ p }) => (
  <g>
    <rect
      x="120"
      y="380"
      width="560"
      height="90"
      fill={`url(#${p}-brick)`}
      stroke={K}
      strokeWidth="1.8"
    />
    {range(4).map((i) => (
      <rect
        key={i}
        x={168 + i * 138}
        y="330"
        width="14"
        height="50"
        fill={W}
        stroke={K}
        strokeWidth="1.8"
      />
    ))}
  </g>
)

const fountain = ({ p }) => (
  <g>
    <ellipse
      cx="400"
      cy="430"
      rx="120"
      ry="34"
      fill={`url(#${p}-wave)`}
      stroke={K}
      strokeWidth="2.2"
    />
    <path d="M400 396 L400 340 M370 366 q30 -40 60 0" fill="none" stroke={K} strokeWidth="1.8" />
    <circle cx="400" cy="332" r="9" fill={W} stroke={K} strokeWidth="2" />
  </g>
)

const dock = () => (
  <g>
    <rect x="240" y="392" width="330" height="16" fill={W} stroke={K} strokeWidth="2" />
    {range(6).map((i) => (
      <line
        key={i}
        x1={264 + i * 60}
        y1="408"
        x2={264 + i * 60}
        y2="470"
        stroke={K}
        strokeWidth="2.2"
      />
    ))}
  </g>
)

const tract = ({ p, r }) => (
  <g>
    {range(5).map((i) => {
      const x = 20 + i * 158
      const top = 320 + Math.round(r() * 20)
      return (
        <g key={i}>
          <rect
            x={x}
            y={top}
            width="130"
            height={450 - top}
            fill={`url(#${p}-stipple)`}
            stroke={K}
            strokeWidth="2"
          />
          <path
            d={`M${x - 8} ${top} L${x + 138} ${top} L${x + 65} ${top - 44} Z`}
            fill={`url(#${p}-h1)`}
            stroke={K}
            strokeWidth="1.8"
          />
          <rect
            x={x + 22}
            y={top + 26}
            width="34"
            height="34"
            fill={`url(#${p}-h3)`}
            stroke={K}
            strokeWidth="1.4"
          />
          <rect
            x={x + 78}
            y={top + 26}
            width="30"
            height="60"
            fill={`url(#${p}-cross)`}
            stroke={K}
            strokeWidth="1.4"
          />
        </g>
      )
    })}
  </g>
)

const stairs = () => (
  <g>
    {range(12).map((i) => (
      <path
        key={i}
        d={`M${280 + i * 8} ${450 - i * 22} L${520 - i * 6} ${450 - i * 22} L${520 - i * 6} ${440 - i * 22} L${280 + i * 8} ${440 - i * 22} Z`}
        fill={W}
        stroke={K}
        strokeWidth="1.6"
      />
    ))}
  </g>
)

const gate = () => (
  <g>
    <path d="M280 450 L280 320 M520 450 L520 320" stroke={K} strokeWidth="3.4" />
    <path d="M280 330 L520 330" stroke={K} strokeWidth="2.6" />
    {range(7).map((i) => (
      <line
        key={i}
        x1={300 + i * 34}
        y1="330"
        x2={300 + i * 34}
        y2="430"
        stroke={K}
        strokeWidth="1.4"
      />
    ))}
  </g>
)

/* ── front: between you and the subject ─────────────────────── */

const road = ({ p }) => (
  <g>
    <line x1="0" y1="450" x2="800" y2="450" stroke={K} strokeWidth="2.6" />
    <rect x="0" y="450" width="800" height="150" fill={`url(#${p}-h1)`} />
    <line x1="0" y1="524" x2="800" y2="524" stroke={K} strokeWidth="3" strokeDasharray="40 30" />
  </g>
)

const tracks = ({ p }) => (
  <g>
    <rect x="0" y="452" width="800" height="120" fill={`url(#${p}-stipple)`} />
    <line x1="0" y1="486" x2="800" y2="486" stroke={K} strokeWidth="2.4" />
    <line x1="0" y1="530" x2="800" y2="530" stroke={K} strokeWidth="2.4" />
    {range(28).map((i) => (
      <line key={i} x1={i * 29} y1="478" x2={i * 29} y2="538" stroke={K} strokeWidth="1.2" />
    ))}
  </g>
)

const trail = ({ p }) => (
  <g>
    <path
      d="M340 600 Q400 520 380 450 L440 450 Q470 530 520 600 Z"
      fill={`url(#${p}-stipple)`}
      stroke={K}
      strokeWidth="1.6"
    />
    {range(8).map((i) => (
      <path
        key={i}
        d={`M${356 + i * 4} ${580 - i * 16} q30 -6 62 0`}
        fill="none"
        stroke={K}
        strokeWidth="0.7"
      />
    ))}
  </g>
)

const levee = ({ p }) => (
  <g>
    <path
      d="M0 500 L200 462 L560 462 L800 500 L800 540 L0 540 Z"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="2"
    />
    {range(20).map((i) => (
      <line
        key={i}
        x1={20 + i * 40}
        y1="466"
        x2={30 + i * 40}
        y2="500"
        stroke={K}
        strokeWidth="0.7"
      />
    ))}
  </g>
)

const boardwalk = () => (
  <g>
    <path d="M280 600 L360 452 L470 452 L560 600 Z" fill={W} stroke={K} strokeWidth="2.2" />
    {range(12).map((i) => (
      <line
        key={i}
        x1={352 - i * 7}
        y1={462 + i * 12}
        x2={478 + i * 8}
        y2={462 + i * 12}
        stroke={K}
        strokeWidth="1.3"
      />
    ))}
    <path d="M352 452 L300 600 M478 452 L540 600" stroke={K} strokeWidth="2" />
  </g>
)

const creek = ({ p }) => (
  <g>
    <path
      d="M0 520 Q200 470 380 512 T800 494 L800 560 Q560 588 320 552 T0 570 Z"
      fill={`url(#${p}-wave)`}
      stroke={K}
      strokeWidth="1.8"
    />
  </g>
)

const lawn = () => (
  <g>
    <rect x="0" y="450" width="800" height="150" fill={W} />
    <line x1="0" y1="450" x2="800" y2="450" stroke={K} strokeWidth="2.2" />
    {range(120).map((i) => (
      <path
        key={i}
        d={`M${(i * 37) % 800} ${462 + ((i * 53) % 130)} l6 -11 l6 11`}
        fill="none"
        stroke={K}
        strokeWidth="0.8"
      />
    ))}
  </g>
)

const grass = () => (
  <g>
    <rect x="0" y="430" width="800" height="170" fill={W} />
    {range(150).map((i) => (
      <path
        key={i}
        d={`M${(i * 31) % 800} ${442 + ((i * 47) % 150)} q5 -14 11 -2`}
        fill="none"
        stroke={K}
        strokeWidth="0.9"
      />
    ))}
  </g>
)

const field = ({ p }) => (
  <g>
    <rect
      x="0"
      y="450"
      width="800"
      height="150"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="1.4"
    />
    <ellipse cx="400" cy="530" rx="250" ry="56" fill="none" stroke={K} strokeWidth="2" />
    <line x1="400" y1="474" x2="400" y2="586" stroke={K} strokeWidth="1.6" />
  </g>
)

const lot = ({ p }) => (
  <g>
    <rect x="0" y="450" width="800" height="150" fill={`url(#${p}-stipple)`} />
    <line x1="0" y1="450" x2="800" y2="450" stroke={K} strokeWidth="2.2" />
    {range(14).map((i) => (
      <line key={i} x1={i * 58} y1="470" x2={i * 58 - 20} y2="600" stroke={K} strokeWidth="1.1" />
    ))}
  </g>
)

const gravel = ({ p }) => (
  <g>
    <rect x="0" y="450" width="800" height="150" fill={`url(#${p}-stipple)`} />
    {range(60).map((i) => (
      <circle
        key={i}
        cx={(i * 71) % 800}
        cy={470 + ((i * 43) % 120)}
        r={1.6 + (i % 3)}
        fill={W}
        stroke={K}
        strokeWidth="0.7"
      />
    ))}
  </g>
)

const stones = () => (
  <g>
    {range(9).map((i) => (
      <path
        key={i}
        d={`M${70 + i * 82} 520 L${70 + i * 82} 460 A14 14 0 0 1 ${98 + i * 82} 460 L${98 + i * 82} 520 Z`}
        fill={W}
        stroke={K}
        strokeWidth="1.8"
      />
    ))}
    <line x1="0" y1="520" x2="800" y2="520" stroke={K} strokeWidth="1.6" />
  </g>
)

const tules = ({ p }) => (
  <g>
    {range(30).map((i) => (
      <g key={i}>
        <path d={`M${10 + i * 27} 600 q4 -70 -2 -104`} fill="none" stroke={K} strokeWidth="1.2" />
        <ellipse
          cx={8 + i * 27}
          cy={492}
          rx="3.4"
          ry="9"
          fill={`url(#${p}-h3)`}
          stroke={K}
          strokeWidth="0.9"
        />
      </g>
    ))}
  </g>
)

const orchard = () => (
  <g>
    {range(4).map((row) =>
      range(6).map((col) => {
        const x = 60 + col * 130 - row * 18
        const y = 470 + row * 34
        return (
          <g key={`${row}-${col}`}>
            <path d={`M${x} ${y + 24} L${x} ${y}`} stroke={K} strokeWidth="2.4" />
            <circle cx={x} cy={y - 12} r={16 - row * 2} fill={W} stroke={K} strokeWidth="1.3" />
          </g>
        )
      })
    )}
  </g>
)

const vines = () => (
  <g>
    {range(6).map((i) => (
      <g key={i}>
        <line x1="0" y1={470 + i * 24} x2="800" y2={462 + i * 24} stroke={K} strokeWidth="1" />
        {range(16).map((k) => (
          <path
            key={k}
            d={`M${20 + k * 50} ${470 + i * 24} q6 -12 12 0`}
            fill="none"
            stroke={K}
            strokeWidth="0.9"
          />
        ))}
      </g>
    ))}
  </g>
)

const oaks = ({ r }) => (
  <g>
    {range(3).map((i) => {
      const x = 70 + i * 300 + Math.round(r() * 60)
      const y = 470
      return (
        <g key={i}>
          <path
            d={`M${x} ${y + 90} L${x} ${y} M${x} ${y + 30} L${x - 22} ${y + 8} M${x} ${y + 44} L${x + 20} ${y + 20}`}
            stroke={K}
            strokeWidth="4"
            fill="none"
          />
          {range(8).map((k) => (
            <ellipse
              key={k}
              cx={x - 40 + ((k * 41) % 80)}
              cy={y - 24 + ((k * 29) % 44)}
              rx={20 + (k % 3) * 6}
              ry={13 + (k % 2) * 6}
              fill={W}
              stroke={K}
              strokeWidth="1.2"
            />
          ))}
        </g>
      )
    })}
  </g>
)

const olives = ({ p, r }) => (
  <g>
    {range(4).map((i) => {
      const x = 60 + i * 210 + Math.round(r() * 30)
      return (
        <g key={i}>
          <path d={`M${x} 560 L${x} 486`} stroke={K} strokeWidth="5" />
          {range(7).map((k) => (
            <ellipse
              key={k}
              cx={x - 34 + ((k * 37) % 68)}
              cy={452 + ((k * 23) % 34)}
              rx="17"
              ry="10"
              fill={`url(#${p}-h1)`}
              stroke={K}
              strokeWidth="1.1"
            />
          ))}
        </g>
      )
    })}
  </g>
)

const palms = ({ r }) => (
  <g>
    {range(5).map((i) => {
      const x = 60 + i * 175 + Math.round(r() * 24)
      const top = 300 + (i % 2) * 40
      return (
        <g key={i}>
          <path
            d={`M${x} 560 Q${x + 8} ${(560 + top) / 2} ${x} ${top}`}
            fill="none"
            stroke={K}
            strokeWidth="5"
          />
          {range(9).map((k) => (
            <path
              key={k}
              d={`M${x} ${top} q${Math.cos((k * Math.PI) / 8 + 3.4) * 60} ${Math.sin((k * Math.PI) / 8 + 3.4) * 40 - 14} ${Math.cos((k * Math.PI) / 8 + 3.4) * 78} ${Math.sin((k * Math.PI) / 8 + 3.4) * 52 + 16}`}
              fill="none"
              stroke={K}
              strokeWidth="1.4"
            />
          ))}
        </g>
      )
    })}
  </g>
)

const eucalyptus = ({ r }) => (
  <g>
    {range(4).map((i) => {
      const x = 80 + i * 210 + Math.round(r() * 40)
      return (
        <g key={i}>
          <path d={`M${x} 560 L${x + 6} 190`} stroke={K} strokeWidth="6" />
          {range(12).map((k) => (
            <ellipse
              key={k}
              cx={x - 34 + ((k * 47) % 70)}
              cy={214 + ((k * 53) % 220)}
              rx="15"
              ry="26"
              fill={W}
              stroke={K}
              strokeWidth="1.1"
            />
          ))}
        </g>
      )
    })}
  </g>
)

const poles = ({ r }) => (
  <g>
    {range(4).map((i) => {
      const x = 104 + i * 206 + Math.round(r() * 20)
      return (
        <g key={i}>
          <line x1={x} y1="470" x2={x} y2="250" stroke={K} strokeWidth="4" />
          <line x1={x - 26} y1="266" x2={x + 26} y2="266" stroke={K} strokeWidth="2.4" />
          <line x1={x - 20} y1="288" x2={x + 20} y2="288" stroke={K} strokeWidth="2.4" />
        </g>
      )
    })}
    {range(3).map((i) => (
      <path
        key={i}
        d={`M${104 + i * 206} 264 Q${207 + i * 206} ${284 + i * 4} ${310 + i * 206} 264`}
        fill="none"
        stroke={K}
        strokeWidth="1.1"
      />
    ))}
  </g>
)

const flagpole = () => (
  <g>
    <line x1="660" y1="470" x2="660" y2="180" stroke={K} strokeWidth="4" />
    <path d="M660 192 L740 208 L660 226 Z" fill={W} stroke={K} strokeWidth="2" />
    <circle cx="660" cy="174" r="6" fill={W} stroke={K} strokeWidth="2" />
  </g>
)

const post = () => (
  <g>
    <rect x="392" y="300" width="10" height="150" fill={W} stroke={K} strokeWidth="2.4" />
    <rect x="402" y="304" width="34" height="22" fill={W} stroke={K} strokeWidth="2" />
  </g>
)

const playground = ({ p }) => (
  <g>
    <path
      d="M180 470 L240 380 L300 470 M240 380 L420 380 M420 470 L420 380"
      stroke={K}
      strokeWidth="3"
      fill="none"
    />
    {range(2).map((i) => (
      <g key={i}>
        <line x1={290 + i * 60} y1="380" x2={290 + i * 60} y2="440" stroke={K} strokeWidth="1.6" />
        <rect
          x={278 + i * 60}
          y="440"
          width="24"
          height="7"
          fill={W}
          stroke={K}
          strokeWidth="1.4"
        />
      </g>
    ))}
    <path
      d="M500 470 L500 410 L620 410 L620 470"
      fill={`url(#${p}-h1)`}
      stroke={K}
      strokeWidth="2"
    />
  </g>
)

const birds = () => (
  <g>
    {range(9).map((i) => (
      <path
        key={i}
        d={`M${90 + i * 78} ${120 + ((i * 37) % 90)} q10 -9 20 0 q10 -9 20 0`}
        fill="none"
        stroke={K}
        strokeWidth="1.4"
      />
    ))}
  </g>
)

const geese = () => (
  <g>
    {range(4).map((i) => {
      const x = 200 + i * 120
      return (
        <g key={i}>
          <ellipse cx={x} cy="500" rx="26" ry="14" fill={W} stroke={K} strokeWidth="1.8" />
          <path
            d={`M${x + 18} 492 q10 -12 4 -26 q-2 -8 -12 -6`}
            fill={W}
            stroke={K}
            strokeWidth="1.8"
          />
        </g>
      )
    })}
  </g>
)

// ── the vocabulary, and which band each word sits in ──────────
export const PARTS = {
  // back
  ridge: { layer: 0, draw: ridge },
  peak: { layer: 0, draw: peak },
  hills: { layer: 0, draw: hills },
  canyon: { layer: 0, draw: canyon },
  bay: { layer: 0, draw: bay },
  towers: { layer: 0, draw: towers },

  // mid
  mission: { layer: 1, draw: mission },
  adobe: { layer: 1, draw: adobe },
  civic: { layer: 1, draw: civic },
  dome: { layer: 1, draw: dome },
  school: { layer: 1, draw: school },
  factory: { layer: 1, draw: factory },
  stacks: { layer: 1, draw: stacks },
  warehouse: { layer: 1, draw: warehouse },
  shops: { layer: 1, draw: shops },
  awnings: { layer: 1, draw: awnings },
  marquee: { layer: 1, draw: marquee },
  depot: { layer: 1, draw: depot },
  watertower: { layer: 1, draw: watertower },
  guideway: { layer: 1, draw: guideway },
  train: { layer: 1, draw: train },
  locomotive: { layer: 1, draw: locomotive },
  victorian: { layer: 1, draw: victorian },
  barn: { layer: 1, draw: barn },
  windmill: { layer: 1, draw: windmill },
  forge: { layer: 1, draw: forge },
  bridge: { layer: 1, draw: bridge },
  trestle: { layer: 1, draw: trestle },
  quarry: { layer: 1, draw: quarry },
  water: { layer: 1, draw: water },
  pond: { layer: 1, draw: pond },
  saltponds: { layer: 1, draw: saltponds },
  marsh: { layer: 1, draw: marsh },
  mound: { layer: 1, draw: mound },
  ruin: { layer: 1, draw: ruin },
  plaza: { layer: 1, draw: plaza },
  fountain: { layer: 1, draw: fountain },
  dock: { layer: 1, draw: dock },
  tract: { layer: 1, draw: tract },
  stairs: { layer: 1, draw: stairs },
  gate: { layer: 1, draw: gate },

  // front
  road: { layer: 2, draw: road },
  tracks: { layer: 2, draw: tracks },
  trail: { layer: 2, draw: trail },
  levee: { layer: 2, draw: levee },
  boardwalk: { layer: 2, draw: boardwalk },
  creek: { layer: 2, draw: creek },
  lawn: { layer: 2, draw: lawn },
  grass: { layer: 2, draw: grass },
  field: { layer: 2, draw: field },
  lot: { layer: 2, draw: lot },
  gravel: { layer: 2, draw: gravel },
  stones: { layer: 2, draw: stones },
  tules: { layer: 2, draw: tules },
  orchard: { layer: 2, draw: orchard },
  vines: { layer: 2, draw: vines },
  oaks: { layer: 2, draw: oaks },
  olives: { layer: 2, draw: olives },
  palms: { layer: 2, draw: palms },
  eucalyptus: { layer: 2, draw: eucalyptus },
  poles: { layer: 2, draw: poles },
  flagpole: { layer: 2, draw: flagpole },
  post: { layer: 2, draw: post },
  playground: { layer: 2, draw: playground },
  birds: { layer: 2, draw: birds },
  geese: { layer: 2, draw: geese },
}
