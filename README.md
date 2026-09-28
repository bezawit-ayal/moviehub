# MovieHub

A movie discovery app built with React and Vite, powered by the
[TMDB API](https://www.themoviedb.org/).

## Features

- Trending, popular, top rated, and upcoming movie rows on the home page
- Search with paginated results, synced to the URL
- Discover page with genre, release year, and minimum rating filters
- Responsive layout with a sticky navbar and a site footer
- 404 page and a top-level error boundary

## Requirements

- Node.js 20 or newer
- A free TMDB API key (v3 auth)

## Project structure

```
src/
  main.jsx            entry point (mounts App)
  App.jsx             router + app shell (navbar / page / footer)
  App.css             app shell layout
  index.css           design tokens, resets, shared UI primitives
  pages/              one file per route
    home.jsx / home.css
    search.jsx / search.css
    discover.jsx / discover.css
    notfound.jsx      self-contained 404, styles inlined
  components/         one .jsx + one .css per component
    navbar, footer, moviecard, moviegrid,
    movieskeleton, skeletongrid, searchbar,
    errorboundary
  services/
    tmdbapi.js        all TMDB requests live here
public/
  favicon.svg
```

Two rules the layout follows:

- Each component owns its stylesheet, except `NotFound`, which keeps its
  CSS in a `<style>` block so the 404 stays a single file.
- Anything used by more than one page (`.container`, `.section-label`,
  `.pagination`, the buttons) lives in `index.css`, not in a page file.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get an API key from
   [TMDB API settings](https://www.themoviedb.org/settings/api)
   (sign in, then find the **API Key (v3 auth)** value).

3. Create your local env file:

   ```bash
   cp .env.example .env      # macOS / Linux
   copy .env.example .env     # Windows
   ```

   Then paste your key into `.env`:

   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## About the API key

Vite inlines every `VITE_`-prefixed variable into the built JavaScript
bundle as plain text. The TMDB key is therefore **not a secret** — anyone
who opens devtools on the deployed site can read it. This is expected
behaviour for a client-side Vite app, not a misconfiguration.

To keep the key private, proxy TMDB requests through a small server and
keep the key in a non-`VITE_` environment variable on that server.

`.env` is git-ignored. Never commit it.

> **A key was committed to this repository's history** in commit `b25a7a5`
> and later deleted. The file is gone from `HEAD`, but the value remains
> retrievable from the git history, and this repository is public. Treat
> that key as compromised: **revoke it at
> [TMDB settings](https://www.themoviedb.org/settings/api) and issue a new
> one.** Rotation — not history rewriting — is what actually closes the
> exposure, because the value may already have been cloned or cached.
>
> To stop future leaks, add a secret scanner to CI, or proxy TMDB through
> a server so no key ever lives in the bundle.

## Security headers

`vite.config.js` injects a Content-Security-Policy and `referrer`
`<meta>` tag into the built `index.html`, and sets `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` on the dev
and preview servers. The CSP is build-time only: Vite's dev server injects
an inline React Refresh preamble that a strict `script-src` would reject.

A `<meta>` tag cannot express every directive. Production hosts must also
send these as real response headers:

| Header | Value |
| --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | `frame-ancestors 'none'` (ignored in `<meta>`) |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

The app talks to exactly four external origins — `api.themoviedb.org`,
`image.tmdb.org`, `img.youtube.com` and Google Fonts — and each is
allow-listed explicitly. If you add a new integration, update `CSP` in
`vite.config.js` or it will be blocked.

## Deployment note

`vite.config.js` has no `base` option, so the app is served from the
domain root. Deploying to a subpath requires setting `base` accordingly.

## 404 handling

This is a single-page app, so a plain static host answers every unknown
URL with `index.html` and a `200 OK`. The browser then paints the 404
view, but the response itself is a "soft" 404 — crawlers and uptime
checks read it as a valid page.

`npm run dev` and `npm run preview` return a real `404` for unknown URLs
via the `moviehub:spa-404` plugin in `vite.config.js`. The plugin serves
the normal app shell with a `404` status, so the React router still
renders the 404 page and deep links keep working.

That plugin only covers the local servers. A static host needs its own
rule to do the same in production:

| Host | Config |
| --- | --- |
| Netlify | `public/_redirects` is already included |
| Vercel | `vercel.json` with a rewrite to `/index.html` and `"status": 404` |
| nginx | `error_page 404 /index.html;` combined with `try_files $uri $uri/ /index.html;` |
| Apache | `ErrorDocument 404 /index.html` |

When adding a route to `src/App.jsx`, add it to the `KNOWN_ROUTES` set in
`vite.config.js` too, or deep links to it will return `404`.

This product uses the TMDB API but is not endorsed or certified by TMDB.
