import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages the app is served from https://<user>.github.io/portfolio/,
// so production assets must resolve under the /portfolio/ base path.
// Local dev (`npm run dev`) keeps the root base.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/portfolio/' : '/',
  plugins: [react()],
}))
