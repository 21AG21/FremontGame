// content/*.csv  ->  src/data/generated/*.json
//
// The data modules keep every bit of their logic — the coprime cycles,
// the separability filter, the rhyme-family check. All that moves out is
// the rows, so a person with a spreadsheet can add a category or a
// landmark without opening an editor.
//
// The validation below is the reason this script exists. A puzzle site
// where a stray cell can ship a board nobody can solve is worse than one
// nobody can edit, so every rule that used to be enforced by "I typed it
// carefully" is enforced here instead, with a line number.
//
//   node scripts/content-build.mjs [--check]
//
// --check validates and writes nothing. That is what CI runs.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readTable, splitList } from './lib/csv.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const IN = join(ROOT, 'content')
const OUT = join(ROOT, 'src/data/generated')
const checkOnly = process.argv.includes('--check')

const errors = []
const warnings = []
const fail = (file, row, msg) => errors.push(`${file}:${row}  ${msg}`)
const warn = (file, row, msg) => warnings.push(`${file}:${row}  ${msg}`)

const table = async (name) => readTable(await readFile(join(IN, name), 'utf8'))

// The motif vocabulary is whatever art/Parts.jsx can actually draw. A
// motif that isn't in there is not a typo you find later — it is a place
// that silently loses part of its picture.
const partsSrc = await readFile(join(ROOT, 'src/art/Parts.jsx'), 'utf8')
const partsBlock = partsSrc.slice(partsSrc.indexOf('export const PARTS = {'))
const MOTIFS = new Set(
  [...partsBlock.matchAll(/^\s{2}([a-z][a-zA-Z0-9]*):\s*\{/gm)].map((m) => m[1])
)
if (MOTIFS.size < 20) {
  throw new Error(`only found ${MOTIFS.size} motifs in Parts.jsx — the scraper needs updating`)
}

// ── places ────────────────────────────────────────────────────
// The box is Fremont plus the towns it borders, wide enough for the
// decoys and tight enough to catch a swapped lat/lng or a dropped minus,
// which puts a landmark in the Indian Ocean and makes every distance
// hint nonsense.
const BOX = { lat: [37.3, 37.9], lng: [-122.5, -121.6] }

const placesTable = await table('places.csv')
const places = []
const placeIds = new Set()

for (const r of placesTable.rows) {
  const at = ['places.csv', r.__line]
  const lat = Number(r.lat)
  const lng = Number(r.lng)
  const fame = Number(r.fame)
  const motifs = splitList(r.motifs)

  if (!r.id) fail(...at, 'no id')
  else if (placeIds.has(r.id)) fail(...at, `duplicate id "${r.id}"`)
  else placeIds.add(r.id)

  if (!r.name) fail(...at, `"${r.id}" has no name`)
  if (!r.district) fail(...at, `"${r.id}" has no district`)

  if (!Number.isFinite(lat) || lat < BOX.lat[0] || lat > BOX.lat[1])
    fail(...at, `"${r.id}" lat ${r.lat} is outside Fremont — check for a swapped lat/lng`)
  if (!Number.isFinite(lng) || lng < BOX.lng[0] || lng > BOX.lng[1])
    fail(...at, `"${r.id}" lng ${r.lng} is outside Fremont — a dropped minus sign does this`)

  if (![1, 2, 3].includes(fame))
    fail(
      ...at,
      `"${r.id}" fame is "${r.fame}" — must be 1 (everyone knows it), 2 (locals do) or 3 (decoy only)`
    )

  if (!motifs.length) fail(...at, `"${r.id}" has no motifs, so it has no drawing`)
  for (const m of motifs)
    if (!MOTIFS.has(m)) fail(...at, `"${r.id}" uses motif "${m}", which Parts.jsx cannot draw`)

  places.push({ id: r.id, name: r.name, lat, lng, district: r.district, motifs, fame })
}

// ── groups ────────────────────────────────────────────────────
const groupsTable = await table('groups.csv')
const groups = []
const groupLabels = new Set()
const itemUse = new Map()

for (const r of groupsTable.rows) {
  const at = ['groups.csv', r.__line]
  const d = Number(r.difficulty)
  const items = [r.item1, r.item2, r.item3, r.item4].map((s) => (s || '').trim())

  if (![0, 1, 2, 3].includes(d))
    fail(...at, `difficulty "${r.difficulty}" — must be 0 (easiest) to 3 (hardest)`)
  if (!r.label) fail(...at, 'no label')
  else if (groupLabels.has(r.label)) fail(...at, `duplicate label "${r.label}"`)
  else groupLabels.add(r.label)

  const filled = items.filter(Boolean)
  if (filled.length !== 4)
    fail(
      ...at,
      `"${r.label}" has ${filled.length} items — the board deals all four, so it needs exactly four`
    )
  if (new Set(filled).size !== filled.length)
    fail(...at, `"${r.label}" repeats an item, which would put the same tile on the board twice`)

  for (const i of filled) itemUse.set(i, (itemUse.get(i) || 0) + 1)
  groups.push({ d, label: r.label, items })
}

// A tile shared by two categories is the whole point of the game. A tile
// shared by six is a tile the day-picker has to route around so often
// that whole categories stop reaching the board.
for (const [item, n] of itemUse)
  if (n > 5)
    warn(
      'groups.csv',
      0,
      `"${item}" appears in ${n} categories — the collision guard will start skipping them`
    )

for (const d of [0, 1, 2, 3]) {
  const n = groups.filter((g) => g.d === d).length
  if (n < 3)
    fail(
      'groups.csv',
      0,
      `difficulty ${d} has only ${n} categories — a board needs to find one that does not clash`
    )
}

// ── facts ─────────────────────────────────────────────────────
const factsTable = await table('facts.csv')
const byUnit = new Map()

for (const r of factsTable.rows) {
  const at = ['facts.csv', r.__line]
  const value = Number(r.value)

  if (!r.unit) {
    fail(...at, 'no unit — a fact with no unit cannot be paired with anything')
    continue
  }
  if (!r.name) fail(...at, 'no name')
  if (!Number.isFinite(value)) fail(...at, `"${r.name}" value "${r.value}" is not a number`)

  if (!byUnit.has(r.unit)) byUnit.set(r.unit, [])
  const set = byUnit.get(r.unit)
  if (set.some((f) => f.name === r.name)) fail(...at, `"${r.name}" is already in "${r.unit}"`)
  set.push({ name: r.name, value, anchor: /^(y|yes|true|1|x)$/i.test(r.anchor), __line: r.__line })
}

for (const [unit, facts] of byUnit) {
  if (facts.length < 2)
    fail(
      'facts.csv',
      facts[0].__line,
      `unit "${unit}" has one fact, so there is nothing to compare it to`
    )
  // The side you are shown has to be something you can picture, or the
  // round is a coin flip. Every unit needs at least one of those.
  if (!facts.some((f) => f.anchor))
    fail(
      'facts.csv',
      facts[0].__line,
      `unit "${unit}" has no anchor — mark at least one fact a Fremont resident could picture`
    )
  if (new Set(facts.map((f) => f.value)).size !== facts.length)
    warn(
      'facts.csv',
      facts[0].__line,
      `unit "${unit}" has two facts with the same value — that pair can never be a fair round`
    )
}

const factSets = [...byUnit].map(([unit, facts]) => ({
  unit,
  facts: facts.map(({ name, value, anchor }) =>
    anchor ? { name, value, anchor } : { name, value }
  ),
}))

// ── scenes ────────────────────────────────────────────────────
const scenesTable = await table('scenes.csv')
const scenes = []
const sceneIds = new Set()

for (const r of scenesTable.rows) {
  const at = ['scenes.csv', r.__line]
  const year = Number(r.year)
  const then = splitList(r.then)
  const now = splitList(r.now)

  if (!r.id) fail(...at, 'no id')
  else if (sceneIds.has(r.id)) fail(...at, `duplicate id "${r.id}"`)
  else sceneIds.add(r.id)

  if (!placeIds.has(r.placeId))
    fail(...at, `"${r.id}" points at place "${r.placeId}", which is not in places.csv`)
  if (!r.caption) fail(...at, `"${r.id}" has no caption`)
  if (!Number.isFinite(year) || year < 1700 || year > 2030)
    fail(...at, `"${r.id}" year "${r.year}" is not a plausible year`)

  for (const [which, list] of [
    ['then', then],
    ['now', now],
  ]) {
    if (!list.length) fail(...at, `"${r.id}" has no ${which} motifs`)
    for (const m of list)
      if (!MOTIFS.has(m))
        fail(...at, `"${r.id}" ${which} uses motif "${m}", which Parts.jsx cannot draw`)
  }

  // Identical lists mean the wipe reveals nothing and the puzzle is
  // "guess a year from an unchanged picture".
  if (then.join('|') === now.join('|'))
    fail(
      ...at,
      `"${r.id}" draws then and now identically — there is nothing to see through the wipe`
    )

  scenes.push({ id: r.id, placeId: r.placeId, caption: r.caption, year, then, now })
}

// Two scenes on the same place with the same `now` produce the same
// Today picture with two different right answers.
const nowKey = new Map()
for (const s of scenes) {
  const k = `${s.placeId}::${s.now.join('|')}`
  if (nowKey.has(k))
    fail(
      'scenes.csv',
      0,
      `"${s.id}" and "${nowKey.get(k)}" draw the same Today picture but want different years`
    )
  nowKey.set(k, s.id)
}

// ── words ─────────────────────────────────────────────────────
const wordList = new Set(
  (await readFile(join(ROOT, 'src/data/valid-wordle-words.txt'), 'utf8'))
    .split('\n')
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length === 5)
)

const wordsTable = await table('words.csv')
const candidates = []
const localWords = []
const seenWords = new Set()

for (const r of wordsTable.rows) {
  const at = ['words.csv', r.__line]
  const w = (r.word || '').trim().toUpperCase()
  const isLocal = /^(y|yes|true|1|x)$/i.test(r.local)

  if (!/^[A-Z]{5}$/.test(w)) {
    fail(...at, `"${r.word}" is not five letters A–Z`)
    continue
  }
  if (seenWords.has(w)) {
    fail(...at, `"${w}" is in the list twice`)
    continue
  }
  seenWords.add(w)

  // An answer nobody can type is not a puzzle. Either it is in the
  // published guess list, or it is a local word we add to that list.
  if (!wordList.has(w) && !isLocal)
    fail(
      ...at,
      `"${w}" is not in the Wordle guess list — nobody could type it. Put yes in the local column to add it.`
    )

  if (isLocal) localWords.push(w)
  candidates.push(w)
}

if (candidates.length < 7)
  fail(
    'words.csv',
    0,
    `only ${candidates.length} answers — the queue repeats every ${candidates.length} days`
  )
else if (candidates.length < 30)
  warn(
    'words.csv',
    0,
    `${candidates.length} answers means the word repeats every ${candidates.length} days`
  )

// ── report ────────────────────────────────────────────────────
for (const w of warnings) console.warn(`  warning  ${w}`)

if (errors.length) {
  console.error(`\n${errors.length} problem${errors.length > 1 ? 's' : ''} in content/:\n`)
  for (const e of errors) console.error(`  ${e}`)
  console.error('\nNothing was written. Fix the rows above and run it again.')
  process.exit(1)
}

// .js and not .json, so plain Node can import these as well as Vite.
// Node 22+ demands `with { type: 'json' }` on a JSON import, which every
// check script and the test harness would then have to carry — and a
// default export of a literal is the same thing minus the footgun.
const OUTPUTS = {
  'places.js': places,
  'groups.js': groups,
  'facts.js': factSets,
  'scenes.js': scenes,
  'words.js': { candidates, localWords },
}

console.log(
  `  ok  ${places.length} places, ${groups.length} categories, ` +
    `${factsTable.rows.length} facts in ${factSets.length} units, ` +
    `${scenes.length} scenes, ${candidates.length} answers` +
    (warnings.length ? `  (${warnings.length} warning${warnings.length > 1 ? 's' : ''})` : '')
)

const BANNER =
  '// Generated from content/ by scripts/content-build.mjs — do not edit.\n' +
  '// Edit the CSV and run `npm run content`.\n\n'

const render = (data) => BANNER + 'export default ' + JSON.stringify(data, null, 1) + '\n'

// --check has to answer two questions, not one. "Is every row valid" is
// the obvious one. The other is "does what is committed in
// src/data/generated still match content/" — because the app imports the
// generated files and nothing else. Edit a CSV, forget to run the
// build, and every check above passes while the site keeps serving the
// old pool. That is a silent deploy of stale content, and it is the
// failure mode a spreadsheet workflow invites.
if (checkOnly) {
  const drifted = []
  for (const [file, data] of Object.entries(OUTPUTS)) {
    let committed = null
    try {
      committed = await readFile(join(OUT, file), 'utf8')
    } catch {
      drifted.push(`${file} — missing`)
      continue
    }
    if (committed !== render(data)) drifted.push(`${file} — out of date`)
  }

  if (drifted.length) {
    console.error('\nsrc/data/generated no longer matches content/:\n')
    for (const d of drifted) console.error(`  ${d}`)
    console.error('\nRun `npm run content` and commit the result.')
    process.exit(1)
  }

  console.log('  --check: generated files are in sync, nothing written.')
  process.exit(0)
}

await mkdir(OUT, { recursive: true })
for (const [file, data] of Object.entries(OUTPUTS)) {
  await writeFile(join(OUT, file), render(data), 'utf8')
}
console.log(`  wrote src/data/generated/ (${Object.keys(OUTPUTS).length} files)`)
