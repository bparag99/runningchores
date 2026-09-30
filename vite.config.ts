import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vite only exposes vars prefixed with VITE_ to client code by default.
  // `PASSWORD` is added so the admin sign-in password can be supplied as a
  // plain `PASSWORD` secret (e.g. on the hosting provider) without renaming it.
  // NOTE: anything exposed this way is embedded in the client bundle and is
  // therefore readable by anyone who can load the page. See src/admin/README-ENV.md.
  envPrefix: ['VITE_', 'PASSWORD'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Allow local tunnels (for example ngrok) to reach the dev server.
    allowedHosts: ['.ngrok-free.dev', '.ngrok.app', '.ngrok-free.app', '.ngrok.io'],
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['.ngrok-free.dev', '.ngrok.app', '.ngrok-free.app', '.ngrok.io'],
  },
})
