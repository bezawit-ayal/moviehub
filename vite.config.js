import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Paths the SPA actually serves. Keep in sync with the <Route> list in
 * src/App.jsx — anything else is a genuine miss, not a client-side route
 * waiting to be painted in.
 */
const KNOWN_ROUTES = new Set(['/', '/search', '/watchlist']);
const MOVIE_ROUTE = /^\/movie\/[^/]+$/;

const isKnownRoute = (pathname) => {
    const normalized =
        pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

    return KNOWN_ROUTES.has(normalized) || MOVIE_ROUTE.test(normalized);
};

/**
 * Serves the app shell with a real 404 status for unknown URLs. Without
 * this the SPA fallback returns 200 and the browser gets a "soft" 404,
 * which crawlers and uptime checks treat as a valid page.
 */
const spaNotFound = () => {
  const middleware =
    (indexFile, transform) => async (req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();

      // Only navigation requests; lets module, asset and HMR traffic through.
      const accept = req.headers.accept ?? '';
      if (!accept.includes('text/html')) return next();

      const { pathname } = new URL(req.url, 'http://localhost');
      if (isKnownRoute(pathname)) return next();

      try {
        let html = await readFile(indexFile, 'utf-8');

        if (transform) html = await transform(pathname, html);

        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(html);
      } catch (error) {
        next(error);
      }
    };

  return {
    name: 'moviehub:spa-404',

    configureServer(server) {
      const indexFile = path.join(rootDir, 'index.html');
      server.middlewares.use(
        middleware(indexFile, (url, html) =>
          server.transformIndexHtml(url, html)
        )
      );
    },

    configurePreviewServer(server) {
      const outDir = path.resolve(rootDir, 'dist');
      server.middlewares.use(
        middleware(path.join(outDir, 'index.html'), null)
      );
    },
  };
};

/**
 * Content Security Policy for the built app. Every origin listed is one
 * the bundle actually talks to; anything else is blocked outright.
 *
 * `style-src` allows inline styles because hero.jsx sets a dynamic
 * background-image. That value is built by our own `backdropUrl()` from a
 * TMDB path, never from raw user input, so the exposure is limited to
 * CSS injection rather than script execution.
 *
 * Applied at build time only. Vite's dev server injects an inline React
 * Refresh preamble that a strict `script-src` would reject.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  'img-src \'self\' data: https://image.tmdb.org https://img.youtube.com',
  "connect-src 'self' https://api.themoviedb.org",
  "form-action 'self'",
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

/**
 * Headers a `<meta>` tag cannot express. They only take effect when the
 * host sends them, so the local servers set them too and `npm run preview`
 * behaves like production. Production hosts must send the same set, plus
 * `Strict-Transport-Security` and `frame-ancestors 'none'` — see README.
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const cspPlugin = () => ({
  name: 'moviehub:csp',
  apply: 'build',

  transformIndexHtml() {
    return [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
        injectTo: 'head-prepend',
      },
      {
        tag: 'meta',
        attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' },
        injectTo: 'head-prepend',
      },
    ];
  },
});

export default defineConfig({
  plugins: [react(), spaNotFound(), cspPlugin()],

  server: { headers: SECURITY_HEADERS },
  preview: { headers: SECURITY_HEADERS },
});
