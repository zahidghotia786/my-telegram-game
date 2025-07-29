import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: true,
    cors: true,
    allowedHosts: ['af5d554a3804.ngrok-free.app', 'localhost']
  }
})
