import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env files

export default defineConfig({
  // define: {
  //   __APP_API_URL__: JSON.stringify("https://api.scryfall.com/bulk-data/oracle-cards"), // Use a placeholder, NOT process.env
  // },
  appType: 'spa',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      injectManifest: {
        swSrc: 'public/service-worker.js',
        swDest: 'dist/service-worker.js',
        globDirectory: 'dist',
        globPatterns: [
          '**/*.{js,css,json,html,ico,png,svg}',
        ],
      },
      injectRegister: null,
      manifest: false,
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              !!url.pathname.match(
                /^.*\.(?:eot|otf|woff|woff2|ttf|svg|png|jpe?g|gif|webp|ico|webm|mp3|mp4)$/i
              ),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
      // add this to cache all the static assets
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'apple-touch-icon-180x180.png',
        'maskable-icon-512x512.png',
        'pwa-512x512.png',
        'pwa-192x192.png',
        'pwa-64x64.png',
        'robots.txt',
        'tap-icon.svg',
        'tap-icon.png',
      ],
    }),
  ],
  build: {
    rollupOptions: {
      external: [new RegExp('src/assets/card_data.json')],
    },
    sourcemap: true,
    outDir: 'dist/',
  },
  server: {
    port: 7150,
    proxy: {
      '/api': {
        target: "https://api.scryfall.com/bulk-data/oracle-cards",
        changeOrigin: true,
        secure: false,
      },
    },
    host: true,
  },
  preview: {
    port: 7070,
    open: true,
    host: true,
    https: false,
  },
  publicDir: 'public',
  base: '/my-mtg-app/',
});
