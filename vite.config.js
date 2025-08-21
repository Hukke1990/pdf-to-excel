import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/convert': 'http://localhost:3001',
      '/debug': 'http://localhost:3001',
      '/health': 'http://localhost:3001'
    }
  }
})
