// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // 👇 This line helps with SPA fallback
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  server: {
    historyApiFallback: true, // local dev
  },
  preview: {
    historyApiFallback: true, // for preview build
  }
})
