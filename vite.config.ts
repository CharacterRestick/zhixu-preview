import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const tunnelHosts = [
  '.serveousercontent.com',
  '.lhr.life',
  '.trycloudflare.com',
  '.localtunnel.me',
]

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 4173,
    allowedHosts: tunnelHosts,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    allowedHosts: tunnelHosts,
  },
})
