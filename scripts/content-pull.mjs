// Pull content/*.csv from wherever the sheet actually lives, so an edit
// made in a browser reaches the site without anyone touching git.
//
// Two sources, picked by which environment variables are set:
//
//   SHEET_ID=<google sheets doc id>
//     A Google Sheet shared "anyone with the link can view", with one
//     tab per table named places, groups, facts, scenes, words. No key
//     needed — the gviz endpoint serves any link-viewable sheet as CSV.
//
//   AIRTABLE_BASE=<appXXXX>  AIRTABLE_TOKEN=<pat>
//     An Airtable base with one table per file, same names, and columns
//     matching the CSV headers exactly.
//
// Nothing here is required. With neither set, content/*.csv in the repo
// IS the source of truth and you edit it in Numbers or the GitHub web
// UI. That is the default on purpose: the site must not stop working
// because a spreadsheet was renamed.

import { writeFile, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeTable, readTable, joinList } from './lib/csv.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'content')

const TABLES = {
  places: ['id', 'name', 'lat', 'lng', 'district', 'motifs', 'fame'],
  groups: ['difficulty', 'label', 'item1', 'item2', 'item3', 'item4'],
  facts: ['unit', 'name', 'value', 'anchor'],
  scenes: ['id', 'placeId', 'caption', 'year', 'then', 'now'],
  words: ['word', 'local'],
}

const { SHEET_ID, AIRTABLE_BASE, AIRTABLE_TOKEN } = process.env

if (!SHEET_ID && !(AIRTABLE_BASE && AIRTABLE_TOKEN)) {
  console.log('No SHEET_ID and no AIRTABLE_BASE/AIRTABLE_TOKEN set.')
  console.log('content/*.csv in the repo is the source of truth — nothing to pull.')
  process.exit(0)
}

const get = async (url, headers) => {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${url.split('?')[0]}`)
  return res
}

async function fromGoogle(name) {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:csv&sheet=${encodeURIComponent(name)}`
  const text = await (await get(url)).text()
  // A sheet that isn't shared returns an HTML sign-in page with a 200,
  // which would otherwise be written out as a one-cell CSV and wipe the
  // table. Better to stop than to silently empty the game.
  if (/^\s*</.test(text)) {
    throw new Error(
      `tab "${name}" came back as HTML, not CSV — the sheet is probably not shared ` +
      `"anyone with the link can view"`
    )
  }
  return readTable(text).rows
}

async function fromAirtable(name) {
  const headers = { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
  const rows = []
  let offset

  do {
    const url =
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(name)}` +
      `?pageSize=100${offset ? `&offset=${offset}` : ''}`
    const json = await (await get(url, headers)).json()
    for (const rec of json.records) {
      const f = { ...rec.fields }
      // Airtable multi-selects and linked records come back as arrays;
      // the CSV wants one pipe-separated cell.
      for (const k of Object.keys(f)) if (Array.isArray(f[k])) f[k] = joinList(f[k])
      rows.push(f)
    }
    offset = json.offset
  } while (offset)

  return rows
}

const source = SHEET_ID ? 'Google Sheets' : 'Airtable'
const fetchTable = SHEET_ID ? fromGoogle : fromAirtable

console.log(`Pulling from ${source}…`)

let changed = 0

for (const [name, header] of Object.entries(TABLES)) {
  const path = join(OUT, `${name}.csv`)
  let rows

  try {
    rows = await fetchTable(name)
  } catch (e) {
    console.error(`  ${name}: ${e.message}`)
    console.error('\nNothing was written. The site keeps serving the content already in the repo.')
    process.exit(1)
  }

  // An empty table is almost always a permissions or naming problem
  // rather than a deliberate deletion, and writing it out would take a
  // game off the site.
  if (!rows.length) {
    console.error(`  ${name}: came back with zero rows — refusing to empty the table.`)
    process.exit(1)
  }

  const next = writeTable(header, rows)
  const prev = await readFile(path, 'utf8').catch(() => '')
  if (next === prev) {
    console.log(`  ${name}: unchanged (${rows.length} rows)`)
    continue
  }

  await writeFile(path, next, 'utf8')
  console.log(`  ${name}: updated (${rows.length} rows)`)
  changed++
}

console.log(changed ? `\n${changed} table(s) changed.` : '\nEverything already up to date.')
