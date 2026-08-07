// The advertising creative, drawn from the game's own artwork.
//
//   SITE_URL=https://your-domain node scripts/make-ads.mjs
//
// Writes to marketing/ — deliberately NOT public/, because these are
// posters for elsewhere, not files the site serves. Anything in public/
// ships in the bundle and gets precached by the service worker, which
// would make every player download the ads.
//
// Why generate rather than photograph. Every image here is composed out
// of src/art, which we wrote, so there is no licence to clear, no
// attribution line to carry into a paid placement, and no share-alike
// clause attaching itself to the creative. It is also the honest advert:
// the engraving in the poster is the engraving in the game, rendered by
// the same composer from the same data, so nobody arrives expecting a
// photograph and finds line art.
//
// The plate is a real Zoom puzzle at a real zoom level. That is the hook
// — a picture you cannot quite name is a question, and a question is
// what makes somebody tap. The wordmark is deliberately small.
//
// Same font caveat as make-images.mjs: the rasteriser only sees fonts
// installed on this machine, so on a Mac this comes out in Georgia and
// Helvetica rather than Newsreader and Work Sans. Close enough for a
// social post; regenerate on a Mac and check the diff.

import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'marketing')

const SAGE = '#e7efe5'
const NAVY = '#043764'
const PANEL = '#fbfdfa'
const RIDGE = '#2f6b3a'
const SERIF = 'Newsreader, Georgia, serif'
const SANS = 'Work Sans, Helvetica, Arial, sans-serif'
const RIDGE_POINTS = '0,660 0,300 84,140 150,214 232,36 300,180 340,120 340,660'

// Mirrors vite.config.js. A poster with a placeholder domain on it is
// worse than no poster, so this shouts rather than quietly shipping.
const siteUrl = () => {
  if (process.env.SITE_URL)
    return process.env.SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
  console.warn('\n  ⚠  SITE_URL not set — posters will read SET-YOUR-DOMAIN.\n')
  return 'SET-YOUR-DOMAIN'
}
const URL_TEXT = siteUrl()

// ── the plate ─────────────────────────────────────────────────
//
// Vite loads the JSX for us, so the composer stays the single source of
// truth for what a place looks like. Node cannot parse .jsx on its own
// and adding a second bundler for one script would be the wrong trade.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { default: Engraving } = await vite.ssrLoadModule('/src/art/Engraving.jsx')
const { default: PLACES } = await vite.ssrLoadModule('/src/data/generated/places.js')

// `crop` is the zoom: a window onto the 800×600 plate, in its own units.
// Tighter window, harder puzzle. These are picked to leave one real
// clue in frame and cut the rest away.
const plate = (placeId, crop) => {
  const place = PLACES.find((p) => p.id === placeId)
  if (!place) throw new Error(`no place "${placeId}"`)
  const svg = renderToStaticMarkup(createElement(Engraving, { place }))
  // The parts draw in currentColor so one composer serves both themes.
  // Standalone there is no cascade to inherit from, so state it here.
  return svg
    .replace('viewBox="0 0 800 600"', `viewBox="${crop.join(' ')}" style="color:${NAVY}"`)
    .replace('<svg ', '<svg width="100%" height="100%" ')
}

// ── the poster ────────────────────────────────────────────────
//
// One layout, four crops of it. Every size is the same three things in
// the same order — picture, question, where to go — because a viewer
// scrolling past gets about a second and a half.
const poster = ({ w, h, pad, plateH, title, sub, foot, placeId, crop }) => {
  const inner = w - pad * 2
  const titleY = pad + plateH + title
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${SAGE}"/>

  <!-- the same skyline the site draws behind everything, at the same
       weight, so the poster and the page are one place -->
  <g transform="translate(0 ${h - h * 0.42}) scale(${w / 340} ${(h * 0.42) / 660})" opacity="0.13">
    <polygon points="${RIDGE_POINTS}" fill="${RIDGE}"/>
  </g>

  <!-- the plate. Rounded and white like the board in the game, because
       the poster should look like the thing it is selling. -->
  <defs>
    <clipPath id="plate-clip">
      <rect x="${pad}" y="${pad}" width="${inner}" height="${plateH}" rx="${Math.round(w * 0.037)}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#plate-clip)">
    <rect x="${pad}" y="${pad}" width="${inner}" height="${plateH}" fill="${PANEL}"/>
    <svg x="${pad}" y="${pad}" width="${inner}" height="${plateH}"
         viewBox="0 0 ${inner} ${plateH}" preserveAspectRatio="xMidYMid slice">
      ${plate(placeId, crop)}
    </svg>
  </g>

  <text x="${pad}" y="${titleY}" font-family="${SERIF}" font-size="${title}" fill="${NAVY}">Name this place.</text>
  <text x="${pad}" y="${titleY + sub * 1.6}" font-family="${SANS}" font-size="${sub}" fill="${NAVY}" opacity="0.8">The Fremont Daily — five puzzles about</text>
  <text x="${pad}" y="${titleY + sub * 2.9}" font-family="${SANS}" font-size="${sub}" fill="${NAVY}" opacity="0.8">Fremont, California, every morning.</text>
  <text x="${pad}" y="${titleY + sub * 2.9 + foot * 2}" font-family="${SANS}" font-size="${foot}" font-weight="700" fill="${NAVY}">${URL_TEXT}</text>
</svg>`
}

// A different place per format, so somebody who sees two of these does
// not see the same drawing twice.
// Crops read off the full plates rather than guessed. The first pass was
// picked by eye and came out as brickwork and diagonal hatching — true
// crops of the drawing, but of the parts that carry no information. Each
// window below is set to hold the one feature that makes the place
// itself: the bell tower, the tracks, the shopfronts, the summits. Each
// crop's aspect also matches its plate's, because the nested svg slices
// to fill and any mismatch crops again on top of these numbers.
const SIZES = [
  // Instagram and Facebook feed, and Nextdoor's post image.
  // The mission: bell tower, arch, and the road in front. 1.42:1.
  {
    file: 'square-1080.png',
    w: 1080,
    h: 1080,
    pad: 72,
    plateH: 660,
    title: 66,
    sub: 30,
    foot: 30,
    placeId: 'mission-san-jose',
    crop: [120, 80, 540, 381],
  },
  // The tallest thing Instagram will show in feed — most screen for the
  // same scroll, so this is the one to lead with.
  // The depot, its poles and the rails. 1.06:1.
  {
    file: 'portrait-1080x1350.png',
    w: 1080,
    h: 1350,
    pad: 72,
    plateH: 880,
    title: 70,
    sub: 32,
    foot: 32,
    placeId: 'centerville-depot',
    crop: [120, 190, 430, 404],
  },
  // Stories and Reels covers. The margins are wider than the other
  // three on purpose: Instagram lays its own chrome over roughly the
  // top and bottom 250px of a story, so anything inside those bands is
  // sitting under a profile row or a reply box. 120 top and ~300 under
  // the last line keeps every word clear of both.
  // Two Niles shopfronts and the street trees. 0.74:1.
  {
    file: 'story-1080x1920.png',
    w: 1080,
    h: 1920,
    pad: 120,
    plateH: 1240,
    title: 78,
    sub: 36,
    foot: 36,
    placeId: 'niles-plaza',
    crop: [190, 200, 290, 394],
  },
  // Link cards: Nextdoor, Facebook, X.
  // The ridge line, all three summits and the top of the post. 3.63:1.
  {
    file: 'wide-1200x630.png',
    w: 1200,
    h: 630,
    pad: 56,
    plateH: 300,
    title: 54,
    sub: 26,
    foot: 26,
    placeId: 'mission-peak',
    crop: [20, 95, 760, 210],
  },
]

await mkdir(OUT, { recursive: true })
console.log(`\n  domain on the creative: ${URL_TEXT}\n`)

for (const s of SIZES) {
  // Rasterise at double density and come back down. librsvg at 1:1
  // renders the serif's thin strokes a little dry; supersampling and
  // resizing lands on the exact size every platform expects with the
  // type properly filled in. Without the resize the density alone
  // silently doubles the file — these are named for their dimensions,
  // so the dimensions have to be true.
  const buf = await sharp(Buffer.from(poster(s)), { density: 144 })
    .resize(s.w, s.h)
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(join(OUT, s.file), buf)
  const got = await sharp(buf).metadata()
  console.log(
    `  ${s.file.padEnd(26)} ${got.width}×${got.height}  ${(buf.length / 1024).toFixed(0)} kB`
  )
}

await vite.close()
console.log('\n  → marketing/\n')
