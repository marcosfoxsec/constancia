import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// O app é servido em subcaminho no GitHub Pages (/<repo>/), então tudo —
// inclusive o manifest e o service worker — depende do BASE_PATH.
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      // Manifest e estratégia de cache completos entram no bloco 6.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Constância',
        short_name: 'Constância',
        start_url: base,
        scope: base,
        display: 'standalone',
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
})
