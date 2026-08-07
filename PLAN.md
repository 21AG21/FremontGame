# What's left, and who does it

Everything here needs a password, a card, or your name on it — which is
why it is a list for you rather than work already done. Ordered so that
nothing waits on something further down.

Repo visibility could not be confirmed from this machine. **Assume this
file is public** and keep secrets out of it.

---

## 0 · Today, before anything else

### 0.1 Revoke the leaked GitHub token

A personal access token beginning `ghp_qMHiOkb…` was pasted into a chat
window. Treat it as public. It is still valid until you revoke it, and it
can push to your repo.

1. https://github.com/settings/tokens
2. Find the token. Delete it. (Regenerating is not enough — delete.)
3. `rm ~/.gh_token` — the same token is sitting in that file in your home
   directory in plain text.
4. https://github.com/settings/security-log — look for anything you did
   not do.
5. If you need a token again, make a fine-grained one scoped to the one
   repo, and put it in the `gh` keychain rather than a dotfile.

**Do not paste the new one anywhere, including to me.** I do not need it
and cannot use it safely.

### 0.2 Check the link card on the live site — done here, needs one look

The site is at **fremontgame.vercel.app**. The posters carry it, and both
outreach drafts have it in place of the old `[URL]` placeholder.

Regenerate any time with:

```bash
SITE_URL=https://fremontgame.vercel.app node scripts/make-ads.mjs
```

The one thing left is a look you have to take yourself: paste the link
into a group chat and check the preview card renders with the wordmark
and the NILES tiles. `og:image` has to be absolute, and it is filled in
at build time from Vercel's own environment — so it is right in
production and wrong on localhost, which means localhost cannot prove it.

---

## 1 · Housekeeping

### 1.1 Load the Airtable secrets

Repo → Settings → Secrets and variables → Actions:

- `AIRTABLE_BASE` = `appUeif6dV0j9eBed`
- `AIRTABLE_TOKEN` = your personal access token

Paste the token **directly into the GitHub secrets form**. Not into chat,
not into a file, not into a commit.

### 1.2 Check analytics are recording, if you care

Vercel Analytics counts page views. On the free Hobby plan that is 50k a
month with a one-month window, which is plenty. It is a no-op on
localhost by design, so this can only be checked in production.

Nothing depends on it any more. Keep it if you want to know whether
anyone plays; the privacy policy already describes it accurately.

---

## 2 · Getting people to play

Everything is drafted and sitting in `marketing/`. What is left is
sending it, which needs to come from you.

| Do this                              | Where                          |
| ------------------------------------ | ------------------------------ |
| Regenerate posters with the real URL | `scripts/make-ads.mjs`         |
| Post to Nextdoor first               | `marketing/outreach/launch.md` |
| Email local press                    | same file, draft included      |
| Email the museum                     | `marketing/outreach/museum.md` |

Order matters. Nextdoor first, alone, for a week.

**Social accounts.** I can't create accounts, so those are yours if you
want them. You do not need them — Nextdoor and local press do not require
an Instagram.

---

## 3 · Images

Read `marketing/README.md` before using any photograph. The site being
non-commercial removes the hardest constraint there is, and opens
everything licensed for non-commercial or educational use. What still
applies: attribution is not optional, share-alike is still viral, a
recognisable face still needs that person's permission, and searching
stock sites for "Fremont" still returns mostly Las Vegas.

---

## No longer applies

The site does not make money. Sponsorship is gone — the component, the
picker, its tests, the CSV, the pipeline validation, the styles, the
README section, and the two paragraphs of privacy policy that described
it. The privacy page now says plainly that nothing here is advertising
and nothing is for sale, because that is true again.

Which also deletes, unread: the Vercel Pro upgrade (custom events were
only ever needed to count sponsor clicks), the lawyer review before
taking money, sponsor pricing, and the "Advertise with us" page.

## Deferred, on purpose

**Content pipeline warnings.** `npm run content` reports 7: "Alameda" and
"Niles" each appear in 6 Groups categories, and five Higher-or-Lower
units have duplicate values that can never make a fair round. Not urgent,
not broken — but they narrow the puzzle pool.

## What I still owe you

The glass bar has nothing behind it — content never passes under it on
any screen. Fixing it means letting `main` run under the bar, which also
hands back ~65px of vertical space. It touches all five games and both
breakpoints, so it is waiting on your go-ahead.
