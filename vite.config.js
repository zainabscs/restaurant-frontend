import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/restaurant-website/frontend/', // 👈 Set the base path here
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    historyApiFallback: true, // local dev
  },
  preview: {
    historyApiFallback: true, // for preview build
  },
})