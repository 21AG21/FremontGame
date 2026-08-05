// The refraction half of the glass.
//
// Apple's Liquid Glass is not a blur. A blur is what is behind a frosted
// pane; glass is a lens, and the thing that makes their material read as
// a solid object rather than a translucent rectangle is what happens at
// the RIM — the backdrop bends there, compresses, and throws a faint
// colour fringe, because a real bevel refracts red and blue by different
// amounts.
//
// CSS has no way to bend a backdrop. SVG does: feDisplacementMap moves
// every pixel of its input by an amount read out of a second image, and
// Chrome accepts url(#id) inside backdrop-filter.
//
// The catch, found the hard way: Chrome will NOT resolve feImage inside
// a backdrop-filter. The same filter works perfectly as a plain
// `filter:`, and the data URI loads fine on its own, but as a backdrop
// the primitive fails and takes the whole chain with it — the pane goes
// flat black. So the displacement map is not an image here. It is
// derived from the pane's own silhouette:
//
//   SourceAlpha, in a filter region larger than the element, is opaque
//   inside the pane and transparent outside it. Blur that, then subtract
//   a copy shifted left from a copy shifted right, and the result is a
//   signed horizontal ramp — flat through the middle, steep at the two
//   vertical edges, zero everywhere it should be. The same trick down
//   the y axis gives the other channel.
//
// That has a bonus the image never had: it follows the element's real
// border-radius, so the bend goes round the corners instead of stopping
// square.
//
// Safari does not run this, and it is worth being precise about how it
// fails, because the obvious guess is wrong. It does NOT drop the
// declaration: CSS.supports('backdrop-filter','url(#x)') returns true on
// iOS 26 and getComputedStyle reports url("#glass-bar") back. It parses
// it, computes it, and then silently renders nothing — measured on a
// real iPhone against public/lens-test.html, where the lensed pane and
// the control pane come out pixel-identical over hard diagonal stripes
// that Chrome visibly bends.
//
// Which means feature detection cannot find this, and the only reason it
// is harmless is that the lens is its own layer: a no-op there paints
// nothing and the blur underneath is untouched. Everything else in the
// material — vibrancy, rim, specular, thickness, shadow — does work in
// Safari. Verified.

// Red bends most, blue least — the same order as a real prism, and the
// reason a rim reads as glass rather than as a soft edge.
//
// ±9%, which on the bar's throw is about a pixel and a half of
// separation. ±16% was tried first and the corners gave it away: that is
// where the horizontal and vertical displacements compound, so the
// widest fringe in the whole pane appears exactly where the eye is drawn
// to look for a seam. It stopped reading as glass and started reading as
// a rendering fault.
const CHANNEL = { r: 1.09, g: 1, b: 0.91 }

// Isolate one channel and FORCE alpha to 1 — the last column, not the
// alpha row.
//
// This is the whole reason the first attempt at chromatic aberration had
// to be thrown away. The obvious recombination is feBlend mode="screen",
// and feBlend screens PREMULTIPLIED colour: wherever alpha is under 1 —
// antialiased corners, any sample landing on a soft edge — three passes
// inflate it as 1-(1-a)³ and the colour drifts with it. On the dark
// theme it hid. On the light theme the whole bar went silver-grey with a
// dark seam down the right edge.
//
// Pinning alpha to 1 makes premultiplied and straight colour the same
// thing, so the channels can be added back with plain arithmetic and the
// sum is exact. Safe here because the pane never samples outside itself:
// both ramps run inward, and the backdrop inside the element is opaque.
const KEEP = {
  r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1',
  g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0 1',
  b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0 1',
}

/**
 * band  how far in from the edge the glass bends, in pixels
 * scale how hard it bends
 */
function Lens({ id, band, scale }) {
  const pass = (k) => (
    <>
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={scale * CHANNEL[k]}
        xChannelSelector="R"
        yChannelSelector="G"
        result={`d${k}`}
      />
      <feColorMatrix in={`d${k}`} type="matrix" values={KEEP[k]} result={k.toUpperCase()} />
    </>
  )

  return (
    <filter
      id={id}
      // Wider than the element on purpose: the whole construction depends
      // on there being transparent space outside the pane for SourceAlpha
      // to have an edge against. Taller margin than wide, because the bar
      // is short and the band has to fit above and below it.
      x="-20%"
      y="-60%"
      width="140%"
      height="220%"
      colorInterpolationFilters="sRGB"
    >
      {/* Alpha to opaque greyscale first. Everything downstream is then
          fully opaque, which keeps feComposite's arithmetic away from
          premultiplied colour, where a near-zero alpha makes the
          unpremultiply blow up. */}
      <feColorMatrix
        in="SourceAlpha"
        type="matrix"
        values="0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 0 1"
        result="shape"
      />
      <feGaussianBlur in="shape" stdDeviation={band * 0.62} result="sh" />

      {/* signed horizontal ramp: left copy minus right copy, centred on
          0.5 so the flat middle displaces by nothing */}
      <feOffset in="sh" dx={-band} dy="0" result="hl" />
      <feOffset in="sh" dx={band} dy="0" result="hr" />
      <feComposite
        in="hl"
        in2="hr"
        operator="arithmetic"
        k1="0"
        k2="0.5"
        k3="-0.5"
        k4="0.5"
        result="gx"
      />

      <feOffset in="sh" dx="0" dy={-band} result="vt" />
      <feOffset in="sh" dx="0" dy={band} result="vb" />
      <feComposite
        in="vt"
        in2="vb"
        operator="arithmetic"
        k1="0"
        k2="0.5"
        k3="-0.5"
        k4="0.5"
        result="gy"
      />

      {/* pack the horizontal ramp into red and the vertical into green,
          which is what feDisplacementMap reads for x and y */}
      <feColorMatrix
        in="gx"
        type="matrix"
        values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1"
        result="mr"
      />
      <feColorMatrix
        in="gy"
        type="matrix"
        values="0 0 0 0 0  1 0 0 0 0  0 0 0 0 0  0 0 0 0 1"
        result="mg"
      />
      <feBlend in="mr" in2="mg" mode="screen" result="raw" />

      {/* The lens profile.

          Up to here the ramp is the gradient of a Gaussian-blurred
          silhouette, which is a smooth falloff — not the curve a bevel
          actually has. A convex edge barely deviates across its flat
          face and then bends hard in the last fraction before the rim,
          because the refraction angle climbs as the surface turns away
          from you.

          This S-curve is that profile: flat through the middle, steep
          at the extremes. It is the difference between an edge that
          fades and an edge that turns. */}
      <feComponentTransfer in="raw" result="map">
        <feFuncR type="table" tableValues="0 0.16 0.5 0.84 1" />
        <feFuncG type="table" tableValues="0 0.16 0.5 0.84 1" />
      </feComponentTransfer>

      {pass('r')}
      {pass('g')}
      {pass('b')}

      {/* Additive, not screen. With alpha pinned to 1 on all three and
          the channels disjoint, k2=k3=1 sums them back exactly: R+0+0,
          0+G+0, 0+0+B. Alpha sums past 1 and clamps, which is what we
          want — the pane is opaque. */}
      <feComposite in="R" in2="G" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="RG" />
      <feComposite in="RG" in2="B" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
    </filter>
  )
}

// Mounted once, at the root. Nothing here paints — it is a definitions
// block that the CSS points at by id.
export default function GlassDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* The bar is 54px tall, so the band and the throw both have to
            stay small: displacement is in real pixels, and anything past
            about 10 starts pulling the middle of the pane around instead
            of just its edge. */}
        <Lens id="glass-bar" band={6} scale={9} />
        {/* the small floating chips — a tighter radius wants a tighter band */}
        <Lens id="glass-chip" band={4} scale={6} />
      </defs>
    </svg>
  )
}
