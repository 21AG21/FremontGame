# The content

Everything the five games draw on lives in this folder, as five
spreadsheets. You can open any of them in Numbers, Excel or Google
Sheets, edit it, and the site picks it up. **You do not have to touch
any code to add a puzzle.**

```bash
npm run content
```

That checks every row and regenerates what the site reads. If something
is wrong it tells you the file, the line number and what to do about it,
and it writes nothing — a bad row can never reach a player.

---

## How the daily puzzle actually works

There is no "today's puzzle" record anywhere, and nothing has to run at
midnight. Each game holds a **pool**, and the browser works out which
entry today is by counting days from 1 August 2026 and stepping through
the pool on a fixed cycle.

That means three things worth knowing:

- **Everyone in town gets the same puzzle on the same day**, and a
  reload doesn't reroll it.
- **A build from six months ago still serves the right puzzle**, so
  nothing breaks if the deploy pipeline is down or a sync job fails.
- **You are always editing the future, not today.** Add a category and
  it enters the rotation; it won't necessarily appear tomorrow.

Pools cycle rather than repeat at random, so nothing comes back until
the whole pool has been through. Roughly:

| Game            | Pool           | Comes round again                |
| --------------- | -------------- | -------------------------------- |
| Zoom            | 63 answers     | every 63 days                    |
| Groups          | 100 categories | at least 11 days between repeats |
| Higher or Lower | 134 facts      | no pair repeats within 28 days   |
| Then & Now      | 14 scenes      | **every 14 days**                |
| The Word        | 24 answers     | **every 24 days**                |

The two in bold are thin. They are the first place to spend an hour if
you want the site to feel less repetitive.

---

## The five files

### `places.csv` — Zoom, and every drawing

| column       | what it is                                                                        |
| ------------ | --------------------------------------------------------------------------------- |
| `id`         | short name, lowercase with hyphens, never reused                                  |
| `name`       | how it appears on screen — "The Patterson House", not "patterson house"           |
| `lat`, `lng` | decimal degrees. Right-click a spot in a map app and paste the pair               |
| `district`   | groups the autocomplete. `Next door` means another town: a decoy, never an answer |
| `motifs`     | what the place is made of, separated by `\|`, **back of the scene to front**      |
| `fame`       | `1` a six-year resident names it · `2` a long-timer does · `3` decoy only         |

`motifs` is the interesting one. The Zoom drawing is _composed_ from
these — there is no artwork file per place. `ridge \| mission \| olives \|
road` draws a ridge behind a mission with olive trees and a road in
front. The vocabulary is whatever `src/art/Parts.jsx` can draw, and the
check will tell you if you use a word it doesn't know.

Only `fame` 1 and 2 can be the answer. `fame 3` places stay in the
autocomplete as wrong guesses, which is where they're useful.

### `groups.csv` — Groups

Four items per row, exactly. A board is three categories, twelve tiles.

`difficulty` is `0` (the one you spot immediately) to `3` (the one you
only get by elimination). Every board takes one from tier 0, one from
tier 3, and alternates the middle — so there is always a way in and
always something that makes you work.

**Repeating an item across categories is the point.** "Mission San Jose"
is a township, a high school, a mission and a district. The picker never
puts two categories that share a tile on the same board, so the trap
survives and the board is still solvable. If an item shows up in more
than five categories you'll get a warning — past that, the picker starts
skipping categories to avoid it.

### `facts.csv` — Higher or Lower

One row per fact. Facts with the same `unit` are compared against each
other, so the unit text has to match **exactly** — "feet above sea
level" and "Feet above sea level" are two separate pools.

`anchor` marks a fact a Fremont resident could picture. The side you're
_shown_ is always an anchor, so you have somewhere to reason from. Every
unit needs at least one or the check fails.

Every number here should be real and checked. A hyperlocal puzzle that
invents numbers is worse than no puzzle: the first person who knows
better stops trusting it and never comes back.

### `scenes.csv` — Then & Now

`then` and `now` are two motif lists for the same spot, and the wipe
reveals one under the other. `year` is the year of the **older** view.

The two lists have to differ — identical lists mean the wipe shows
nothing and the game is "guess a year from an unchanged picture". Two
scenes on the same place with the same `now` list are also rejected:
that's one Today picture with two different right answers.

### `words.csv` — The Word

One five-letter word per row, in the order the town will see them.

A word has to be in the published Wordle guess list, or marked `local`
— otherwise nobody can type it and it isn't a puzzle. `local` adds it to
the list of accepted guesses too.

Not every word you add will be used. Answers are filtered on how many
words differ from them in one letter: `HILLS` was unwinnable from every
standard opener because `_ILLS` has nineteen members. `npm run content`
accepts the row; the game quietly drops it. `NILES` survives, which is
lucky, because it's the best word on the list.

---

## Editing in Airtable

There is a base called **The Fremont Daily — content**, id
`appUeif6dV0j9eBed`, with all five tables and all 385 rows already in
it. Every column carries a description explaining what it does, and
`district`, `fame` and `difficulty` are dropdowns so they cannot be
typed wrong.

It is not connected to anything yet. To switch the site over to it:

1. In Airtable, make a personal access token with `data.records:read`
   and `schema.bases:read` on that base. **Do not paste it into a chat
   window or commit it** — it goes straight into step 2.
2. In the GitHub repo, Settings → Secrets and variables → Actions, add
   `AIRTABLE_BASE` = `appUeif6dV0j9eBed` and `AIRTABLE_TOKEN` = the
   token.
3. Actions → Daily content → Run workflow, to check it works now rather
   than finding out at 2am.

After that, a job runs every morning: it pulls the base, checks every
row, and commits only if everything passes — which redeploys the site.
If the check fails it stops, and the site keeps serving what it already
had.

**Row order is the queue order.** The Word plays its answers top to
bottom, so dragging a row in Airtable changes what the town sees. The
other four tables don't care about order.

### Or Google Sheets, if you'd rather

One sheet, five tabs named `places`, `groups`, `facts`, `scenes`,
`words`, columns matching the headers above. Share it "anyone with the
link can view" and set `SHEET_ID` to the id out of its URL. No token
needed. `npm run content:export --force` regenerates the CSVs to import.

### Or neither

Without `AIRTABLE_BASE` or `SHEET_ID` set, the CSV files in this folder
are the source of truth and you edit them here — in GitHub's web UI, or
in Numbers, or anywhere else. The daily job still runs and still checks
them; it just has nothing to pull.

You can run a pull by hand from the Actions tab, or locally:

```bash
AIRTABLE_BASE=appUeif6dV0j9eBed AIRTABLE_TOKEN=... npm run content:pull
```

---

## The commands

|                          |                                                                          |
| ------------------------ | ------------------------------------------------------------------------ |
| `npm run content`        | check and regenerate. Run this after any edit                            |
| `npm run content:check`  | check only, write nothing. This is what CI runs                          |
| `npm run content:pull`   | fetch from Google Sheets or Airtable if configured                       |
| `npm run content:export` | dump the current data back out to CSV. Won't overwrite without `--force` |

`npm run build` runs `npm run content` first, so a bad row fails the
deploy rather than reaching the site.
