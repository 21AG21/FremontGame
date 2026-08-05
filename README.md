# The Fremont Daily

Five daily puzzles about Fremont, California.

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## The five

| No. | Puzzle              | Mechanic                                                                                                                                                                                   |
| --- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I   | **Zoom**            | A line engraving of one of **63 Fremont places**, opening at 2.6×. Every miss pulls the camera back one stop. Wrong guesses report a warmth word, a compass bearing and a coarse distance. |
| II  | **Groups**          | Twelve tiles, **three groups of four**, off a pool of 100 categories. Mission San Jose is _both_ a township and a high school — the puzzle is built around that.                           |
| III | **Then & Now**      | Drag-wipe between two eras of the same place, then name the year of the older one.                                                                                                         |
| IV  | **Higher or Lower** | Five rounds drawn from **134 sourced facts** in ten units. The side you are shown is always something a resident can picture.                                                              |
| V   | **The Word**        | Five letters, refereed by the published Wordle guess list. Two-pass scoring, so double letters behave.                                                                                     |

Each writes a spoiler-free share card and tracks streaks in `localStorage`.

## The content pools

Every game comes off a pool indexed by day number, so everyone in town gets the
same puzzle and reloading doesn't reroll it. Nothing has to run at midnight — a
build from six months ago still serves today's board.

|                 | pool                              | comes round again              |
| --------------- | --------------------------------- | ------------------------------ |
| Zoom            | 63 answers, from 113 places       | every 63 days                  |
| Groups          | 100 categories, 25 per difficulty | ≥11 days between repeats       |
| Higher or Lower | 134 facts in 10 units             | no pair repeats within 28 days |
| Then & Now      | **14 scenes**                     | every 14 days                  |
| The Word        | 24 queued, **18 playable**        | every 18 days                  |

The two in bold are thin, and they are the first place to spend an hour.

The Word's queue loses six entries to a fairness filter: an answer is rejected
if too many words differ from it in one position, because once you know four of
five letters each guess eliminates exactly one candidate and six guesses are not
enough. `HILLS` lost from every standard opener. It costs `NILES`, which is the
best word on the list — the filter is a filter rather than a hand-edited list
precisely so that adding a new answer cannot quietly reintroduce the problem.

Groups deals all four items of each category, so nothing is hidden off-board.
A board takes one category from the easiest tier, one from the hardest, and
alternates the two in the middle — dropping a tier at random gives an
all-gentle board one day and an all-brutal one the next.

## Editing the content

**You do not have to open an editor.** The pools live in `content/*.csv`.

```bash
npm run content        # check every row, then regenerate
npm run content:check  # check only — this is what CI runs
```

If a row is wrong it names the file, the line and the fix, and writes nothing.
It knows that a latitude outside Fremont means a swapped pair or a dropped
minus, that a motif `Parts.jsx` cannot draw is a place silently losing half its
picture, that a unit with no anchor makes Higher or Lower a coin flip, and that
an answer outside the guess list is one nobody can type.

`npm run build` runs the check first, so a bad row fails the deploy instead of
reaching a player.

There is also an Airtable base with all 385 rows in it, and a daily GitHub
Action that pulls, validates and commits — so an edit at nine at night is live
by morning without anyone touching git. See [`content/README.md`](content/README.md),
which is written for someone who does not want to read this file.

### The Zoom drawings are composed, not drawn

A hundred hand-drawn engravings is not a thing anyone finishes. So a place says
what it is _made of_ — `victorian | windmill | orchard` for Ardenwood —
`art/Parts.jsx` knows how to draw each of the 66 parts, and `art/Engraving.jsx`
stacks them back to front on one 800×600 plate, seeded off the place id so a
drawing never changes between loads.

**`localhost:5173/?sheet` renders all 63 on one page**, each as it opens and
again whole, with the zoom focus marked. Composing from a shared library means a
bad motif combination is otherwise invisible until someone gets that day's
puzzle.

The crop is aimed, not random: `ANCHORS` in `data/zoom.js` records where each
motif's subject actually sits on the plate. Without it, half the puzzles open on
blank sky.

## The facts are real

Every number and date was checked against a source, because a hyperlocal puzzle
that invents facts is worse than no puzzle — the first person who knows better
stops trusting it and never comes back.

- Fremont incorporated 23 January 1956 from Centerville, Niles, Irvington,
  Mission San José and Warm Springs — [City of Fremont](https://www.fremont.gov/about/our-story)
- Mission Peak 2,520 ft; Monument Peak 2,594 ft — [Mission Peak](https://en.wikipedia.org/wiki/Mission_Peak), [Monument Peak](<https://en.wikipedia.org/wiki/Monument_Peak_(San_Francisco_Bay_Area)>)
- Chaplin at the Niles Essanay studio, January 1915: five pictures in ten weeks,
  the last of them _The Tramp_ — [Museum of Local History](https://museumoflocalhistory.org/exhibits/exhibit-movies-in-niles/), [KQED](https://www.kqed.org/news/11789138/how-charlie-chaplin-and-silent-films-flourished-in-the-east-bay)
- GM Fremont Assembly 1962–1982, NUMMI 1984–2010, Tesla from 2010 —
  [Fremont Assembly](https://en.wikipedia.org/wiki/Fremont_Assembly), [NUMMI](https://en.wikipedia.org/wiki/NUMMI)
- Central Park 450 acres, Lake Elizabeth 83; Coyote Hills ~978 acres —
  [City of Fremont](https://www.fremont.gov/government/departments/parks-recreation/parks/central-park), [East Bay Parks](https://www.ebparks.org/parks/coyote-hills)

## Design

Flat squircle panels on a Mission Peak ridge, the section bar pinned at the
bottom, Newsreader for the wordmark, Work Sans for everything else — including
the Word grid, which is the one place a reading face actively hurts.

The page is sage rather than white and the ridge is green, because this is a
town with a ridge on one side and a marsh on the other. Both are decoration:
they carry no state, so green stays free to mean one thing.

**Three colours, each meaning exactly one thing.** Nothing else is coloured:

|       | light     | dark      | means                                 |
| ----- | --------- | --------- | ------------------------------------- |
| navy  | `#043764` | `#1077D3` | the thing you have selected right now |
| green | `#33632E` | `#43833D` | correct                               |
| amber | `#8E6B13` | `#D9A72A` | right letter, wrong place             |

All 22 text and state-fill pairs are measured against WCAG in both themes: 4.5:1
for text, 3:1 for fills. The light amber is deep with a white label because no
amber clears both 3:1 against a green page and 4.5:1 for dark ink on it.

With nothing saved, the CSS media query governs and the app follows the system
live. The toggle writes `[data-theme]` on `<html>`, which outranks the media
query — so the dark block is written twice on purpose. An inline script applies
a saved theme before first paint so it doesn't flash.

Two values are not mirror images:

_The engravings keep a light plate in both modes._ `--art-ink` cools on dark but
`--art-paper` stays white — inverting a line drawing turns it into a
photographic negative, which reads as a bug.

_Green as a fill and green as type are different values._ The fill sits almost
on top of the dark panel, so text uses `--green-ink`.

And two that carried over:

_Shading is hatch density, not grey._ The engravings carry no `opacity` and no
mid-tones — light and shade come from how tightly the hatch is ruled, which is
how engraving actually works.

_The share marks are CSS boxes, not characters._ No text face here has block
glyphs, and the shade characters dither to grey. The characters appear only in
the clipboard text.

## The glass

The section bar is a real material, not a blur. Vibrancy, a masked gradient rim
with two speculars, thickness hairlines, contact and far shadows, per-pixel
adaptive normalisation so a label reads the same over any backdrop, and a pill
that slides under your finger. The specular tracks the gyroscope where the
browser offers it without a permission prompt.

It also **refracts** — the backdrop bends at the rim, via an SVG displacement
map derived from the pane's own silhouette. That part is Chromium-only:

- Chrome will not resolve `feImage` inside a `backdrop-filter`, which is why the
  map is built from `SourceAlpha` rather than an image.
- **Safari does not run it at all**, and feature detection cannot find that out:
  `CSS.supports()` returns `true`, `getComputedStyle` hands the value back, and
  nothing paints. Measured on a real iPhone with `public/lens-test.html` — two
  panes over hard diagonal stripes, one lensed, and Safari draws them
  pixel-identical where Chrome visibly bends one.

The lens is its own layer for exactly that reason: where it does no-ops, it
paints nothing and the blur underneath is untouched. Everything else in the
material works in Safari, verified on device.

`public/lens-test.html` is unlinked and 4KB. Re-run it in a year: if WebKit
starts honouring this, the refraction turns on with no code change.

`corner-shape: squircle` is progressive enhancement — Safari reports false and
gets the plain `border-radius` underneath.

## Screens

One phone-sized column that **scales up rather than staying a 440px stamp on a
big monitor** — `zoom` on `.sheet`, stepped by media queries keyed off height as
well as width, since a one-screen app can't use a wide short window. `zoom`
rather than `transform` because it re-lays-out at the new size, so 23px type is
really 23px at every step.

Rotating the phone doesn't just make it shorter, it makes it nearly twice as
wide, and the landscape layout uses that: Groups goes to four columns, Higher or
Lower puts its two halves side by side.

Checked with no overflow on either axis, both themes, at 320×568, 375×812,
667×375 and 1512×1400. Every tap target clears 44px except the Word keyboard at
320px, which is 25px wide — disclosed in the accessibility statement.

## Known gaps

- **Then & Now has 14 scenes and The Word 18 playable answers.** Both repeat
  inside a fortnight. This is the real gap: the mechanics are done, the content
  queue is not. Bank thirty days before you launch, or you'll quit authoring in
  week three — that, not code, is what kills daily puzzles.
- **No refraction on Safari.** A WebKit limitation, not a bug here. See above.
- Switching games restarts that puzzle's animations; play state itself is saved
  per day and survives.
- Streaks are per-device. Supabase would fix that and give you a leaderboard.
- Neither modal traps focus or handles Escape, and no screen reader user has
  ever tested this.
- The legal documents are drafts. They describe what the site actually does, but
  they have not been read by a lawyer.
