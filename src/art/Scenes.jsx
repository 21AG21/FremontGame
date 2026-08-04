// Line engravings: one ink on one paper. No grays anywhere — all
// shading is hatch density, which is how engraving actually works.
// Swap for photographs and nothing else changes.
//
// The ink is a variable, not black: on the dark theme it cools to
// #08203A so the white plate stops glaring. The plate itself stays
// light in both modes — inverting a line drawing turns it into a
// photographic negative, which reads as a bug.

const range = (n) => Array.from({ length: n }, (_, i) => i)

const K = 'var(--art-ink)'
const W = 'var(--art-paper)'
const FACE = "'Work Sans', system-ui, sans-serif"

function Plates({ id }) {
  return (
    <defs>
      <pattern id={`${id}-h1`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="9" height="9" fill={W} />
        <line x1="0" y1="0" x2="0" y2="9" stroke={K} strokeWidth="0.7" />
      </pattern>
      <pattern id={`${id}-h2`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="5" height="5" fill={W} />
        <line x1="0" y1="0" x2="0" y2="5" stroke={K} strokeWidth="0.9" />
      </pattern>
      <pattern id={`${id}-h3`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="3" height="3" fill={W} />
        <line x1="0" y1="0" x2="0" y2="3" stroke={K} strokeWidth="1.3" />
      </pattern>
      <pattern id={`${id}-cross`} width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={W} />
        <line x1="0" y1="0" x2="0" y2="6" stroke={K} strokeWidth="0.7" />
        <line x1="0" y1="0" x2="6" y2="0" stroke={K} strokeWidth="0.7" />
      </pattern>
      <pattern id={`${id}-stipple`} width="7" height="7" patternUnits="userSpaceOnUse">
        <rect width="7" height="7" fill={W} />
        <circle cx="1.6" cy="1.6" r="0.75" fill={K} />
        <circle cx="5.2" cy="5.2" r="0.6" fill={K} />
      </pattern>
    </defs>
  )
}

// ── I. Mission San José ──────────────────────────────────────
export function Mission() {
  const p = 'msn'
  return (
    <svg viewBox="0 0 800 600" className="scene" preserveAspectRatio="xMidYMid slice">
      <Plates id={p} />
      <rect width="800" height="600" fill={W} />

      {/* sky: solid rules, thinning out by spacing rather than by tone */}
      {[26, 44, 64, 88, 116, 150, 192].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="800" y2={y} stroke={K} strokeWidth="0.6" />
      ))}

      {/* ridgeline behind */}
      <path d="M0 268 L118 232 L206 250 L318 196 L430 236 L536 210 L648 244 L800 214 L800 300 L0 300 Z"
        fill={`url(#${p}-h1)`} />
      <path d="M0 268 L118 232 L206 250 L318 196 L430 236 L536 210 L648 244 L800 214"
        fill="none" stroke={K} strokeWidth="1.6" />

      {/* ── campanario ── */}
      <rect x="150" y="150" width="112" height="300" fill={W} stroke={K} strokeWidth="2.4" />
      <path d="M150 150 L150 128 L182 128 L182 108 L230 108 L230 128 L262 128 L262 150 Z"
        fill={W} stroke={K} strokeWidth="2.4" />
      <path d="M206 108 L206 84" stroke={K} strokeWidth="3" />
      <path d="M194 96 L218 96" stroke={K} strokeWidth="3" />

      {/* four bells — what you stare at when it's cropped to 19x */}
      {[[178, 180], [234, 180], [178, 268], [234, 268]].map(([cx, cy], i) => (
        <g key={i}>
          <path d={`M${cx - 20} ${cy + 30} L${cx - 20} ${cy} A20 20 0 0 1 ${cx + 20} ${cy} L${cx + 20} ${cy + 30} Z`}
            fill={`url(#${p}-h3)`} stroke={K} strokeWidth="2" />
          <line x1={cx - 13} y1={cy - 6} x2={cx + 13} y2={cy - 6} stroke={K} strokeWidth="2" />
          <path d={`M${cx - 10} ${cy + 20} Q${cx - 10} ${cy - 1} ${cx} ${cy - 1} Q${cx + 10} ${cy - 1} ${cx + 10} ${cy + 20} Z`}
            fill={W} stroke={K} strokeWidth="1.8" />
          <line x1={cx - 13} y1={cy + 20} x2={cx + 13} y2={cy + 20} stroke={K} strokeWidth="1.8" />
          <line x1={cx} y1={cy + 20} x2={cx} y2={cy + 27} stroke={K} strokeWidth="1.2" />
          <circle cx={cx} cy={cy + 28} r="2.2" fill={K} />
        </g>
      ))}

      {/* adobe coursing — the tower is the most-magnified part of the
          plate, so it cannot carry any featureless area */}
      {range(11).map((i) => (
        <line key={i} x1="166" y1={168 + i * 26} x2="262" y2={168 + i * 26}
          stroke={K} strokeWidth="0.7" />
      ))}
      {range(11).map((i) => (
        <line key={`v${i}`} x1={i % 2 ? 198 : 214} y1={168 + i * 26} x2={i % 2 ? 198 : 214} y2={194 + i * 26}
          stroke={K} strokeWidth="0.7" />
      ))}

      {/* shadow side of the tower */}
      <rect x="150" y="150" width="16" height="300" fill={`url(#${p}-h2)`} stroke={K} strokeWidth="1" />

      {/* ── the long church ── */}
      <rect x="262" y="238" width="404" height="212" fill={W} stroke={K} strokeWidth="2.4" />
      <path d="M252 238 L676 238 L666 214 L262 214 Z" fill={`url(#${p}-h2)`} stroke={K} strokeWidth="2.2" />
      {range(18).map((i) => (
        <line key={i} x1={266 + i * 23} y1="238" x2={272 + i * 23} y2="214" stroke={K} strokeWidth="0.9" />
      ))}

      {/* wall texture */}
      <rect x="264" y="240" width="400" height="208" fill={`url(#${p}-stipple)`} />

      {/* arched doorway */}
      <path d="M420 450 L420 330 A34 34 0 0 1 488 330 L488 450 Z" fill={`url(#${p}-cross)`} stroke={K} strokeWidth="2.4" />
      <path d="M410 450 L410 326 A44 44 0 0 1 498 326 L498 450" fill="none" stroke={K} strokeWidth="2" />

      {/* quatrefoil */}
      <g transform="translate(454, 282)">
        {range(4).map((i) => (
          <circle key={i} cx={Math.cos((i * Math.PI) / 2) * 13} cy={Math.sin((i * Math.PI) / 2) * 13}
            r="13" fill={W} stroke={K} strokeWidth="2" />
        ))}
        <circle r="26" fill="none" stroke={K} strokeWidth="1.2" />
      </g>

      {/* deep-set windows */}
      {[320, 570, 630].map((x, i) => (
        <g key={i}>
          <rect x={x} y="300" width="34" height="62" fill={`url(#${p}-h3)`} stroke={K} strokeWidth="2" />
          <rect x={x - 5} y="295" width="44" height="72" fill="none" stroke={K} strokeWidth="1.1" />
        </g>
      ))}

      {/* buttresses */}
      {[300, 540, 660].map((x, i) => (
        <path key={i} d={`M${x} 450 L${x} 392 L${x + 20} 380 L${x + 20} 450 Z`}
          fill={`url(#${p}-h1)`} stroke={K} strokeWidth="1.6" />
      ))}

      {/* olive trees */}
      {[[62, 400], [726, 386], [110, 420]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y + 60} L${x} ${y}`} stroke={K} strokeWidth="4" />
          <path d={`M${x} ${y + 22} L${x - 16} ${y + 4} M${x} ${y + 30} L${x + 15} ${y + 10}`} stroke={K} strokeWidth="2.4" />
          {range(9).map((k) => (
            <ellipse key={k} cx={x - 32 + ((k * 37) % 66)} cy={y - 14 + ((k * 23) % 34)}
              rx={17 + (k % 3) * 5} ry={11 + (k % 2) * 5}
              fill={W} stroke={K} strokeWidth="1.2" />
          ))}
        </g>
      ))}

      {/* ground */}
      <line x1="0" y1="450" x2="800" y2="450" stroke={K} strokeWidth="2.4" />
      {range(30).map((i) => (
        <line key={i} x1={i * 28} y1={470 + (i % 4) * 16} x2={i * 28 + 46} y2={470 + (i % 4) * 16}
          stroke={K} strokeWidth="0.9" />
      ))}
    </svg>
  )
}

// ── III. Niles Boulevard, two eras ───────────────────────────
export function Niles({ era = 'now' }) {
  const then = era === 'then'
  const p = then ? 'nls-t' : 'nls-n'

  return (
    <svg viewBox="0 0 800 600" className="scene" preserveAspectRatio="xMidYMid slice">
      <Plates id={p} />
      <rect width="800" height="600" fill={W} />

      {[22, 38, 58, 82, 112, 150].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="800" y2={y} stroke={K} strokeWidth="0.6" />
      ))}

      {/* canyon hills — identical in both eras, the anchor for the wipe */}
      <path d="M0 214 L96 178 L188 202 L276 152 L388 188 L474 160 L586 196 L698 168 L800 190 L800 250 L0 250 Z"
        fill={`url(#${p}-h1)`} />
      <path d="M0 214 L96 178 L188 202 L276 152 L388 188 L474 160 L586 196 L698 168 L800 190"
        fill="none" stroke={K} strokeWidth="1.8" />

      {/* storefronts */}
      {range(4).map((i) => {
        const x = 30 + i * 190
        const top = 236 + i * 8
        return (
          <g key={i}>
            <rect x={x} y={top} width="176" height={430 - top} fill={W} stroke={K} strokeWidth="2.2" />
            {then ? (
              <path d={`M${x - 6} ${top} L${x + 182} ${top} L${x + 182} ${top - 22} L${x - 6} ${top - 22} Z`}
                fill={`url(#${p}-h1)`} stroke={K} strokeWidth="2.2" />
            ) : (
              <>
                <rect x={x - 6} y={top - 16} width="188" height="16" fill={`url(#${p}-h2)`} stroke={K} strokeWidth="2" />
                {range(9).map((k) => (
                  <line key={k} x1={x - 6 + k * 21} y1={top - 16} x2={x - 6 + k * 21} y2={top} stroke={K} strokeWidth="0.8" />
                ))}
              </>
            )}

            {range(3).map((w) => (
              <rect key={w} x={x + 20 + w * 50} y={top + 26} width="30" height="46"
                fill={`url(#${p}-h3)`} stroke={K} strokeWidth="1.8" />
            ))}

            <rect x={x + 16} y={top + 108} width="144" height="74" fill={`url(#${p}-cross)`} stroke={K} strokeWidth="2" />
            <line x1={x + 16} y1={top + 128} x2={x + 160} y2={top + 128} stroke={K} strokeWidth="1.4" />

            {then && (
              <>
                <path d={`M${x + 8} ${top + 100} L${x + 168} ${top + 100} L${x + 156} ${top + 76} L${x + 20} ${top + 76} Z`}
                  fill={W} stroke={K} strokeWidth="1.8" />
                {range(8).map((k) => (
                  <line key={k} x1={x + 22 + k * 18} y1={top + 76} x2={x + 14 + k * 18} y2={top + 100}
                    stroke={K} strokeWidth="0.9" />
                ))}
              </>
            )}

            <rect x={x + 70} y={top + 190} width="38" height="60" fill={`url(#${p}-h2)`} stroke={K} strokeWidth="1.8" />
          </g>
        )
      })}

      {/* studio sign / museum marquee */}
      {then ? (
        <g>
          <rect x="228" y="196" width="188" height="42" fill={W} stroke={K} strokeWidth="2.6" />
          <text x="322" y="226" textAnchor="middle" fontFamily={FACE}
            fontWeight="700" fontSize="24" letterSpacing="4" fill={K}>ESSANAY</text>
        </g>
      ) : (
        <g>
          <rect x="214" y="192" width="216" height="50" fill={W} stroke={K} strokeWidth="2.6" />
          <text x="322" y="212" textAnchor="middle" fontFamily={FACE}
            fontWeight="700" fontSize="13" letterSpacing="1.6" fill={K}>NILES ESSANAY</text>
          <text x="322" y="231" textAnchor="middle" fontFamily={FACE}
            fontSize="11" letterSpacing="1" fill={K}>SILENT FILM MUSEUM</text>
          {range(14).map((i) => (
            <circle key={i} cx={222 + i * 15.5} cy="250" r="3" fill={W} stroke={K} strokeWidth="1.4" />
          ))}
        </g>
      )}

      {/* street */}
      <line x1="0" y1="430" x2="800" y2="430" stroke={K} strokeWidth="2.6" />
      {then ? (
        <>
          <rect x="0" y="430" width="800" height="170" fill={`url(#${p}-stipple)`} />
          <line x1="0" y1="512" x2="800" y2="512" stroke={K} strokeWidth="2" />
          <line x1="0" y1="548" x2="800" y2="548" stroke={K} strokeWidth="2" />
          {range(28).map((i) => (
            <line key={i} x1={i * 29} y1="506" x2={i * 29} y2="554" stroke={K} strokeWidth="1" />
          ))}
        </>
      ) : (
        <>
          <rect x="0" y="430" width="800" height="170" fill={`url(#${p}-h1)`} />
          <line x1="0" y1="524" x2="800" y2="524" stroke={K} strokeWidth="3" strokeDasharray="40 30" />
          {range(7).map((i) => (
            <rect key={i} x={540 + i * 22} y="436" width="12" height="158" fill={W} stroke={K} strokeWidth="1.2" />
          ))}
        </>
      )}

      {/* the vehicle of the decade */}
      {then ? (
        <g>
          <path d="M232 500 L232 470 L268 470 L280 446 L336 446 L344 470 L372 470 L372 500 Z"
            fill={`url(#${p}-h2)`} stroke={K} strokeWidth="2.2" />
          <rect x="282" y="452" width="50" height="20" fill={W} stroke={K} strokeWidth="1.6" />
          <circle cx="256" cy="506" r="20" fill={W} stroke={K} strokeWidth="2.6" />
          <circle cx="350" cy="506" r="20" fill={W} stroke={K} strokeWidth="2.6" />
          {range(2).map((w) => range(8).map((s) => (
            <line key={`${w}-${s}`} x1={w ? 350 : 256} y1="506"
              x2={(w ? 350 : 256) + Math.cos((s * Math.PI) / 4) * 19}
              y2={506 + Math.sin((s * Math.PI) / 4) * 19}
              stroke={K} strokeWidth="1" />
          )))}
          {/* the camera on its tripod */}
          <rect x="596" y="396" width="46" height="34" fill={`url(#${p}-h3)`} stroke={K} strokeWidth="2" />
          <circle cx="608" cy="392" r="12" fill={W} stroke={K} strokeWidth="2" />
          <circle cx="632" cy="392" r="12" fill={W} stroke={K} strokeWidth="2" />
          <path d="M642 408 L660 400 L660 424 L642 418 Z" fill={W} stroke={K} strokeWidth="1.8" />
          <path d="M604 430 L586 496 M620 430 L620 496 M636 430 L654 496" stroke={K} strokeWidth="2.4" />
        </g>
      ) : (
        <g>
          <path d="M228 502 L236 474 L268 456 L336 456 L364 476 L376 502 Z"
            fill={`url(#${p}-h2)`} stroke={K} strokeWidth="2.2" />
          <path d="M262 474 L274 460 L330 460 L346 474 Z" fill={W} stroke={K} strokeWidth="1.6" />
          <circle cx="258" cy="504" r="17" fill={W} stroke={K} strokeWidth="2.6" />
          <circle cx="350" cy="504" r="17" fill={W} stroke={K} strokeWidth="2.6" />
          <circle cx="258" cy="504" r="7" fill={W} stroke={K} strokeWidth="1.4" />
          <circle cx="350" cy="504" r="7" fill={W} stroke={K} strokeWidth="1.4" />
        </g>
      )}

      {/* poles */}
      {range(4).map((i) => {
        const x = 104 + i * 206
        return (
          <g key={i}>
            <line x1={x} y1="430" x2={x} y2={then ? 250 : 296} stroke={K} strokeWidth="4" />
            {then ? (
              <>
                <line x1={x - 26} y1="266" x2={x + 26} y2="266" stroke={K} strokeWidth="2.4" />
                <line x1={x - 20} y1="288" x2={x + 20} y2="288" stroke={K} strokeWidth="2.4" />
                {[-20, -8, 8, 20].map((d, k) => (
                  <circle key={k} cx={x + d} cy="262" r="2.6" fill={W} stroke={K} strokeWidth="1.4" />
                ))}
              </>
            ) : (
              <path d={`M${x} 296 q0 -20 24 -20`} fill="none" stroke={K} strokeWidth="4" />
            )}
          </g>
        )
      })}
      {then &&
        range(3).map((i) => (
          <path key={i} d={`M${104 + i * 206} 264 Q${207 + i * 206} ${282 + i * 4} ${310 + i * 206} 264`}
            fill="none" stroke={K} strokeWidth="1.1" />
        ))}
    </svg>
  )
}

export const SCENES = {
  mission: Mission,
  niles: Niles,
}
