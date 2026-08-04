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
| I | **Zoom** | An engraving of Mission San José, cropped to 9×. Every miss pulls the camera back one stop. Wrong guesses report real distance and compass bearing to the answer. |
| II | **Connections** | Sixteen names, four groups. Irvington and Mission San Jose are *both* townships and high schools — the puzzle is built around that. |
| III | **Then & Now** | Drag-wipe between Niles Boulevard in the Essanay days and Niles Boulevard today, then name the year. |
| IV | **Higher or Lower** | Five rounds. Mission Peak vs Monument Peak is the one that gets people. |
| V | **The Word** | Five letters, refereed by the published Wordle guess list. Proper two-pass scoring, so double letters behave. |

Each writes a spoiler-free share card and tracks streaks in `localStorage`.

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

## Phone

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
