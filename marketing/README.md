# Marketing

Posters for elsewhere. Nothing in here is served by the site — that is
why it is not in `public/`, where anything added ships in the bundle and
gets precached by the service worker for every player.

## Regenerating

```bash
SITE_URL=https://fremontgame.vercel.app node scripts/make-ads.mjs
```

`SITE_URL` is the only thing you have to supply. Without it every poster
reads `SET-YOUR-DOMAIN` in bold across the bottom, and the script warns
you on the way past. Same variable `vite.config.js` uses, so if it is
already exported for a build it is already right here.

| file                     | size      | where it goes                               |
| ------------------------ | --------- | ------------------------------------------- |
| `square-1080.png`        | 1080×1080 | Instagram and Facebook feed, Nextdoor       |
| `portrait-1080x1350.png` | 1080×1350 | Instagram feed — the tallest it will show   |
| `story-1080x1920.png`    | 1080×1920 | Instagram and Facebook stories, Reels cover |
| `wide-1200x630.png`      | 1200×630  | link cards: Nextdoor, Facebook, X           |

Lead with the portrait on Instagram. It is the most screen you get for
the same scroll.

## Where the pictures come from, and why it matters

Every image is composed out of `src/art` — our own code, drawing our own
parts, from our own data. The plate in each poster is a real Zoom puzzle
rendered by the same composer the game uses.

It stays that way because the posters should look like the game. But the
licensing arithmetic under this changed when the site stopped selling
anything, and it changed in your favour — so what follows is the version
that is true now.

**The site is non-commercial.** No sponsors, nothing for sale, no
advertising. That removes the hardest constraint there is on reusing
someone else's picture, and it opens a whole category — anything licensed
`NC`, "non-commercial", "educational use" — that was closed a week ago.

What still applies:

- **Attribution is not optional.** CC BY and CC BY-SA both require a
  visible credit naming the photographer and the licence. Non-commercial
  does not excuse you from it.
- **Share-alike is still viral**, just cheaper. CC BY-SA asks that
  anything you build _on top of_ the image carries the same licence. That
  was painful for paid ad creative; for a free community poster it is
  mostly a line of text.
- **Being findable is not a licence.** Unchanged and permanent.
- **Searching stock sites for "Fremont"** still returns mostly **Fremont
  Street, Las Vegas** and Fremont, Seattle. Nothing to do with licensing
  — you will simply advertise the wrong town.
- **A recognisable face** still needs the person's permission, and stock
  licences do not provide it. This one gets stricter, not looser, when
  the subject is a private individual.

Two sources are cleanest if you want real photographs:

1. **Published in the US in 1930 or earlier** is public domain outright —
   no attribution, no share-alike, no permission, commercial or not. That
   covers the whole Niles/Essanay era: Essanay shot roughly 250 films in
   Niles from 1912, including five Chaplins. Free, unambiguous, and
   nobody local is using it.
2. **Asked for directly.** Small archives are far more generous with a
   free local project than with a business, which is exactly what you now
   are. See `outreach/museum.md`.

## Rule

Do not put an image in a poster, a post, or the site until you can name
its licence and say who to credit. If that takes more than a minute to
establish, draw it instead — the composer is right there.
