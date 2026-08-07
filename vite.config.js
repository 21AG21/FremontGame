import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Open Graph wants absolute URLs — a relative og:image is ignored by
// most of the scrapers that matter, which is a share card that silently
// does not appear. Rather than hard-code a domain that will be wrong the
// first time this moves, resolve it at build time:
//
//   SITE_URL                          set it yourself, wins over everything
//   VERCEL_PROJECT_PRODUCTION_URL     Vercel sets this on every build
//   localhost                         dev, where nothing scrapes anyway
//
// Vercel also exposes VERCEL_URL, which is the per-deployment hostname.
// That one is deliberately not used: it changes on every push, and a
// preview build's card should still point at production.
const siteUrl = () => {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:5173'
}

const injectSiteUrl = () => ({
  name: 'inject-site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl()),

  // robots.txt and sitemap.xml are emitted here rather than kept in
  // public/ for the same reason as og:image: a sitemap has to carry
  // absolute URLs, and one with the wrong domain in it is worse than
  // none at all. Note that this beats public/robots.txt rather than
  // merging with it — a copy put there is silently discarded, so the
  // rules below are the only ones that ship.
  generateBundle() {
    const base = siteUrl()
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      // /lens-test.html is a browser probe kept in public/ so it can be
      // re-run against a future Safari. Being unlinked was enough while
      // nobody was looking at the site; it is not enough now that the
      // domain is going to a newspaper, because crawlers find URLs from
      // referrers and certificate logs, not only from links. The page
      // also carries its own noindex — this stops the fetch, that stops
      // the listing.
      source: `User-agent: *\nAllow: /\nDisallow: /lens-test.html\n\nSitemap: ${base}/sitemap.xml\n`,
    })
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source:
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `  <url>\n` +
        `    <loc>${base}/</loc>\n` +
        `    <changefreq>daily</changefreq>\n` +
        `    <priority>1.0</priority>\n` +
        `  </url>\n` +
        `</urlset>\n`,
    })
  },
})

export default defineConfig({
  plugins: [
    react(),
    injectSiteUrl(),

    // Installable, and playable with no signal.
    //
    // Both of those are product decisions rather than box-ticking. A
    // daily habit lives or dies on how many taps stand between waking up
    // and playing, and an icon on the home screen removes all of them.
    // Offline matters because a good part of this town commutes on BART,
    // which loses signal under the bay — and the puzzle needs no server
    // to work out what day it is, so there is nothing to wait for.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'og.png'],
      manifest: {
        id: '/',
        name: 'The Fremont Daily',
        short_name: 'Fremont',
        description: 'Five daily puzzles about Fremont, California.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        lang: 'en-US',
        categories: ['games', 'education'],
        background_color: '#e7efe5',
        theme_color: '#e7efe5',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // The whole app is one bundle plus fonts, and all of it is
        // content-hashed, so precaching it outright is both simple and
        // correct — there is no version skew to reason about.
        globPatterns: ['**/*.{js,css,html,woff,woff2,png,svg,txt}'],
        // A single-page app has no routes to fall back from, and
        // /?sheet is the same document. Anything not precached is a
        // deploy that has moved on, so go and get it.
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        // Off in dev. A service worker caching a dev server is a way to
        // spend an afternoon debugging a file you already fixed.
        enabled: false,
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
  },
})
