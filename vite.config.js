import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/askba14/',
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})
