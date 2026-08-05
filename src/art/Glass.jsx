// Edge refraction — the half of glass a blur cannot do. The backdrop
// bends and compresses at the rim, which is what separates a pane of
// glass from a translucent rectangle.
//
// Three traps, all of which cost a rebuild:
//
//  1. Chrome will not resolve feImage inside a backdrop-filter. It works
//     as a plain `filter:`, and the data URI loads fine alone, but as a
//     backdrop the primitive fails and blacks out the pane. Hence the
//     map is built from SourceAlpha instead — see below.
//
//  2. Safari renders none of this, and feature detection cannot find
//     out: CSS.supports() returns true and getComputedStyle hands the
//     value back, then nothing paints. Measured on a real iPhone with
//     public/lens-test.html. Harmless only because the lens is its own
//     layer, so a no-op paints nothing and the blur underneath survives.
//     Everything else in the material does work there.
//
//  3. Do not recombine the channel passes with feBlend mode="screen".
//     See KEEP.

// Red bends most, blue least, like a prism. ±9% ≈ 1.5px of separation on
// the bar. ±16% put the widest fringe on the corners, where the two axes
// compound, and it read as a rendering fault rather than as glass.
const CHANNEL = { r: 1.09, g: 1, b: 0.91 }

// Isolate one channel and force alpha to 1 — last column, not the alpha
// row. feBlend screens PREMULTIPLIED colour, so with alpha under 1 at
// antialiased corners three passes inflate it as 1-(1-a)³ and the colour
// drifts: the light theme went silver-grey with a seam down one edge.
// Alpha pinned, the channels are disjoint and add back exactly.
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
      // Oversized on purpose: SourceAlpha needs transparent space outside
      // the pane to have an edge against. Taller than wide because the bar
      // is short and the band must fit above and below it.
      x="-20%"
      y="-60%"
      width="140%"
      height="220%"
      colorInterpolationFilters="sRGB"
    >
      {/* Alpha to opaque greyscale, so everything downstream is opaque and
          feComposite's arithmetic never touches premultiplied colour. */}
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

      {/* The bevel profile. A Gaussian falloff is not the curve a convex
          edge has — it barely deviates across the flat face, then bends
          hard in the last fraction before the rim. This S-curve is that:
          the difference between an edge that fades and one that turns. */}
      <feComponentTransfer in="raw" result="map">
        <feFuncR type="table" tableValues="0 0.16 0.5 0.84 1" />
        <feFuncG type="table" tableValues="0 0.16 0.5 0.84 1" />
      </feComponentTransfer>

      {pass('r')}
      {pass('g')}
      {pass('b')}

      {/* Additive, not screen — see KEEP. Disjoint channels, so k2=k3=1
          sums them back exactly. */}
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
        {/* The bar is 54px tall and displacement is in real pixels, so
            past about 10 the throw starts moving the middle of the pane
            rather than its edge. */}
        <Lens id="glass-bar" band={6} scale={9} />
        {/* the small floating chips — a tighter radius wants a tighter band */}
        <Lens id="glass-chip" band={4} scale={6} />
      </defs>
    </svg>
  )
}
