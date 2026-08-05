// The raster art: the link-preview card and the home-screen icons.
//
//   node scripts/make-images.mjs
//
// Run by hand, and the PNGs it writes are committed. That is deliberate.
// The alternative — rasterising during the build — would put sharp and a
// font stack on the critical path of every deploy for files that change
// about once a year.
//
// One caveat if you re-run it: the type below asks for Newsreader and
// Work Sans, which is what the site uses, but the rasteriser can only
// see fonts installed on the machine. On a Mac that means Georgia and
// Helvetica, which is why the card is set in a transitional serif rather
// than exactly the site's. On a Linux box it will find neither and the
// card will come out in DejaVu, which looks wrong. Regenerate on a Mac,
// or check the diff.

import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public')

const SAGE = '#e7efe5'
const NAVY = '#043764'
const GREEN = '#33632e'
const AMBER = '#8e6b13'
const PANEL = '#fbfdfa'
const RIDGE = '#2f6b3a'

const SERIF = 'Newsreader, Georgia, serif'
const SANS = 'Work Sans, Helvetica, Arial, sans-serif'

// The same skyline the app draws behind everything, in its own
// coordinates. Kept identical so the card and the site agree.
const RIDGE_POINTS = '0,660 0,300 84,140 150,214 232,36 300,180 340,120 340,660'

// ── the link preview ──────────────────────────────────────────
//
// This is the whole growth loop. The game is built to be shared into a
// group chat, and until now that link arrived as a bare URL — no title,
// no picture, nothing to say what it is. 1200×630 is the size every
// platform crops from.
//
// Five Word cells carry it rather than an abstract mark: they say
// "daily puzzle" at a glance, they show all three state colours, and
// they are still legible at the ~400px a chat thumbnail actually gets.
const cell = (x, y, letter, state) => {
  const fill = { correct: GREEN, present: AMBER, empty: 'none' }[state]
  const ink = state === 'empty' ? NAVY : PANEL
  return `
    <rect x="${x}" y="${y}" width="84" height="84" rx="20"
          fill="${fill}" stroke="${state === 'empty' ? NAVY : 'none'}"
          stroke-width="${state === 'empty' ? 3 : 0}" opacity="1"/>
    <text x="${x + 42}" y="${y + 60}" font-family="${SANS}" font-size="46"
          font-weight="700" fill="${ink}" text-anchor="middle">${letter}</text>`
}

const NILES = [
  ['N', 'correct'],
  ['I', 'empty'],
  ['L', 'present'],
  ['E', 'empty'],
  ['S', 'correct'],
]

const ogCard = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${SAGE}"/>

  <!-- the ridge, cropped to the lower third and kept faint: it is the
       page's own background, not a graphic element competing with the
       wordmark -->
  <g transform="translate(0 281) scale(3.5294 0.5288)" opacity="0.13">
    <polygon points="${RIDGE_POINTS}" fill="${RIDGE}"/>
  </g>

  <text x="80" y="248" font-family="${SERIF}" font-size="98" fill="${NAVY}">The Fremont Daily</text>
  <line x1="80" y1="292" x2="810" y2="292" stroke="${NAVY}" stroke-width="2" opacity="0.28"/>
  <text x="80" y="352" font-family="${SANS}" font-size="37" fill="${NAVY}" opacity="0.78">
    Five puzzles about one town, every morning.
  </text>

  ${NILES.map(([l, s], i) => cell(80 + i * 100, 430, l, s)).join('')}
</svg>`

// ── the home-screen icon ──────────────────────────────────────
//
// Mission Peak in white on navy. No wordmark: at 48px a word is a smear,
// and the skyline is the one shape this town has that reads at any size.
const icon = (size, inset = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="${NAVY}"/>
  <g transform="translate(${inset} ${inset}) scale(${(48 - inset * 2) / 48})">
    <polygon points="0,48 0,32 12,17 22,25 33,4 42,18 48,13 48,48" fill="#f1f5f8"/>
  </g>
</svg>`

const png = async (svg, file, opts = {}) => {
  const buf = await sharp(Buffer.from(svg), opts).png({ compressionLevel: 9 }).toBuffer()
  await writeFile(join(OUT, file), buf)
  console.log(`  ${file}  ${(buf.length / 1024).toFixed(1)} kB`)
}

await mkdir(OUT, { recursive: true })

await png(ogCard, 'og.png')
await png(icon(192), 'icon-192.png')
await png(icon(512), 'icon-512.png')
await png(icon(180), 'apple-touch-icon.png')

// A maskable icon is cropped to whatever shape the launcher wants — a
// circle on most Androids — so everything that matters has to sit inside
// the middle 80%. The skyline is inset to survive the worst crop.
await png(icon(512, 5), 'icon-maskable-512.png')
