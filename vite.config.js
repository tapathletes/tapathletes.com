import { defineConfig } from 'vite';

/**
 * Dev-only Vite config for tapathletes.com.
 *
 * Purpose: live preview during development (`npm run dev`).
 * Production: GitHub Pages serves the static files in this directory
 * (index.html, styles/*.css, sub-page directories) directly. No build
 * step is run for production. Do not run `vite build` — there is no
 * dist artifact to deploy.
 */
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    host: 'localhost',
    // open: false — do not auto-launch a browser. Navigate manually
    // to the URL printed in the terminal.
  },
});
