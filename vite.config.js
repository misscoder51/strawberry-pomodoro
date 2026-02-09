import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/strawberry-pomodoro/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['strawberry-favicon.png', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Pomodoro Timer',
        short_name: 'Pomodoro',
        description: 'A cute pink pomodoro timer for focus.',
        theme_color: '#f9c5d1',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
