import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: 'app',
  envDir: '..',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app/src"),
    },
  },
  build: {
    outDir: '../dist',
  },
  plugins: [react(), tailwindcss()],
})
