// Dump the content that currently lives in the data modules out to
// content/*.csv.
//
// This runs once to seed the spreadsheets, and then never again unless
// something is edited in code by mistake — after the first run the CSVs
// are the source of truth and this script would overwrite an edit made
// in the sheet. It refuses to clobber an existing file unless you pass
// --force, for exactly that reason.
//
//   node scripts/content-export.mjs [--force]

import { writeFile, readFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeTable, joinList } from './lib/csv.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'content')
const force = process.argv.includes('--force')

const { PLACES } = await import(join(ROOT, 'src/data/town.js'))
const { GROUPS } = await import(join(ROOT, 'src/data/groups.js'))
const { FACT_SETS } = await import(join(ROOT, 'src/data/higherlower.js'))
const { SCENES } = await import(join(ROOT, 'src/data/thennow.js'))
// words.js imports the 14,855-word guess list as `./…txt?raw`, which is
// a Vite thing Node cannot resolve, so this one is read rather than
// imported. Both arrays are plain literals — no logic to lose.
const wordsSrc = await readFile(join(ROOT, 'src/data/words.js'), 'utf8')
const literalArray = (name) => {
  const m = wordsSrc.match(
    new RegExp(`(?:const|export const)\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`)
  )
  if (!m) throw new Error(`could not find ${name} in words.js`)
  return [...m[1].matchAll(/'([A-Z]{5})'/g)].map((x) => x[1])
}
const CANDIDATES = literalArray('CANDIDATES')
const LOCAL_WORDS = literalArray('LOCAL_WORDS')

const TABLES = {
  'places.csv': {
    header: ['id', 'name', 'lat', 'lng', 'district', 'motifs', 'fame'],
    rows: PLACES.map((p) => ({ ...p, motifs: joinList(p.motifs) })),
  },

  'groups.csv': {
    header: ['difficulty', 'label', 'item1', 'item2', 'item3', 'item4'],
    rows: GROUPS.map((g) => ({
      difficulty: g.d,
      label: g.label,
      item1: g.items[0],
      item2: g.items[1],
      item3: g.items[2],
      item4: g.items[3],
    })),
  },

  'facts.csv': {
    header: ['unit', 'name', 'value', 'anchor'],
    rows: FACT_SETS.flatMap((s) =>
      s.facts.map((f) => ({
        unit: s.unit,
        name: f.name,
        value: f.value,
        anchor: f.anchor ? 'yes' : '',
      }))
    ),
  },

  'scenes.csv': {
    header: ['id', 'placeId', 'caption', 'year', 'then', 'now'],
    rows: SCENES.map((s) => ({ ...s, then: joinList(s.then), now: joinList(s.now) })),
  },

  'words.csv': {
    header: ['word', 'local'],
    rows: CANDIDATES.map((w) => ({ word: w, local: LOCAL_WORDS.includes(w) ? 'yes' : '' })),
  },
}

await mkdir(OUT, { recursive: true })

let wrote = 0
let kept = 0

for (const [file, { header, rows }] of Object.entries(TABLES)) {
  const path = join(OUT, file)
  if (!force) {
    const exists = await access(path).then(
      () => true,
      () => false
    )
    if (exists) {
      console.log(`  kept    ${file}  (already exists — pass --force to overwrite)`)
      kept++
      continue
    }
  }
  await writeFile(path, writeTable(header, rows), 'utf8')
  console.log(`  wrote   ${file}  ${rows.length} rows`)
  wrote++
}

console.log(`\n${wrote} written, ${kept} left alone.`)
if (kept) console.log('Nothing was overwritten. Your edits are safe.')
