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
// Safari ignores url() in backdrop-filter entirely and drops the
// declaration. That is why this lives on its own layer: where it does
// not work, the layer renders as nothing and the blur underneath is
// untouched.

// One displacement pass, not three.
//
// Real glass throws a colour fringe at the rim, and the way to fake it
// is to displace red, green and blue by slightly different amounts —
// split the channels with feColorMatrix, run three feDisplacementMaps,
// screen them back together. It was built that way first and it is
// wrong: feBlend screens PREMULTIPLIED colour, so wherever alpha is
// under 1 — the antialiased corners, anywhere a sample lands on a soft
// edge — three passes inflate it as 1-(1-a)³ and the recombination
// drifts. On the dark theme it hid; on the light one the whole bar went
// silver-grey with a dark seam down the right edge.
//
// A fringe nobody can see is not worth a cast everybody can. If this is
// ever revisited, the fix is to composite the channels additively over
// an opaque base rather than screening them.
/**
 * band  how far in from the edge the glass bends, in pixels
 * scale how hard it bends
 */
function Lens({ id, band, scale }) {
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
      <feBlend in="mr" in2="mg" mode="screen" result="map" />

      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
      />
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
