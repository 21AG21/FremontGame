# The Fremont Daily

Five daily puzzles about Fremont, California.

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## The five

| No. | Puzzle | Mechanic |
|---|---|---|
| I | **Zoom** | A line engraving of one of **106 Fremont places**, cropped to 4.2×. Every miss pulls the camera back one stop. Wrong guesses report real distance and compass bearing to the answer. |
| II | **Groups** | Sixteen names, four groups, off a pool of **100 categories**. Irvington and Mission San Jose are *both* townships and high schools — the puzzle is built around that. |
| III | **Then & Now** | Drag-wipe between Niles Boulevard in the Essanay days and Niles Boulevard today, then name the year. |
| IV | **Higher or Lower** | Five rounds drawn from **136 sourced facts** in ten units. Mission Peak vs Monument Peak is the one that gets people. |
| V | **The Word** | Five letters, refereed by the published Wordle guess list. Proper two-pass scoring, so double letters behave. |

Each writes a spoiler-free share card and tracks streaks in `localStorage`.

## The content pools

Three of the five now come off a pool indexed by day number, so everyone in
town gets the same puzzle and reloading doesn't reroll it.

| | pool | file | a year of play |
|---|---|---|---|
| Zoom | 106 places | `data/zoom.js`, `data/town.js` | 103 distinct answers in 365 days |
| Groups | 100 categories, 25 per difficulty | `data/groups.js` | 365 distinct boards, none repeated |
| Higher or Lower | 136 facts in 10 units | `data/higherlower.js` | 5 valid rounds every day |
| The Word | 24 answers | `data/words.js` | repeats after 24 days — the thin one |

Groups gets 365 unique boards out of 100 categories because a board is a
*combination*: one group at each difficulty, and two groups that share a tile
are never dealt together. That last rule is what keeps "Mission San Jose is a
school AND a township" a trap instead of a bug.

Then & Now is still one hand-built puzzle. It needs a matched pair of images
per day, which is a photo-sourcing job rather than a data-entry one.

### The Zoom drawings are composed, not drawn

A hundred hand-drawn engravings is not a thing anyone finishes. So `town.js`
says what a place is *made of* — `motifs: ['victorian', 'windmill', 'orchard']`
for Ardenwood — `art/Parts.jsx` knows how to draw each of the 66 parts, and
`art/Engraving.jsx` stacks them back to front on one 800×600 plate, seeded off
the place id so a drawing never changes between loads.

**`localhost:5173/?sheet` renders all 106 on one page**, each as it opens and
again whole, with the zoom focus marked. Composing from a shared library means
a bad motif combination is otherwise invisible until someone gets that day's
puzzle.

The crop is aimed, not random: `ANCHORS` in `data/zoom.js` records where each
motif's subject actually sits on the plate. Without it, half the puzzles open
on blank sky.

## The facts are real

Every number and date in `src/data/puzzles.js` was checked against a source,
because a hyperlocal puzzle that invents facts is worse than no puzzle — the
first person who knows better stops trusting it and never comes back.

- Fremont incorporated 23 January 1956 from Centerville, Niles, Irvington,
  Mission San José and Warm Springs — [City of Fremont](https://www.fremont.gov/about/our-story)
- Mission Peak 2,520 ft; Monument Peak 2,594 ft — [Mission Peak](https://en.wikipedia.org/wiki/Mission_Peak), [Monument Peak](https://en.wikipedia.org/wiki/Monument_Peak_(San_Francisco_Bay_Area))
- Chaplin at the Niles Essanay studio, January 1915: five pictures in ten
  weeks, the last of them *The Tramp* — [Museum of Local History](https://museumoflocalhistory.org/exhibits/exhibit-movies-in-niles/), [KQED](https://www.kqed.org/news/11789138/how-charlie-chaplin-and-silent-films-flourished-in-the-east-bay)
- GM Fremont Assembly 1962–1982, NUMMI 1984–2010, Tesla from 2010 —
  [Fremont Assembly](https://en.wikipedia.org/wiki/Fremont_Assembly), [NUMMI](https://en.wikipedia.org/wiki/NUMMI)
- Central Park 450 acres, Lake Elizabeth 83; Coyote Hills ~978 acres —
  [City of Fremont](https://www.fremont.gov/government/departments/parks-recreation/parks/central-park), [East Bay Parks](https://www.ebparks.org/parks/coyote-hills)

## Design

Built to the design doc (turn 5, options a–j): flat squircle panels on a
faint Mission Peak ridge, the section bar pinned at the bottom, Newsreader
for the wordmark and captions, Work Sans for everything else.

**Three colours, each meaning exactly one thing.** Nothing else in the
interface is coloured:

| | light | dark | means |
|---|---|---|---|
| navy | `#043764` | `#0A4C87` | the thing you have selected right now |
| green | `#33632E` | `#33632E` | correct |
| amber | `#C8971B` | `#D9A72A` | right letter, wrong place |

Light and dark are the same layout with a different set of values, all
declared at the top of `styles.css`.

With nothing saved, the CSS media query governs and the app follows the
system live. The toggle in the header writes `[data-theme]` on `<html>`,
which outranks the media query, and remembers the choice — so the dark
block is written twice on purpose. An inline script in `index.html`
applies a saved theme before first paint so it doesn't flash. See
`src/lib/theme.js`.

Two values are not mirror images:

*The engravings keep a light plate in both modes.* `--art-ink` cools from
`#043764` to `#08203A` on dark, but `--art-paper` stays white — inverting a
line drawing turns it into a photographic negative, which reads as a bug.
The Then & Now seam and handle take the plate's colours for the same reason.

*Green as a fill and green as type are different values.* `#33632E` sits
almost on top of the dark panel, so text uses `--green-ink`, which lifts to
`#7CB46C` on dark.

Two things that carried over and still hold:

*Shading is hatch density, not gray.* The engravings carry no `opacity` and
no mid-tones — light and shade come from how tightly the hatch patterns are
ruled, which is how engraving actually works. A 19× crop still shows real
structure.

*The share marks are CSS boxes, not characters.* No text face here has block
glyphs, and the shade characters (`░ ▒ ▓`) dither to gray. On screen the
marks are `<span>`s; the characters appear only in the clipboard text.

Swap the engravings for real photographs and nothing else changes: the zoom
is a CSS `transform-origin`, and it does not care what it is scaling.

Every measurement in `styles.css` is the doc's, not a rounded-off version
of it — 236px plates, 46px word cells, 52px keys, `minmax(64px, 1fr)`
group tiles, keyboard rows inset 0 / 10 / 22px.

Two things exist that the doc does not draw:

- **A fourth keyboard row, with Delete and Enter.** The doc draws 26
  letters and no action keys, which cannot be played on a phone. It is a
  separate row so the three lettered rows still match the drawing exactly.
- **The theme toggle** in the top right, sized to the section-bar icons.

And one known consequence of matching exactly: **Groups opens with an
orphan tile.** The doc specifies three columns, and it was drawn at 12
tiles, where three divides cleanly. The real board opens at 16, so the
last row holds one. Change `repeat(3, …)` to `repeat(4, …)` in `.conn-grid`
if you would rather have the even board than the drawing — four divides
16, 12, 8 and 4.

## Screens

The layout is one phone-sized column that **scales up rather than staying a
440px stamp on a big monitor** — `zoom` on `.sheet`, stepped by media queries
that key off height as well as width, since a one-screen app can't use a wide
short window. `zoom` rather than `transform` because it re-lays-out at the new
size, so 23px type is really 23px at every step. Checked to 1920×1440, where
it runs at 1.95× and 858px wide with no overflow.

The section bar is the one piece of glass in the design: translucent, blurred
and saturated, lifted off the board by a shadow and lit along its top edge,
with a solid-panel fallback under `@supports not (backdrop-filter)`.

Checked at 375×812 and 1280×800, light and dark: no overflow on either axis,
every tap target ≥44px. The Then & Now wipe sets `touch-action: none` so
dragging it doesn't scroll the page. The plate keeps a fixed height on
purpose — it uses `preserveAspectRatio="slice"`, so a frame that changes
shape shows a different part of the drawing to different players.

`corner-shape: squircle` is progressive enhancement; browsers without it get
the plain `border-radius` underneath.

## Adding your own puzzles

`src/data/town.js` holds the places and coordinates that drive the
autocomplete and the distance hints. `src/data/puzzles.js` holds the answers.

`src/data/words.js` holds The Word's queue. Every entry has to be typeable,
which means it is either in the Wordle guess list or in `LOCAL_WORDS` — the
Fremont proper nouns (NILES, TESLA, NUMMI, ARDEN) that common-English lists
don't carry. The answer is picked by day number, so everyone in town gets
the same word and reloading doesn't reroll it.

## Known gaps

- Switching sections restarts that puzzle — state isn't lifted out of the
  puzzle components yet. Fine for a prototype, wrong for real use.
- Streaks are per-device. Supabase would fix that and give you a leaderboard.
- **One puzzle per type.** This is the real gap. The mechanics are done; the
  content queue is not. Bank thirty days before you launch, or you'll quit
  authoring in week three — that, not code, is what kills daily puzzles.
