# Marketing

Posters for elsewhere. Nothing in here is served by the site — that is
why it is not in `public/`, where anything added ships in the bundle and
gets precached by the service worker for every player.

## Regenerating

```bash
SITE_URL=https://your-domain node scripts/make-ads.mjs
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

That is a licensing decision, not an aesthetic one. This site is about to
take sponsor money, which makes every use of an image a **commercial**
use, and commercial use is exactly where free-image licences stop being
free:

- **Stock sites.** Unsplash and Pexels are free for commercial use, but
  the licence does not cover a recognisable person in frame — that needs
  a model release the platform does not provide. Worse for us
  specifically: searching either site for "Fremont" returns mostly
  **Fremont Street, Las Vegas** and Fremont, Seattle. It is very easy to
  end up advertising a Fremont, California puzzle with a photograph of a
  Nevada casino.
- **Wikimedia Commons.** Legally clean and correctly attributed, but most
  Fremont files are **CC BY-SA**, which requires attribution _and_
  share-alike. Share-alike on a paid placement means licensing your own
  creative under the same terms. Read each file's page: a handful are CC0
  or CC BY, and those are the only ones worth using.
- **Anything else found by searching.** Being findable is not a licence.

Two sources are genuinely clean if you want real photographs later:

1. **Published in the US in 1930 or earlier** is public domain outright —
   no attribution, no share-alike, no permission. That covers the whole
   Niles/Essanay era: Essanay shot roughly 250 films in Niles from 1912,
   including five Chaplins. Free, unambiguous, and nobody local is using
   it.
2. **Licensed directly from the holder.** See `outreach/museum.md`.

## Rule

Do not put an image in a poster, a post, or the site until you can name
its licence and the name allows commercial use. If that takes more than a
minute to establish, draw it instead — the composer is right there.
