import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";
import icons from './public/icons.json'

const manifestforPlugin = {
  // registerType: "prompt",
  registerType: 'autoUpdate',
  // includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
  manifest: {
    // ...icons,
    name: "VAIRIFY",
    short_name: "VAIRIFY",
    description: "VAIRIFY is for sex workers.",
    theme_color: "#171717",
    background_color: "#e8ebf2",
    display: "standalone",
    scope: "/",
    start_url: "",
    orientation: "portrait",
    icons: [
      {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png'
      },
      {
        src: 'pwa-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestforPlugin)],
  server: {
    host: '0.0.0.0',
    port: 5173, 
  }
})
