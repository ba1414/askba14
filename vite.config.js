import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/askba14/',     // 👈 repo name on GitHub
  plugins: [react()],
  server: {
    port: 8000
  }
})

