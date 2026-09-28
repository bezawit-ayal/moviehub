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

## Deployment note

`vite.config.js` has no `base` option, so the app is served from the
domain root. Deploying to a subpath requires setting `base` accordingly.

This product uses the TMDB API but is not endorsed or certified by TMDB.
