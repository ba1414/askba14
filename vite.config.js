import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // <--- This MUST be just a slash
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
