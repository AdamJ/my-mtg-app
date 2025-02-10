import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // or 'prompt'
      injectRegister: 'auto',
      workbox: {
        // these options are examples
        // disable precaching in development
        // dont precache images
        // runtimeCaching: [
        //   {
        //     urlPattern: ({ url }) => {
        //       return !!url.pathname.match(
        //         /^.*\.(?:eot|otf|woff|woff2|ttf|svg|png|jpe?g|gif|webp|ico|webm|mp3|mp4)$/i
        //       );
        //     },
        //     handler: 'CacheFirst',
        //     options: {
        //       cacheName: 'static-resources',
        //       expiration: {
        //         maxEntries: 30,
        //         maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        //       },
        //     },
        //   },
        // ],
      },
      // add this to cache all the static assets
      includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'MTG Life Counter', // Your app's name
        short_name: 'MTG Life', // Short name (for the app icon)
        description: 'A Magic: The Gathering life counter and deck list app.',
        theme_color: '#171717', // Customize theme color
        icons: [
          {
            src: '/android-chrome-192x192.png', // Path to your icon
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png', // Path to your icon
            sizes: '512x512',
            type: 'image/png',
          },
          // ... other icon sizes
        ],
      },
    }),
  ],
})
