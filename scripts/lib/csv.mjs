// A CSV reader and writer, because the alternative is a dependency and
// this is 60 lines.
//
// It handles the three things a spreadsheet export actually does that
// naive split(',') gets wrong: quoted fields containing commas, quoted
// fields containing newlines, and "" as an escaped quote. Excel, Numbers
// and Google Sheets all emit that dialect (RFC 4180), so a file that
// round-trips through any of them survives.

export function parseCsv(text) {
  // A BOM in front of the first header turns "id" into an id nothing
  // matches, and Excel writes one by default. Escaped rather than typed
  // literally, because a raw BOM in source is invisible to whoever
  // reads this next.
  const src = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')

  const rows = []
  let row = []
  let field = ''
  let quoted = false
  let started = false

  for (let i = 0; i < src.length; i++) {
    const c = src[i]

    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"'
          i++
        } else quoted = false
      } else field += c
      continue
    }

    if (c === '"' && field === '') {
      quoted = true
      started = true
      continue
    }
    if (c === ',') {
      row.push(field)
      field = ''
      started = false
      continue
    }
    if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      started = false
      continue
    }
    field += c
    started = true
  }

  if (field !== '' || started || row.length) {
    row.push(field)
    rows.push(row)
  }

  // Trailing blank lines, and rows a spreadsheet left behind as commas.
  return rows.filter((r) => r.some((v) => v.trim() !== ''))
}

// Rows as objects, keyed by the header line. Values are trimmed, because
// a stray space after a comma is the single most common hand-edit error
// and it is never meaningful here.
export function readTable(text) {
  const rows = parseCsv(text)
  if (!rows.length) return { header: [], rows: [] }
  const header = rows[0].map((h) => h.trim())
  return {
    header,
    rows: rows.slice(1).map((cells, i) => {
      const o = { __line: i + 2 }
      header.forEach((h, j) => {
        o[h] = (cells[j] ?? '').trim()
      })
      return o
    }),
  }
}

const quote = (v) => {
  const s = v === undefined || v === null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function writeTable(header, rows) {
  const lines = [header.join(',')]
  for (const r of rows) lines.push(header.map((h) => quote(r[h])).join(','))
  return lines.join('\n') + '\n'
}

// Multi-value cells. A pipe rather than a comma so the cell never needs
// quoting, and rather than a semicolon so it survives paste into a
// European locale spreadsheet, where the semicolon is the delimiter.
export const splitList = (v) =>
  String(v || '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)

export const joinList = (a) => (a || []).join(' | ')
