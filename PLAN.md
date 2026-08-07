# What's left, and who does it

Everything here needs a password, a card, a signature, or your name on
it — which is why it is a list for you rather than work already done.
Ordered so that nothing waits on something further down.

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

### 0.2 Tell me the production URL

I do not have it, and it blocks four things: the posters, the link-preview
tags, every outreach email, and confirming analytics are live.

Then:

```bash
SITE_URL=https://your-real-domain node scripts/make-ads.mjs
```

Until you do, all four posters read **SET-YOUR-DOMAIN** in bold across
the bottom. That is deliberate — a poster with a placeholder domain is
worse than no poster.

---

## 1 · Before you take a single dollar

### 1.1 Find out which Vercel plan you are on

https://vercel.com/dashboard → your project → Settings → General.

This is not a billing detail, it decides whether your revenue works:

- **Hobby** — page views only, 50k/month, one-month history, and
  **custom events are silently dropped**. Your `sponsor_click` event will
  record nothing. You will be selling sponsors a click-through number you
  cannot produce.
- **Pro** — custom events work, capped at 2 properties per event, which
  is exactly what `sponsor_click` sends (`name`, `day`).

If you are on Hobby and intend to charge for sponsorship, you need Pro
before the first invoice, not after.

### 1.2 Get the legal pages in front of a lawyer

`src/components/Legal.jsx` is written honestly and says what the site
actually does — that is not the same as being legally sufficient once
money changes hands. An hour of a small-business attorney's time is the
cheapest thing on this list.

Specifically ask about: taking money from local businesses as an
individual rather than an entity; whether you need an LLC before
invoicing; and whether your privacy language covers what Vercel
Analytics collects.

### 1.3 Decide what a sponsor actually buys

Write it down before anyone asks. A week? A month? What does the line
look like? What do you promise — impressions, clicks, nothing? What
happens if they want a refund?

You cannot promise clicks until 1.1 is resolved.

---

## 2 · Before you launch publicly

### 2.1 Confirm analytics are actually recording

Open the live site, play a puzzle, then check the Vercel Analytics tab
for the visit. Locally it is a no-op by design — `mode` is
`development` on localhost — so this can only be verified in production.

If it shows nothing, nothing you do in section 3 will be measurable.

### 2.2 Know how you will read retention

For a daily puzzle the only number that matters is **did they come back
tomorrow**. Not visits, not time on page. Decide now how you will read it
out of whatever plan you are on, because you cannot reconstruct it later.

If Hobby's one-month window is all you have, export or screenshot weekly.

### 2.3 Load the Airtable secrets

Repo → Settings → Secrets and variables → Actions:

- `AIRTABLE_BASE` = `appUeif6dV0j9eBed`
- `AIRTABLE_TOKEN` = your personal access token

Paste the token **directly into the GitHub secrets form**. Not into chat,
not into a file, not into a commit.

---

## 3 · Advertising

Everything is drafted and sitting in `marketing/`. What is left is
sending it, which needs to come from you.

| Do this                              | Where                          |
| ------------------------------------ | ------------------------------ |
| Regenerate posters with the real URL | `scripts/make-ads.mjs`         |
| Post to Nextdoor first               | `marketing/outreach/launch.md` |
| Email local press                    | same file, draft included      |
| Email the museum                     | `marketing/outreach/museum.md` |

Order matters. Nextdoor first, alone, for a week. It is the densest
concentration of the exact audience and it will tell you whether the
thing holds people before you spend anything reaching further.

**Social accounts.** I can't create accounts, so those are yours to set
up if you want them. You do not need them to start — Nextdoor and local
press do not require an Instagram.

**Do not buy ads yet.** You do not know your retention. Paid traffic into
a leaky bucket buys a number and teaches you nothing.

---

## 4 · Images

Read `marketing/README.md` before using any photograph anywhere. Short
version: findable is not licensed, "free for commercial use" often is
not, and searching stock sites for "Fremont" mostly returns Las Vegas.

Everything shipping today is drawn by our own code, so there is nothing
to clear. The two clean routes to real photographs are US publication in
1930 or earlier, and licensing directly from the holder — which is what
the museum email opens.

---

## Deferred, on purpose

- **The "Advertise with us" page.** You said hold it. Say the word.
- **Content pipeline warnings.** `npm run content` reports 7: "Alameda"
  and "Niles" each appear in 6 Groups categories, and five Higher-or-Lower
  units have duplicate values that can never make a fair round. Not
  urgent, not broken — but they narrow the puzzle pool.

## What I still owe you

- The glass bar has nothing behind it — content never passes under it on
  any screen. Fixing it means letting `main` run under the bar, which
  also hands back ~65px of vertical space. It touches all five games and
  both breakpoints, so it is waiting on your go-ahead.
- The nav labels and the static first paint are done and pushed.
