import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  appType: 'spa',
  images: [
    ''
  ],
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // or 'prompt'
      devOptions: {
        enabled: true
      },
      injectRegister: 'auto',
      workbox: {
        // these options are examples
        // disable precaching in development
        // dont precache images
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return !!url.pathname.match(
                /^.*\.(?:eot|otf|woff|woff2|ttf|svg|png|jpe?g|gif|webp|ico|webm|mp3|mp4)$/i
              );
            },
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
              },
            }
          },
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      // add this to cache all the static assets
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png', 'pwa-512x512.png', 'pwa-192x192.png', 'pwa-64x64.png', 'robots.txt', 'tap-icon.svg', 'tap-icon.png'],
      manifest: {
        name: 'MTG Life Counter and Deck List', // Your app's name
        short_name: 'MTG Life', // Short name (for the app icon)
        description: 'A Magic: The Gathering life counter and deck list app.',
        theme_color: '#171717', // Customize theme color
        icons: [
          {
            src: '/pwa-64x64.png', // Path to your icon
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/pwa-192x192.png', // Path to your icon
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png', // Path to your icon
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/maskable-icon-512x512.png', // Path to your icon
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/apple-touch-icon-180x180.png', // Path to your icon
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/favicon.ico', // Path to your icon
            type: 'image/ico',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
    external: [
      new RegExp('src/assets/card_data.json')
    ],
  },
  server: {
    port: 7150,
    host: true,
  },
  preview: {
    port: 7070,
    open: true,
    host: true,
    https: false,
  },
  base: '/my-mtg-app/', // Change this to your repo name
})
