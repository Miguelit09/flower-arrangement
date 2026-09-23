import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Repo Pages: https://Miguelit09.github.io/flower-arrangement/
  base: '/flower-arrangement/',
})
